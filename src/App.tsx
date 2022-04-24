import React, { Component, useState, useEffect } from 'react'

import Flipper from './FlipperBK'
import SlotSelector from './SlotSelector'
import generatePayload from 'promptpay-qr'
import QRCode from './QRCode'
import { t, LocalizationProvider } from './Localization'
import AppHeader from './AppHeader'

const ver = require('promptpay-qr/package.json').version

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

  // const languageSwitcher = useMemo(() => {
  //   const switchLanguage = () => setLanguage(language === 'th' ? 'en' : 'th')
  //   return (
  //     <Button
  //       as="div"
  //       style={{ padding: '0 10px', display: 'flex', alignItems: 'center' }}
  //       onClick={switchLanguage}
  //     >
  //       {language}
  //     </Button>
  //   )
  // }, [language])

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

class AppMain extends Component {
  state = this.getInitialState()
  getInitialState() {
    const slotNumber = +window.localStorage.promptPayActiveSlot || 1
    const data = Object.fromEntries(
      Object.entries(storageKeys).map(([index, storageKey]) => [
        index,
        sanitizeId(window.localStorage[storageKey] || ''),
      ]),
    )

    return {
      data: data,
      slotNumber: slotNumber as 1 | 2 | 3 | 4,
      amount: 0,
      flipped: false,
    }
  }
  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search)
    const amount = +(searchParams.get('amount') ?? '0')
    if (amount) this.setState({ amount })
  }
  onSet = () => {
    const id = window.prompt(
      'Your PromptPay ID (phone number or e-Wallet ID)',
      this.getId(),
    )
    if (id != null) {
      const sanitizedId = sanitizeId(id)
      const n = this.state.slotNumber
      this.setState({ data: { ...this.state.data, [n]: sanitizedId } })
      window.localStorage[storageKeys[n]] = sanitizedId
    }
  }
  onFlip = (flipped: boolean) => {
    this.setState({ flipped })
  }
  onSelectSlot = (slot: number) => {
    this.setState({ slotNumber: slot, flipped: false })
    window.localStorage.promptPayActiveSlot = slot
    if (window.gtag) {
      window.gtag('event', 'select', {
        event_category: 'Slot',
        event_label: `slot ${slot}`,
      })
    }
  }
  getId() {
    return this.state.data[this.state.slotNumber]
  }
  renderQR() {
    const id = this.getId()
    if (!id) {
      return (
        <button className="err" onClick={this.onSet}>
          <span className="err-text">
            {t('กดที่นี่เพื่อตั้งค่ารหัสพร้อมเพย์', 'Tap to set PromptPay ID')}
          </span>
        </button>
      )
    } else {
      const payload = generatePayload(id, { amount: this.state.amount })
      return (
        <div
          className="qrcode-container"
          onClick={this.onSet}
          data-promptpay-id={id}
          data-slot={this.state.slotNumber}
        >
          <QRCode payload={payload} />
        </div>
      )
    }
  }
  renderExplanation() {
    if (this.state.flipped) {
      return <span>{t('เลือกตำแหน่งข้อมูล', 'Select a data slot')}</span>
    }
    const id = this.getId()
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
          <strong
            onClick={this.onSet}
            style={{ color: '#bef', cursor: 'pointer' }}
          >
            {id}
          </strong>
        </span>
      )
    }
  }
  renderSlotSelector() {
    return (
      <SlotSelector
        active={this.state.slotNumber}
        data={this.state.data}
        onSelect={this.onSelectSlot}
      />
    )
  }
  render() {
    return (
      <div className="App">
        <Flipper
          front={this.renderQR()}
          back={this.renderSlotSelector()}
          flipped={this.state.flipped}
          onFlip={this.onFlip}
        />
        <div className="qr-explanation">{this.renderExplanation()}</div>
        <form
          className="amount"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <input
            className="amount"
            type="number"
            inputMode="decimal"
            step={0.01}
            min={0}
            value={this.state.amount}
            onChange={(e) => {
              this.setState({ amount: +e.target.value })
            }}
            autoFocus
          />{' '}
          {t('บาท', 'THB')}
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
          @{ver}
        </div>
      </div>
    )
  }
}

export default App
