import { FlipperModel } from './FlipperModel'

// This model object takes care of the state and animation and handles input.
export function createFlipperModel(
  setRotationDegrees: (degrees: number) => void,
  onFlip: (flippped: boolean) => void,
): FlipperModel {
  // XXX: A lot of mutable variables here!!!
  //      If you are up for a challenge, please help clean up this code!

  /** Current rotation to be rendered (degrees) */
  let current: number = 0

  /** Target rotation (degrees) */
  let target: number = 0

  /** Current rotation speed (degrees/frame) */
  let currentSpeed: number = 0

  /** Spring strength */
  const springK: number = 1 / 15

  /** Rotation acceleration (degrees/frame^2) */
  const acceleration: number = 0.7

  // Animation parameters...
  let animationActive: boolean = false
  let animationStartTime: number = Date.now()
  let lastFrameNumber: number = 0

  /** State of dragging */
  let pointerIsDown = false
  let history: { time: number; current: number }[] = []

  // Returns whether an animation should run.
  function shouldAnimate() {
    // Don’t animate while dragging
    if (pointerIsDown) return false

    const finished = current === target && Math.abs(currentSpeed) < 0.5
    return !finished
  }

  // Ensure that animation frame is requested (if an animation is needed).
  function updateAnimation() {
    if (!animationActive && shouldAnimate()) {
      animationStartTime = Date.now()
      lastFrameNumber = 0
      window.requestAnimationFrame(frame)
      animationActive = true
    }
  }

  // The animation frame. Calls update (handle frameskip) and draw.
  function frame() {
    if (!animationActive) return
    const expectedFrameNumber = ((Date.now() - animationStartTime) / 1000) * 60
    const updateCount = Math.min(expectedFrameNumber - lastFrameNumber, 10)
    lastFrameNumber = expectedFrameNumber
    for (let i = 0; i < updateCount; i++) {
      update()
      if (!shouldAnimate()) {
        animationActive = false
        break
      }
    }
    draw()
    if (animationActive) {
      window.requestAnimationFrame(frame)
    }
  }

  // Animation update logic.
  function update() {
    const bestSpeed = (target - current) * springK
    currentSpeed = linearlyApproach(currentSpeed, bestSpeed, acceleration)
    current += currentSpeed
    if (Math.abs(current - target) < 0.1) {
      current = target
    }
  }

  // Linearly approach target by at most delta.
  function linearlyApproach(current: number, target: number, delta: number) {
    if (Math.abs(current - target) < delta) {
      return target
    } else if (current < target) {
      return current + delta
    } else {
      return current - delta
    }
  }

  // Animation draw logic.
  function draw() {
    setRotationDegrees(current)
  }

  // Based on current animation state, simulate the projected rotation angle
  // if we allow the spinning to stop without intervention.
  function getProjection(): number {
    let projection: number = current
    let speed: number = currentSpeed
    for (let i: number = 0; i < 600; i++) {
      const targetSpeed = speed * (1 - springK)
      speed = linearlyApproach(speed, targetSpeed, acceleration)
      projection += speed
    }
    return projection
  }

  // Based on the animation target angle, are we showing the back side?
  function isFlipped(angle: number): boolean {
    return Math.round(angle / 180) % 2 !== 0
  }

  // Flips the flipper (if necessary).
  //
  // - `flipped` Set to true to display the backside or false for front side.
  function flip(flipped: boolean): void {
    const projection = getProjection()
    target = getTargetAngle(projection, flipped)
    updateAnimation()
  }

  // Based on the projected angle `projection` and desired `flipped` state,
  // determine the optimal angle to rotate the flipper to.
  function getTargetAngle(projection: number, flipped: boolean): number {
    const offset = flipped ? 180 : 0
    return Math.round((projection - offset - 1) / 360) * 360 + offset
  }

  // Queue a draw frame (for use when animation is not active).
  let pendingDraw = false
  function queueDraw() {
    if (pendingDraw) return
    pendingDraw = true
    window.requestAnimationFrame(() => {
      pendingDraw = false
      draw()
    })
  }

  return {
    setFlipped(flipped) {
      flip(flipped)
    },
    pointerDown() {
      pointerIsDown = true
      history.length = 0
      history.push({ time: Date.now(), current })
    },
    pointerMove(delta) {
      current += delta
      queueDraw()

      // Maintain a brief history of dragging to calculate the ending drag speed.
      history.push({ time: Date.now(), current })
      while (history.length > 1 && history[0].time < Date.now() - 100) {
        history.shift()
      }
    },
    pointerUp() {
      pointerIsDown = false

      // Set the rotation speed to the ending speed of dragging.
      if (history.length > 0) {
        const dt = ((Date.now() - history[0].time) / 1000) * 60
        const dx = current - history[0].current
        const dragSpeed = Math.max(-25, Math.min(25, dx / dt))
        currentSpeed = dragSpeed
      }

      // Signal the flipping intent.
      const projection = getProjection()
      if (Math.abs(projection - target) > 90) {
        onFlip(!isFlipped(target))
      }
      updateAnimation()
    },
  }
}
