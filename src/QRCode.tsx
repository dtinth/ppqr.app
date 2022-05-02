import { Component, FunctionalComponent } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import * as qr from 'qrcode'
import createPixelsRenderer from './createPixelsRenderer'

type QRCodeProps = {
  payload: string | qr.QRCodeSegment[]
}

const QRCode: FunctionalComponent<QRCodeProps> = ({ payload }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const rendererRef =
    useRef<Nullable<ReturnType<typeof createPixelsRenderer>>>(null)
  const payloadRef = useRef<Nullable<QRCodeProps['payload']>>(null)

  useEffect(() => {
    const renderer = createPixelsRenderer(qrCodeRef.current!)
    rendererRef.current = renderer
    return () => renderer.dispose()
  }, [])

  useEffect(() => {
    update(payload)
  }, [payload])

  function update(updatingPayload: QRCodeProps['payload']) {
    payloadRef.current = updatingPayload

    qr.toString(
      updatingPayload,
      { type: 'svg', errorCorrectionLevel: 'L' },
      (err, svg) => {
        if (err) {
          window.alert('Cannot generate QR code: ' + String(err))
          return
        }
        if (updatingPayload === payload) {
          const sizeMatch = /width="(\d+)" height="(\d+)"/.exec(svg)
          if (!sizeMatch) {
            console.log(svg)
            window.alert('Failed to parse SVG...')
            return
          }
          const width = Number(sizeMatch[1]) / 4
          const height = Number(sizeMatch[2]) / 4
          const regexp = /x="(\d+)" y="(\d+)"/g
          const pixels: { x: number; y: number }[] = []
          for (;;) {
            const m: RegExpExecArray = regexp.exec(svg)!
            if (!m) break
            const [_, x, y] = m
            if (!+x && !+y) continue
            pixels.push({ x: Number(x) / 4, y: Number(y) / 4 })
          }
          rendererRef.current?.update(width, height, pixels)
        }
      },
    )
  }
  return <div className="qrcode" ref={qrCodeRef} />
}

export default QRCode
