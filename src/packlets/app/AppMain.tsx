import { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { AppQR } from './AppQR'
import { t } from '../../packlets/localize/t'
import { Calculator } from '../calculator/Calculator'
import Flipper from '../../packlets/flipper/Flipper'
import SlotSelector from '../../packlets/slotSelector/SlotSelector'

import { storageKeys } from './storageKeys'
import { sanitizeId } from './sanitizeId'
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
  const [showCalculator, setShowCalculator] = useState(false)

  const onSet = () => {
    const answeredPromptpayId = window.prompt(
      'Your PromptPay ID (phone number or e-Wallet ID)',
    )

    if (answeredPromptpayId !== null && answeredPromptpayId !== '') {
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
            <button
              type="button"
              className="ml-2 text-[#8b8685]"
              onClick={() => setShowCalculator(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0-10V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6m-6 4h6m-6-4h.01M9 16h.01"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
      {showCalculator && (
        <Calculator
          onClose={() => setShowCalculator(false)}
          onSelect={(newAmount) => {
            setAmount(newAmount)
            setShowCalculator(false)
          }}
        />
      )}
    </div>
  )
}
