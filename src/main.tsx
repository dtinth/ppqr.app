import { render } from 'preact'
import { registerSW } from 'virtual:pwa-register'

import App from './App'

import './index.css'

render(<App />, document.getElementById('app')!)

registerSW()
