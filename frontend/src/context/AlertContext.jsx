// AlertContext.js
import { createContext, useContext, useState } from 'react'

// Create context
const AlertContext = createContext()

// Alert provider component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])

  // Function to add a new alert
  const addAlert = (message, type = 'success', timeout = 5000) => {
    const id = Date.now()
    setAlerts((prev) => [...prev, { id, message, type }])

    // Auto-remove the alert after timeout
    setTimeout(() => {
      removeAlert(id)
    }, timeout)

    return id
  }

  // Function to remove an alert by id
  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  // Convenience functions for different alert types
  const success = (message, timeout) => addAlert(message, 'success', timeout)
  const warning = (message, timeout) => addAlert(message, 'warning', timeout)
  const error = (message, timeout) => addAlert(message, 'error', timeout)

  return (
    <AlertContext.Provider
      value={{ alerts, addAlert, removeAlert, success, warning, error }}
    >
      {children}
    </AlertContext.Provider>
  )
}

// Custom hook to use alert context
export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
