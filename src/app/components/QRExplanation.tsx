import { FunctionalComponent, Fragment } from 'preact'

import { t } from '../../modules/localize/services/t'

interface Props {
  flipped: boolean
  slotId?: string
  onSet?(): void
}

export const QRExplanation: FunctionalComponent<Props> = (props) => {
  const { flipped, slotId, onSet = () => {} } = props

  return (
    <div
      data-testid="qr-explanation"
      className="mt-1 mb-5 text-xs text-[#8b8685]"
    >
      {flipped ? (
        <span key="exp-flipped">{t('เลือกตำแหน่งข้อมูล', 'Select a data slot')}</span>
      ) : !slotId ? (
        <span key="exp-empty">
          {t(
            'กดที่กล่องข้างบน เพื่อใส่รหัสพร้อมเพย์ที่ใช้รับเงิน',
            'Tap above to get started',
          )}
        </span>
      ) : (
        <span key="exp-qr">
          {slotId.length >= 15
            ? t(
                'QR code มีรหัส e-Wallet ของคุณ',
                'QR code contains your e-Wallet',
              )
            : slotId.length >= 13
            ? t('QR code มีเลขประจำตัวของคุณ', 'QR code contains your ID')
            : t(
                'QR code มีเบอร์โทรศัพท์ของคุณ',
                'QR code contains your phone number',
              )}
          :{' '}
          <button onClick={onSet} className="text-[#bbeeff] font-bold">
            {slotId}
          </button>
        </span>
      )}
    </div>
  )
}
