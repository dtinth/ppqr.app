import { useEffect, useState } from 'preact/hooks'

import AppHeader from './AppHeader'
import { AppMain } from './AppMain'
import { LocalizationProvider } from '../../modules/localize/context/localizationContext'

import '../styles/App.css'
import { SettingsButton, SettingsView } from '../../packlets/settings'

export function App() {
  type AppStage = 'loading' | 'onboarding' | 'main'
  const [stage, setStage] = useState<AppStage>('loading')
  const [language] = useState('th')

  useEffect(() => {
    setStage('main')
  }, [])

  return (
    <div>
      <AppHeader rightContent={<SettingsButton />} />
      <LocalizationProvider value={language}>
        {stage === 'main' && <AppMain />}
        {stage === 'loading' && <p className="loading">Loading...</p>}
      </LocalizationProvider>
      <SettingsView />
    </div>
  )
}
