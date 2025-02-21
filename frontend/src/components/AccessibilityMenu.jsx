import { Sliders } from 'lucide-react'
import { useFontSize } from './FontSizeProvider'

export default function AccessibilityMenu() {
  const { increaseFont, decreaseFont } = useFontSize()

  return (
    <div className='flex gap-2 fixed bottom-5 right-5 z-[1000]'>
      <Sliders />
      <div className='flex gap-2'>
        <button
          onClick={decreaseFont}
          className='px-3 py-1 bg-gray-300 rounded'
        >
          A-
        </button>
        <button
          onClick={increaseFont}
          className='px-3 py-1 bg-gray-300 rounded'
        >
          A+
        </button>
      </div>
    </div>
  )
}
