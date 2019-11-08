/// <reference types="react-scripts" />

declare module 'react-snapshot' {
  export const render: (typeof import('react-dom'))['render']
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
