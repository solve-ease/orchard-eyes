import { createContext, useContext, useState, useEffect } from 'react'

const FontSizeContext = createContext()

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || '16px' // Default size
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', fontSize)
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])
  const increaseFont = () => {
    setFontSize((prev) => `${Math.min(parseInt(prev) + 2, 24)}px`) // Max 24px
  }

  const decreaseFont = () => {
    setFontSize((prev) => `${Math.max(parseInt(prev) - 2, 12)}px`) // Min 12px
  }

  return (
    <FontSizeContext.Provider value={{ increaseFont, decreaseFont }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  return useContext(FontSizeContext)
}
