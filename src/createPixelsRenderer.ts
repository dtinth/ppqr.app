import { createExplosionRenderer, Block } from './createExplosionRenderer'

export type PixelPosition = { x: number; y: number }

export default function createPixelsRenderer(el: HTMLDivElement) {
  let width = 0
  let height = 0
  let canvas: HTMLCanvasElement
  let explosion: ReturnType<typeof createExplosionRenderer>
  let bgCanvas: HTMLCanvasElement
  let maskCanvas: HTMLCanvasElement
  let maskDiv: HTMLDivElement
  let previousBlackPixels: { [xy: string]: true } = {}

  function initCanvas(w: number, h: number) {
    width = w
    height = h
    if (!bgCanvas) {
      bgCanvas = document.createElement('canvas')
      el.appendChild(bgCanvas)
    }
    bgCanvas.width = w * 8
    bgCanvas.height = h * 8

    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.style.background = 'transparent'
      canvas.classList.add('qr-explosion')
      explosion = createExplosionRenderer(canvas)
      el.appendChild(canvas)
    }
    explosion.setSize(w)

    if (!maskCanvas) {
      maskCanvas = document.createElement('canvas')
      maskDiv = document.createElement('div')
      maskDiv.className = 'qrcode-artistic-mask'
      el.appendChild(maskDiv)
    }
    drawMask(w)
    maskDiv.style.webkitMaskImage = `url("${maskCanvas.toDataURL()}")`
    maskDiv.style.webkitMaskSize = `cover`
  }

  function drawMask(size: number) {
    const g = 16
    const dotSize = 0.175
    maskCanvas.width = size * g
    maskCanvas.height = size * g
    const ctx = maskCanvas.getContext('2d')!
    maskCanvas.style.opacity = '0.5'
    ctx.clearRect(0, 0, size * g, size * g)
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(size * g, 0)
    ctx.lineTo(size * g, size * g)
    ctx.lineTo(0, size * g)
    ctx.closePath()
    for (let y = 4; y < size - 4; y++) {
      for (let x = 4; x < size - 4; x++) {
        ctx.ellipse(
          (x + 0.5) * g,
          (y + 0.5) * g,
          dotSize * g,
          dotSize * g,
          0,
          Math.PI * 2,
          0,
          true,
        )
        ctx.closePath()
      }
    }
    ctx.fill()
    ctx.clearRect(4 * g, 4 * g, 7 * g, 7 * g)
    ctx.clearRect((size - 11) * g, 4 * g, 7 * g, 7 * g)
    ctx.clearRect(4 * g, (size - 11) * g, 7 * g, 7 * g)
    ctx.clearRect(10 * g, 10 * g, g, (size - 21) * g)
    ctx.clearRect(10 * g, 10 * g, (size - 21) * g, g)
    ctx.clearRect((size - 13) * g, (size - 13) * g, 5 * g, 5 * g)
  }

  const k = (x: number, y: number) => [x, y].toString()

  function updateSprites(pixels: PixelPosition[]) {
    const blackPixels: { [xy: string]: true } = {}
    const blocks: Block[] = []
    for (const { x, y } of pixels) {
      blackPixels[k(x, y)] = true
    }
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (!previousBlackPixels[k(x, y)] && blackPixels[k(x, y)]) {
          blocks.push({ x, y, color: 1 })
        } else if (previousBlackPixels[k(x, y)] && !blackPixels[k(x, y)]) {
          blocks.push({ x, y, color: 0 })
        }
      }
    }
    previousBlackPixels = blackPixels
    explosion.addBlocks(blocks)
  }

  function draw(pixels: PixelPosition[]) {
    const bgContext = bgCanvas.getContext('2d')!
    bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
    for (const { x, y } of pixels) {
      bgContext.fillRect(x * 8, y * 8, 8, 8)
    }
  }

  return {
    update(w: number, h: number, pixels: PixelPosition[]) {
      if (w !== width || h !== height) {
        initCanvas(w, h)
      }
      draw(pixels)
      updateSprites(pixels)
    },
    dispose() {
      if (canvas) {
        canvas.remove()
        explosion.dispose()
      }
    },
  }
}
