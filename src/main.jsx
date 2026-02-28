import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for auto-updates
serviceWorkerRegistration.register()

// Log app version
console.log('Powerco Forms App - Version 1.0.0')
console.log('Auto-update enabled: Updates check every 60 seconds')
