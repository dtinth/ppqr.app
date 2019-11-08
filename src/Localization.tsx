import React, { createContext, useContext, useCallback } from 'react'

const localizationContext = createContext('th')

export function useLocalization() {
  const language = useContext(localizationContext)
  const t = useCallback(
    function t(th: string, en: string) {
      if (language === 'th') {
        return <span title={en}>{th}</span>
      }
      return <span title={th}>{en}</span>
    },
    [language],
  )
  return t
}

export function t(th: string, en: string) {
  return <LocalizedText th={th} en={en} />
}

export function LocalizedText(props: { th: string; en: string }) {
  const t = useLocalization()
  return t(props.th, props.en)
}

export const LocalizationProvider = localizationContext.Provider
