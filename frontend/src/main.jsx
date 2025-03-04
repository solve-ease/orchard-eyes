import 'regenerator-runtime/runtime'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory.jsx'
import { UserProvider } from './context/userContext.jsx'
import { AlertProvider } from './context/AlertContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      {/* <UserProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </UserProvider> */}
      <Auth0ProviderWithHistory>
        <UserProvider>
          <AlertProvider>
            <App />
          </AlertProvider>
        </UserProvider>
      </Auth0ProviderWithHistory>
    </Router>
  </StrictMode>
)
