import { FunctionalComponent } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import * as qr from 'qrcode'
import createPixelsRenderer, { PixelPosition } from './createPixelsRenderer'
import classes from './QRCodeHDR.module.css'
import { isQueryFlagEnabled } from '../query-flags'

type QRCodeProps = {
  payload: string | qr.QRCodeSegment[]
}

const QRCode: FunctionalComponent<QRCodeProps> = ({ payload }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const rendererRef =
    useRef<Nullable<ReturnType<typeof createPixelsRenderer>>>(null)

  useEffect(() => {
    const renderer = createPixelsRenderer(qrCodeRef.current!)
    rendererRef.current = renderer
    return () => renderer.dispose()
  }, [])

  useEffect(() => {
    let payloadChanged = false
    qr.toString(
      payload,
      { type: 'svg', errorCorrectionLevel: 'L' },
      (err, svg) => {
        if (err) {
          window.alert('Cannot generate QR code: ' + String(err))
          return
        }

        // Do not continue if the payload is changed while rendering the QR code.
        if (!payloadChanged) {
          const sizeMatch = /width="(\d+)" height="(\d+)"/.exec(svg)
          if (!sizeMatch) {
            console.log(svg)
            window.alert('Failed to parse SVG...')
            return
          }
          const width = Number(sizeMatch[1]) / 4
          const height = Number(sizeMatch[2]) / 4
          const regexp = /x="(\d+)" y="(\d+)"/g
          const pixels: PixelPosition[] = []
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
    return () => {
      payloadChanged = true
    }
  }, [payload])

  return <div className="qrcode" ref={qrCodeRef} />
}

const QRCodeHDR: FunctionalComponent<QRCodeProps> = ({ payload }) => {
  const [mask, setMask] = useState('')
  // const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let payloadChanged = false
    qr.toCanvas(
      payload,
      { errorCorrectionLevel: 'L', scale: 8 },
      (err, canvas) => {
        if (err) {
          window.alert('Cannot generate QR code: ' + String(err))
          return
        }

        // Do not continue if the payload is changed while rendering the QR code.
        if (!payloadChanged) {
          const ctx = canvas.getContext('2d')!
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          for (let i = 0; i < data.length; i += 4) {
            // Transfer green channel to alpha channel.
            data[i + 3] = data[i + 1]
          }
          ctx.putImageData(imageData, 0, 0)
          setMask(canvas.toDataURL())
        }
      },
    )
    return () => {
      payloadChanged = true
    }
  }, [payload])

  const html = useMemo(() => {
    return `
      <video
        id="qr-video"
        poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQAAAAA3iMLMAAAAAXNSR0IArs4c6QAAAA5JREFUeNpj+P+fgRQEAP1OH+HeyHWXAAAAAElFTkSuQmCC"
        src="data:video/x-m4v;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAvG1kYXQAAAAfTgEFGkdWStxcTEM/lO/FETzRQ6gD7gAA7gIAA3EYgAAAAEgoAa8iNjAkszOL+e58c//cEe//0TT//scp1n/381P/RWP/zOW4QtxorfVogeh8nQDbQAAAAwAQMCcWUTAAAAMAAAMAAAMA84AAAAAVAgHQAyu+KT35E7gAADFgAAADABLQAAAAEgIB4AiS76MTkNbgAAF3AAAPSAAAABICAeAEn8+hBOTXYAADUgAAHRAAAAPibW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAAKcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAw10cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAKcAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAACnAAAAAAABAAAAAAKFbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAABdwAAAD6BVxAAAAAAAMWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABDb3JlIE1lZGlhIFZpZGVvAAAAAixtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHsc3RibAAAARxzdHNkAAAAAAAAAAEAAAEMaHZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAQABAASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAHVodmNDAQIgAAAAsAAAAAAAPPAA/P36+gAACwOgAAEAGEABDAH//wIgAAADALAAAAMAAAMAPBXAkKEAAQAmQgEBAiAAAAMAsAAAAwAAAwA8oBQgQcCTDLYgV7kWVYC1CRAJAICiAAEACUQBwChkuNBTJAAAAApmaWVsAQAAAAATY29scm5jbHgACQAQAAkAAAAAEHBhc3AAAAABAAAAAQAAABRidHJ0AAAAAAAALPwAACz8AAAAKHN0dHMAAAAAAAAAAwAAAAIAAAPoAAAAAQAAAAEAAAABAAAD6AAAABRzdHNzAAAAAAAAAAEAAAABAAAAEHNkdHAAAAAAIBAQGAAAAChjdHRzAAAAAAAAAAMAAAABAAAAAAAAAAEAAAfQAAAAAgAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAQAAAABAAAAJHN0c3oAAAAAAAAAAAAAAAQAAABvAAAAGQAAABYAAAAWAAAAFHN0Y28AAAAAAAAAAQAAACwAAABhdWR0YQAAAFltZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAACxpbHN0AAAAJKl0b28AAAAcZGF0YQAAAAEAAAAATGF2ZjYwLjMuMTAw"
        muted
        autoplay
        playsinline
        defaultmuted
        style="--mask-image: url('${mask}')"
        class="${classes.video}"
      ></video>
    `
  }, [mask])

  useEffect(() => {
    let unblocked = false
    function unblock() {
      if (unblocked) return
      const video = document.getElementById('qr-video') as HTMLVideoElement
      try {
        video.play()
        unblocked = true
      } catch (e) {
        console.error('Unable to play video', e)
      }
    }
    document.addEventListener('pointerdown', unblock)
    return () => {
      document.removeEventListener('pointerdown', unblock)
    }
  }, [])

  // useEffect(() => {
  //   try {
  //     const video = videoRef.current!
  //     video.setAttribute('muted', 'muted')
  //     video.setAttribute('playsinline', 'playsinline')
  //     video.setAttribute('autoplay', 'autoplay')
  //     video.play()
  //   } catch (e) {
  //     console.error('Unable to force video to play', e)
  //   }
  // }, [mask])

  return (
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
    // <video
    //   ref={videoRef}
    //   poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQAAAAA3iMLMAAAAAXNSR0IArs4c6QAAAA5JREFUeNpj+P+fgRQEAP1OH+HeyHWXAAAAAElFTkSuQmCC"
    //   src="data:video/x-m4v;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAvG1kYXQAAAAfTgEFGkdWStxcTEM/lO/FETzRQ6gD7gAA7gIAA3EYgAAAAEgoAa8iNjAkszOL+e58c//cEe//0TT//scp1n/381P/RWP/zOW4QtxorfVogeh8nQDbQAAAAwAQMCcWUTAAAAMAAAMAAAMA84AAAAAVAgHQAyu+KT35E7gAADFgAAADABLQAAAAEgIB4AiS76MTkNbgAAF3AAAPSAAAABICAeAEn8+hBOTXYAADUgAAHRAAAAPibW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAAKcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAw10cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAKcAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAACnAAAAAAABAAAAAAKFbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAABdwAAAD6BVxAAAAAAAMWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABDb3JlIE1lZGlhIFZpZGVvAAAAAixtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHsc3RibAAAARxzdHNkAAAAAAAAAAEAAAEMaHZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAQABAASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAHVodmNDAQIgAAAAsAAAAAAAPPAA/P36+gAACwOgAAEAGEABDAH//wIgAAADALAAAAMAAAMAPBXAkKEAAQAmQgEBAiAAAAMAsAAAAwAAAwA8oBQgQcCTDLYgV7kWVYC1CRAJAICiAAEACUQBwChkuNBTJAAAAApmaWVsAQAAAAATY29scm5jbHgACQAQAAkAAAAAEHBhc3AAAAABAAAAAQAAABRidHJ0AAAAAAAALPwAACz8AAAAKHN0dHMAAAAAAAAAAwAAAAIAAAPoAAAAAQAAAAEAAAABAAAD6AAAABRzdHNzAAAAAAAAAAEAAAABAAAAEHNkdHAAAAAAIBAQGAAAAChjdHRzAAAAAAAAAAMAAAABAAAAAAAAAAEAAAfQAAAAAgAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAQAAAABAAAAJHN0c3oAAAAAAAAAAAAAAAQAAABvAAAAGQAAABYAAAAWAAAAFHN0Y28AAAAAAAAAAQAAACwAAABhdWR0YQAAAFltZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAACxpbHN0AAAAJKl0b28AAAAcZGF0YQAAAAEAAAAATGF2ZjYwLjMuMTAw"
    //   muted
    //   autoPlay
    //   playsInline
    //   className={classes.video}
    //   style={{
    //     '--mask-image': `url('${mask}')`,
    //   }}
    // />
  )
}

export default isQueryFlagEnabled('hdr') ? QRCodeHDR : QRCode
