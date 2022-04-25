/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'react-snapshot' {
  export const render: typeof import('react-dom')['render']
}

declare module 'promptpay-qr' {
  const generatePayload: (id: string, options: { amount?: number }) => string
  export default generatePayload
}

interface Window {
  gtag?: {
    (
      command: 'event',
      action: string,
      options?: { event_category: string; event_label: string },
    )
  }
}

// https://vite-plugin-pwa.netlify.app/frameworks/preact.html#type-declarations
declare module 'virtual:pwa-register/preact' {
  import type { StateUpdater } from 'preact/hooks'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, StateUpdater<boolean>]
    offlineReady: [boolean, StateUpdater<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
