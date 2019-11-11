import './index.css'
import 'pepjs'

import App from './App'
import React from 'react'
import { register } from './serviceWorker'
import { render } from 'react-snapshot'

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

register({
  onSuccess() {
    // TODO: Display information that the app can be used offline
  },
  onUpdate() {
    // TODO: Display information that an update is available
  },
})

// var installPWA
window.addEventListener('beforeinstallprompt', function(e) {
  // installPWA = () => e.prompt()
  // TODO: Display information that the app can be installed
})
