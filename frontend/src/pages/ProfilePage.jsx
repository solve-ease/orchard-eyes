import React, { useState, useEffect } from 'react'
import {
  Camera,
  TreePine,
  Leaf,
  ChevronRight,
  Heart,
  Download,
  Globe,
  MapPin,
  MessageSquare,
  Clock,
  LogOut,
  Trash2,
  Settings,
  ArrowLeft,
  Pen
} from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/userContext'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { userData, setUserData } = useUser()
  const { logout } = useAuth0()
  const navigate = useNavigate()
  // Profile State
  const [profile, setProfile] = useState({
    fullName: 'Charlotte King',
    username: '@johnkingorchards',
    contactNumber: '123-456-7890',
    email: 'charlotte.king@example.com',
    farmLocation: '123 Orchard Lane, Apple City',
    orchardName: "King's Organic Orchard",
    totalArea: 10,
    numberOfTrees: 500,
    treeAgeRange: 'Mature',
    orchardType: 'Organic',
    soilType: 'Loamy',
    lastDroneScanDate: '2023-10-01',
    identifiedIssues: 'None',
    yieldEstimation: '5000 kg',
    ndviHealthIndex: 0.85,
    pestDiseaseHeatmapLink: '/heatmap',
    subscriptionPlan: 'Pro',
    lastPaymentDate: '2023-09-15',
    nextScheduledScan: '2023-11-01 10:00 AM'
  })

  // Form State
  const [formData, setFormData] = useState(profile)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    // Set default profile image
    setImagePreview('/api/placeholder/120/120')
  }, [])

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setImageFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update profile
      setProfile(formData)
      setSuccess(true)
      setIsEditing(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const MenuItem = ({ icon, title, onClick, color = 'text-gray-700' }) => (
    <div
      onClick={onClick}
      className='flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer'
    >
      <div className='flex items-center gap-3'>
        {React.cloneElement(icon, { size: 20, className: color })}
        <span className='text-gray-800'>{title}</span>
      </div>
      <ChevronRight size={16} className='text-gray-400' />
    </div>
  )

  return (
    <div className='w-[90vw] mx-auto bg-white min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between pt-2 border-b'>
        <button className='p-2'>
          <ArrowLeft size={20} onClick={() => navigate(-1)} />
        </button>
        <h1 className='font-semibold text-lg'>My Profile</h1>
        <button className='p-2'>
          <Settings size={20} />
        </button>
      </div>

      {/* Profile Section */}
      <div className='p-6 flex items-center pb-8 justify-between'>
        <div className='relative mb-4'>
          <img
            src='https://www.shutterstock.com/image-photo/close-pensive-male-bearded-farmer-260nw-302296364.jpg'
            alt='Profile'
            className='w-[15vh] h-[15vh] rounded-full object-cover border-2 border-white shadow'
          />
          <button className='absolute bottom-0 right-0 bg-white rounded-full p-1 shadow'>
            <Camera size={20} />
          </button>
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='font-bold text-xl'>{userData.name}</h2>
          <p className='text-gray-500 text-sm'>{userData.name}</p>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className='mt-4 bg-red-500 text-white px-6 py-2 rounded-xl font-medium text-sm'
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Menu Items Section */}
      {!isEditing ? (
        <div>
          <MenuItem icon={<Heart />} title='Favourites' />
          <MenuItem icon={<Download />} title='Downloads' />
          <MenuItem icon={<Globe />} title='Language' />
          <MenuItem icon={<MapPin />} title='Location' />
          <MenuItem icon={<MessageSquare />} title='Subscription' />
          <MenuItem icon={<Trash2 />} title='Clear cache' />
          <MenuItem icon={<Clock />} title='Clear history' />
          <MenuItem
            onClick={() => {
              logout({
                logoutParams: {
                  returnTo: import.meta.env.VITE_REDIRECT_URL,
                  clientId: 'BCYRUBfd9PLBjvn60NwTFKhsAf7dffr7'
                }
              })
            }}
            icon={<LogOut />}
            title='Log out'
            color='text-red-500'
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name
            </label>
            <input
              type='text'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-300 p-3 text-sm'
              maxLength={50}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-300 p-3 text-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Contact Number
            </label>
            <input
              type='text'
              name='contactNumber'
              value={formData.contactNumber}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-300 p-3 text-sm'
              maxLength={15}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-300 p-3 text-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Farm Location
            </label>
            <input
              type='text'
              name='farmLocation'
              value={formData.farmLocation}
              onChange={handleChange}
              className='w-full rounded-lg border border-gray-300 p-3 text-sm'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='button'
              onClick={() => setIsEditing(false)}
              className='w-1/2 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='w-1/2 bg-red-500 text-white py-3 rounded-lg font-medium disabled:bg-red-300'
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage
