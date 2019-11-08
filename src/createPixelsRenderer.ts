import { createExplosionRenderer, Block } from './createExplosionRenderer'

export type PixelPosition = { x: number; y: number }

export default function createPixelsRenderer(el: HTMLDivElement) {
  let width = 0
  let height = 0
  let canvas: HTMLCanvasElement
  let explosion: ReturnType<typeof createExplosionRenderer>
  let bgCanvas: HTMLCanvasElement
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
      explosion = createExplosionRenderer(canvas)
      el.appendChild(canvas)
    }
    explosion.setSize(w)
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
