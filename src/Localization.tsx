import React, { createContext, useContext, useCallback, ReactNode } from 'react'

const localizationContext = createContext('th')

export function useLocalization() {
  const language = useContext(localizationContext)
  const t = useCallback(
    function t(th: ReactNode, en: ReactNode) {
      return language === 'th' ? th : en
    },
    [language],
  )
  return t
}

export function t(th: ReactNode, en: ReactNode) {
  return <LocalizedText th={th} en={en} />
}

export function LocalizedText(props: { th: ReactNode; en: ReactNode }) {
  const t = useLocalization()
  return <React.Fragment>{t(props.th, props.en)}</React.Fragment>
}

export function Thai(props: { children?: ReactNode }) {
  return <LocalizedText th={props.children} en={null} />
}

export function English(props: { children?: ReactNode }) {
  return <LocalizedText th={null} en={props.children} />
}

export const LocalizationProvider = localizationContext.Provider
