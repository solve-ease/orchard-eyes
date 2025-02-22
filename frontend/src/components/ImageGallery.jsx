import { X } from 'lucide-react'

const ImageGallery = ({ display, url, setShowImageGallery }) => {
  return (
    <div
      className={`${display} fixed top-0 left-0 w-screen h-screen items-center p-4 backdrop-blur-sm`}
    >
      <X
        onClick={() => setShowImageGallery(false)}
        className='fixed top-5 text-bold right-5 cursor-pointer'
      />
      <img src={url} alt='' />
    </div>
  )
}

export default ImageGallery
