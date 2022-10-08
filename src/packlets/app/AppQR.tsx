import { Fragment, FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import generatePayload from 'promptpay-qr'

import QRCode from '../../packlets/qrcode/QRCode'
import { t } from '../../packlets/localize/t'

interface Props {
  id: string
  amount: number
  slotNumber: number
  onSet: () => void
}

export const AppQR: FunctionalComponent<Props> = (props) => {
  const { id, amount, onSet, slotNumber } = props

  const payload = useMemo(
    () => (!id ? '' : generatePayload(id, { amount })),
    [id, amount],
  )

  return (
    <Fragment>
      {!id ? (
        <button className="err" onClick={onSet}>
          <span className="err-text">
            {t('กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์', 'Tap to set PromptPay ID')}
          </span>
        </button>
      ) : (
        <div
          className="qrcode-container"
          onClick={onSet}
          data-promptpay-id={id}
          data-slot={slotNumber}
        >
          <QRCode payload={payload} />
        </div>
      )}
    </Fragment>
  )
}
