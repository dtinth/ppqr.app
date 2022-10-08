import { FunctionalComponent } from 'preact'
import { useEffect, useState, useMemo } from 'preact/hooks'

import { AppQR } from './AppQR'
import { t } from '../../modules/localize/services/t'
import Flipper from '../../modules/flipper/components/Flipper'
import SlotSelector from '../../modules/slotSelector/components/SlotSelector'

import { storageKeys } from '../constants/storageKeys'
import { sanitizeId } from '../services/sanitizeId'
import { QRExplanation } from './QRExplanation'

export const AppMain: FunctionalComponent = () => {
  const [slotNumber, setSlotNumber] = useState(
    +window.localStorage.promptPayActiveSlot || 1,
  )
  const [data, setData] = useState(
    Object.fromEntries(
      Object.entries(storageKeys).map(([index, storageKey]) => [
        index,
        sanitizeId(window.localStorage[storageKey] || ''),
      ]),
    ),
  )
  const [amount, setAmount] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const onSet = () => {
    const answeredPromptpayId = window.prompt(
      'Your PromptPay ID (phone number or e-Wallet ID)',
    )

    if (answeredPromptpayId != null) {
      const sanitizedId = sanitizeId(answeredPromptpayId)

      setData((d) => ({ ...d, [slotNumber]: sanitizedId }))
      window.localStorage[storageKeys[slotNumber as keyof typeof storageKeys]] =
        sanitizedId
    }
  }

  const onSelectSlot = (slot: number) => {
    setSlotNumber(slot)
    setFlipped(false)
    window.localStorage.promptPayActiveSlot = slot
    if (window.gtag) {
      window.gtag('event', 'select', {
        event_category: 'Slot',
        event_label: `slot ${slot}`,
      })
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const amount = +(searchParams.get('amount') ?? '0')
    if (amount) setAmount(amount)
  }, [])

  return (
    <div className="text-center">
      <Flipper
        front={
          <AppQR
            id={data[slotNumber]}
            amount={amount}
            slotNumber={slotNumber}
            onSet={onSet}
          />
        }
        back={
          <SlotSelector
            active={slotNumber}
            data={data}
            onSelect={onSelectSlot}
          />
        }
        flipped={flipped}
        onFlip={setFlipped}
      />
      <QRExplanation
        flipped={flipped}
        slotId={data[slotNumber]}
        onSet={onSet}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          ;(e.target as HTMLInputElement | HTMLElement).blur?.()
        }}
      >
        <div>
          <label htmlFor="amount" className="block pb-2 text-[#8b8685]">
            {t('กรอกจำนวนเงิน', 'Enter Amount')}
          </label>
          <div className="mx-auto w-[200px] flex bg-[#252423] px-5 py-2 gap-2 items-center rounded-xl border border-[#8b8685]">
            <span className="flex-1">
              <input
                id="amount"
                className="w-full block text-[#d7fc70] bg-transparent text-right text-3xl"
                type="number"
                inputMode="decimal"
                step={0.01}
                min={0}
                autoComplete="off"
                defaultValue={
                  amount.toString() === '0' ? '' : amount.toString()
                }
                onInput={(e) => {
                  setAmount(+(e.target as HTMLInputElement).value)
                }}
                autoFocus
              />
            </span>
            <span
              className="flex-none text-[#8b8685]"
              onClick={() => {
                const input = document.getElementById(
                  'amount',
                ) as HTMLInputElement | null
                if (input) {
                  input.focus()
                  input.select()
                }
              }}
            >
              {t('บาท', 'THB')}
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
