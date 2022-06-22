import { FunctionalComponent } from 'preact'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { SyncExternalStore } from 'sync-external-store'
import { logo } from '../branding'
import FocusTrap from 'focus-trap-react'
import { version as promptpayQrVersion } from 'promptpay-qr/package.json'

const displayedStore = new SyncExternalStore(false)

export const SettingsButton: FunctionalComponent = (props) => (
  <button
    className="block"
    title={'Settings & about'}
    onClick={() => {
      displayedStore.state = true
    }}
    id="settings-button"
  >
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={12} cy={12} r={11} stroke="#C4C4C4" strokeWidth={2} />
      <rect x={11} y={6} width={2} height={2} rx={1} fill="#C4C4C4" />
      <rect x={11} y={9} width={2} height={9} rx={1} fill="#C4C4C4" />
    </svg>
  </button>
)

const SettingsCloseButton: FunctionalComponent = (props) => (
  <button
    className="block"
    title={'Back to app'}
    onClick={() => {
      displayedStore.state = false
    }}
  >
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke="#C4C4C4" stroke-width="2" />
      <rect
        x="7.0498"
        y="8.46436"
        width="2"
        height="12"
        rx="1"
        transform="rotate(-45 7.0498 8.46436)"
        fill="#C4C4C4"
      />
      <rect
        x="15.5352"
        y="7.05029"
        width="2"
        height="12"
        rx="1"
        transform="rotate(45 15.5352 7.05029)"
        fill="#C4C4C4"
      />
    </svg>
  </button>
)

export const SettingsView: FunctionalComponent = () => {
  const displayed = useSyncExternalStore(
    displayedStore.subscribe,
    displayedStore.getSnapshot,
  )
  if (!displayed) {
    return null
  }
  return (
    // @ts-ignore - FocusTrap is typed with React types, not compatible with Preact
    <FocusTrap>
      <div className="fixed inset-0 bg-black">
        <div className="bg-[#353433]">
          <div className="max-w-[440px] mx-auto h-12 flex items-center">
            <img className="w-12 h-12" alt="" src={logo} />
            <h1 className="font-bold">
              ppqr.app <span className="font-normal">Settings & About</span>
            </h1>
            <div className="ml-auto">
              <SettingsCloseButton />
            </div>
          </div>
        </div>

        <div className="max-w-[440px] mx-auto text-base py-8">
          Powered by{' '}
          <a
            href="https://github.com/dtinth/promptpay-qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            promptpay-qr
          </a>
          @{promptpayQrVersion}
        </div>
      </div>
    </FocusTrap>
  )
}
