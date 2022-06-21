import { render } from 'preact'
import { registerSW } from 'virtual:pwa-register'

import App from './App'

import '@fontsource/noto-sans-thai'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import './index.css'

render(<App />, document.getElementById('app')!)

registerSW()
