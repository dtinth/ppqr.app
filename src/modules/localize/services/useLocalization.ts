import { useContext, useMemo } from 'preact/hooks'

import { localizationContext } from '../context/localizationContext'

export function useLocalization(th: string, en: string) {
  const language = useContext(localizationContext)

  const translated = useMemo(
    () => ({
      main: language === 'th' ? th : en,
      sub: language === 'th' ? en : th,
    }),
    [language],
  )

  return translated
}
