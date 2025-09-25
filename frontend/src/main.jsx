import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardSettingsProvider } from './contexts/DashboardSettingsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DashboardSettingsProvider>
        <App />
      </DashboardSettingsProvider>
    </AuthProvider>
  </StrictMode>,
)