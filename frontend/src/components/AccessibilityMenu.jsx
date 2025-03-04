import { Sliders } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFontSize } from '../context/FontSizeProvider'

function AccessibilityMenu() {
  const [show, setShow] = useState(false)
  const { increaseFont, decreaseFont } = useFontSize()
  useEffect(() => {
    // Load the script only once
    const existingScript = document.querySelector(
      'script[src="https://cdn.gtranslate.net/widgets/latest/float.js"]'
    )
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js'
      script.defer = true
      document.body.appendChild(script)

      // Apply translation settings
      window.gtranslateSettings = {
        default_language: 'en',
        detect_browser_language: true,
        wrapper_selector: '.gtranslate_wrapper'
      }
    }
    const wrapper = document.getElementById('gt_float_wrapper')
    if (wrapper) {
      wrapper.style.display = 'none'
    }
  }, [])

  return (
    <div className='flex gap-2 fixed bottom-20 right-5 z-[1000] items-center'>
      <Sliders
        onClick={() => {
          setShow(!show)
          const wrapper = document.getElementById('gt_float_wrapper')
          if (wrapper) {
            wrapper.style.display = show ? 'none' : 'block'
          }
        }}
        className='cursor-pointer bg-[#ee7474] p-1'
      />
      <div className={`${show ? 'flex' : 'hidden'} gap-2`}>
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

export default AccessibilityMenu
