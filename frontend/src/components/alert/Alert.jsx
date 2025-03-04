import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, XIcon } from 'lucide-react'
import { useAlert } from '../../context/AlertContext'

const Alert = ({ id, type, message }) => {
  const { removeAlert } = useAlert()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation by delaying the visible state
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for animation to complete before removal
    setTimeout(() => removeAlert(id), 300)
  }

  // Alert type styles
  const alertStyles = {
    success: {
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      icon: <CheckCircleIcon className='w-5 h-5 text-green-500' />
    },
    warning: {
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      icon: <CheckCircleIcon className='w-5 h-5 text-yellow-500' />
    },
    error: {
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      icon: <XCircleIcon className='w-5 h-5 text-red-500' />
    }
  }

  const style = alertStyles[type] || alertStyles.success

  return (
    <div
      className={`
        flex items-center justify-between w-full max-w-md p-3 border-l-4 shadow-md rounded-r 
        pointer-events-auto transition-all duration-300 transform
        ${style.bgColor} ${style.borderColor} ${style.textColor}
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      <div className='flex items-center space-x-3'>
        {style.icon}
        <p className='text-sm font-medium'>{message}</p>
      </div>
      <button
        onClick={handleClose}
        className='p-1 rounded-full hover:bg-opacity-25 hover:bg-gray-500 focus:outline-none'
      >
        <XIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

export default Alert
