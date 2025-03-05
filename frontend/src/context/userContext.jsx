import { createContext, useContext, useState } from 'react'

// Create the context
const UserContext = createContext()

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom Hook to use User Context
export const useUser = () => useContext(UserContext)
