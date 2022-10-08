import { FunctionalComponent, ComponentChildren } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

import { createFlipperModel } from './createFlipperModel'

import { FlipperModel } from './FlipperModel'

type FlipperProps = {
  flipped: boolean
  onFlip: (flipped: boolean) => void
  front: ComponentChildren
  back: ComponentChildren
}

/**
 * Flipper is a component that has two sides: front-side and back-side.
 * User can use swipe horizontally to access the other side.
 *
 * @param props.front - React element to display in the front side.
 * @param props.back - React element to display in the front side.
 * @param props.flipped  - Whether to display front or back side.
 * @param props.onFlip - `onFlip(flipped)` Called when user initiates a flip.
 */
const Flipper: FunctionalComponent<FlipperProps> = (props) => {
  const { flipped, onFlip, front, back } = props
  const elRef = useRef<HTMLDivElement>(null)
  const animatorRef = useRef<Nullable<FlipperModel>>(null)
  const activePointerRef =
    useRef<Nullable<{ pointerId: number; lastX: number }>>(null)

  useEffect(() => {
    if (!animatorRef.current) {
      animatorRef.current = createFlipperModel((degrees: number) => {
        if (elRef.current) {
          elRef.current.style.transform = `rotateY(${degrees}deg)`
        }
      }, onFlip)
    }
    animatorRef.current.setFlipped(!!flipped)
  }, [flipped, onFlip])

  const handlePointerDown: PreactPointerEventHandler<HTMLDivElement> = (e) => {
    if (!activePointerRef.current) {
      activePointerRef.current = { pointerId: e.pointerId, lastX: e.clientX }
      animatorRef.current?.pointerDown()
    }
  }
  const handlePointerMove: PreactPointerEventHandler<HTMLDivElement> = (e) => {
    if (!activePointerRef.current) return
    const activePointer = activePointerRef.current
    if (activePointer.pointerId !== e.pointerId) return
    const delta =
      ((e.clientX - activePointer.lastX) /
        ((elRef.current as HTMLDivElement)?.offsetWidth || 1)) *
      180
    activePointer.lastX = e.clientX
    animatorRef.current?.pointerMove(delta)
  }
  const handlePointerUp: PreactPointerEventHandler<HTMLDivElement> = (_e) => {
    animatorRef.current?.pointerUp()
    activePointerRef.current = null
  }
  const handlePointerCancel: PreactPointerEventHandler<HTMLDivElement> = (
    _e,
  ) => {
    animatorRef.current?.pointerUp()
    activePointerRef.current = null
  }

  return (
    <div
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className={'Flipper' + (flipped ? ' is-flipped' : '')}>
        <div className="Flipperのrotor" ref={elRef}>
          <div className="Flipperのfront">{front}</div>
          <div className="Flipperのback">{back}</div>
        </div>
      </div>
    </div>
  )
}

export default Flipper
