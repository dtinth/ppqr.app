import { render } from 'preact'
import { registerSW } from 'virtual:pwa-register'

import App from './App'

import '@fontsource/noto-sans-thai'
import '@fontsource/roboto'
import '@fontsource/roboto/700.css'
import './index.css'

render(<App />, document.getElementById('app')!)

registerSW()
