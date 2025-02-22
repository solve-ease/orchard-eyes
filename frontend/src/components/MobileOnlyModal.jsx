import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const MobileOnlyModal = () => {
  const [showModal, setShowModal] = useState(true)
  const [timer, setTimer] = useState(5)

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown)
          setShowModal(false)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [])

  return (
    <div
      className={`
        hidden lg:flex
        ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        fixed inset-0 bg-black bg-opacity-50 z-50
        items-center justify-center
        transition-opacity duration-300
      `}
    >
      <div className='bg-white rounded-lg p-8 relative max-w-md mx-4'>
        <button
          onClick={() => setShowModal(false)}
          className='absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors'
        >
          <X size={20} />
        </button>

        <div className='mb-6'>
          <div className='w-16 h-16 mb-4 mx-auto'>
            <svg
              className='w-full h-full text-blue-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-2'>
            Mobile App Recommended
          </h2>
          <p className='text-gray-600 text-center'>
            This application is optimized for mobile devices. For the best
            experience, please access it from your smartphone.
          </p>
        </div>

        {/* Timer Circle */}
        <div className='flex justify-center mb-6'>
          <div className='relative w-12 h-12'>
            <svg className='w-full h-full transform -rotate-90'>
              <circle
                cx='24'
                cy='24'
                r='20'
                stroke='#E5E7EB'
                strokeWidth='4'
                fill='none'
              />
              <circle
                cx='24'
                cy='24'
                r='20'
                stroke='#3B82F6'
                strokeWidth='4'
                fill='none'
                strokeDasharray={`${(timer / 5) * 125.6} 125.6`}
                className='transition-all duration-1000 ease-linear'
              />
            </svg>
            <span className='absolute inset-0 flex items-center justify-center text-lg font-semibold text-blue-500'>
              {timer}
            </span>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-sm text-gray-500'>
            Modal will close in {timer} seconds
          </p>
          <button
            onClick={() => setShowModal(false)}
            className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileOnlyModal
