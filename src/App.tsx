import { Component, FunctionalComponent, VNode } from 'preact'
import { useState, useEffect, useCallback } from 'preact/hooks'

import Flipper from './Flipper'
import SlotSelector from './SlotSelector'
import generatePayload from 'promptpay-qr'
import QRCode from './QRCode'
import { t, LocalizationProvider } from './Localization'
import AppHeader from './AppHeader'

import { version } from 'promptpay-qr/package.json'

import './App.css'

const storageKeys = {
  1: 'promptpayID',
  2: 'promptpayID2',
  3: 'promptpayID3',
  4: 'promptpayID4',
}

function sanitizeId(id: string) {
  return String(id).replace(/[^0-9]/g, '')
}

function App() {
  type AppStage = 'loading' | 'onboarding' | 'main'
  const [stage, setStage] = useState<AppStage>('loading')
  const [language] = useState('th')

  useEffect(() => {
    setStage('main')
  }, [])

  return (
    <div>
      <AppHeader />
      <LocalizationProvider value={language}>
        {stage === 'main' && <AppMain />}
        {stage === 'loading' && <p className="loading">Loading...</p>}
      </LocalizationProvider>
    </div>
  )
}

const AppMain: FunctionalComponent = () => {
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
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const amount = +(searchParams.get('amount') ?? '0')
    if (amount) setAmount(amount)
  }, [])
  const getId = () => {
    return data[slotNumber]
  }
  const onSet = () => {
    const id = window.prompt(
      'Your PromptPay ID (phone number or e-Wallet ID)',
      getId(),
    )
    if (id != null) {
      const sanitizedId = sanitizeId(id)
      const n = slotNumber
      setData((d) => ({ ...d, [n]: sanitizedId }))
      window.localStorage[storageKeys[n as keyof typeof storageKeys]] =
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

  const renderExplanation = () => {
    if (flipped) {
      return <span>{t('เลือกตำแหน่งข้อมูล', 'Select a data slot')}</span>
    }
    const id = getId()
    if (!id) {
      return (
        <span>
          {t(
            'กดที่กล่องข้างบน เพื่อใส่รหัสพร้อมเพย์ที่ใช้รับเงิน',
            'Tap above to get started',
          )}
        </span>
      )
    } else {
      return (
        <span>
          {id.length >= 15
            ? t(
                'QR code มีรหัส e-Wallet ของคุณ',
                'QR code contains your e-Wallet',
              )
            : id.length >= 13
            ? t('QR code มีเลขประจำตัวของคุณ', 'QR code contains your ID')
            : t(
                'QR code มีเบอร์โทรศัพท์ของคุณ',
                'QR code contains your phone number',
              )}
          :{' '}
          <button onClick={onSet} className="text-[#bbeeff] font-bold">
            {id}
          </button>
        </span>
      )
    }
  }

  return (
    <div className="text-center">
      <Flipper
        front={
          <AppQR
            id={getId()}
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
      <div
        data-testid="qr-explanation"
        className="mt-1 mb-5 text-xs text-[#8b8685]"
      >
        {renderExplanation()}
      </div>
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
      <div className="tip">
        <strong>Tip: </strong>Add to home screen for easier access
        <br />
        Powered by{' '}
        <a
          href="https://github.com/dtinth/promptpay-qr"
          target="_blank"
          rel="noopener noreferrer"
        >
          promptpay-qr
        </a>
        @{version}
      </div>
    </div>
  )
}

interface AppQR {
  id: string
  amount: number
  slotNumber: number
  onSet: () => void
}
const AppQR: FunctionalComponent<AppQR> = (props) => {
  const { id, amount, onSet, slotNumber } = props
  if (!id) {
    return (
      <button className="err" onClick={onSet}>
        <span className="err-text">
          {t('กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์', 'Tap to set PromptPay ID')}
        </span>
      </button>
    )
  } else {
    const payload = generatePayload(id, { amount })
    return (
      <div
        className="qrcode-container"
        onClick={onSet}
        data-promptpay-id={id}
        data-slot={slotNumber}
      >
        <QRCode payload={payload} />
      </div>
    )
  }
}
export default App
