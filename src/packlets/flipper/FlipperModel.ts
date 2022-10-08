export interface FlipperModel {
  setFlipped(flipped: boolean): void
  pointerDown(): void
  pointerMove: (delta: number) => void
  pointerUp(): void
}
