import React, { useState } from 'react'
import {
  Droplet,
  Bug,
  Sunrise,
  Wind,
  Thermometer,
  Check,
  AlertTriangle,
  Calendar,
  Sprout,
  ChevronRight
} from 'lucide-react'
import Card from './Card'

const OrchardInsights = () => {
  // Mock data - in a real app, this would come from your drone analysis
  const [insights, setInsights] = useState([
    {
      id: 1,
      category: 'irrigation',
      title: 'Irrigation Needed',
      description:
        'Northeast section shows signs of water stress. Recommend increased irrigation in zones 3-5.',
      urgency: 'high',
      data: { soilMoisture: '22%', recommended: '35-45%' },
      recommendation: 'Increase irrigation by 25% for the next 7 days',
      date: '2 days ago',
      source: 'Drone NDVI Analysis'
    },
    {
      id: 2,
      category: 'pest',
      title: 'Apple Maggot Detected',
      description:
        'Early signs of apple maggot detected in southern quadrant of orchard.',
      urgency: 'medium',
      data: { affectedTrees: 12, totalInspected: 150 },
      recommendation: 'Apply organic Spinosad treatment to affected areas',
      date: '5 days ago',
      source: 'Drone Image Analysis'
    },
    {
      id: 3,
      category: 'fertilizer',
      title: 'Potassium Deficiency',
      description: 'Leaf analysis shows potassium deficiency in mature trees.',
      urgency: 'medium',
      data: { currentLevel: '1.2%', optimalLevel: '1.8-2.5%' },
      recommendation: 'Apply potassium sulfate fertilizer at 3lbs per tree',
      date: '1 week ago',
      source: 'Spectral Analysis'
    },
    {
      id: 4,
      category: 'weather',
      title: 'Frost Warning',
      description: 'Upcoming frost risk predicted for next week.',
      urgency: 'high',
      data: { predictedTemp: '30°F', duration: '4-6 hours' },
      recommendation:
        'Prepare frost protection: deploy covers or wind machines',
      date: '3 hours ago',
      source: 'Weather API Integration'
    },
    {
      id: 5,
      category: 'disease',
      title: 'Apple Scab Risk',
      description:
        'Recent rain has created conditions favorable for apple scab development.',
      urgency: 'medium',
      data: { riskScore: '7.8/10', infectionPeriod: '36 hours' },
      recommendation: 'Apply organic sulfur spray before next rainfall',
      date: '2 days ago',
      source: 'Predictive Disease Model'
    }
  ])

  // Get icon based on category
  const getIcon = (category, size = 20) => {
    switch (category) {
      case 'irrigation':
        return <Droplet size={size} className='text-blue-500' />
      case 'pest':
        return <Bug size={size} className='text-red-500' />
      case 'fertilizer':
        return <Sprout size={size} className='text-green-500' />
      case 'weather':
        return <Thermometer size={size} className='text-purple-500' />
      case 'disease':
        return <AlertTriangle size={size} className='text-orange-500' />
      default:
        return <Check size={size} className='text-gray-500' />
    }
  }

  // Get background based on urgency
  const getUrgencyStyles = (urgency) => {
    switch (urgency) {
      case 'high':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        }
      case 'medium':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200'
        }
      case 'low':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200'
        }
    }
  }

  return (
    <div className='p-4 w-screen'>
      <div className='mb-5'>
        <h2 className='text-2xl font-bold text-gray-800'>Orchard Insights</h2>
        <p className='text-md text-gray-600'>
          Actionable recommendations based on drone analysis
        </p>
      </div>

      {/* Main Insights Section */}
      <div className='space-y-4 sm:space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0'>
        {insights.map((insight) => {
          const { bgColor, textColor, borderColor } = getUrgencyStyles(
            insight.urgency
          )

          return (
            <Card key={insight.id} margin='mb-0'>
              <div className='w-full'>
                {/* Header - Mobile optimized with flexbox */}
                <div className='flex items-start space-x-3 mb-3'>
                  <div
                    className={`p-2 rounded-full ${bgColor} flex-shrink-0 mt-1`}
                  >
                    {getIcon(insight.category)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-800 text-lg'>
                      {insight.title}
                    </h3>
                    <div className='flex items-center text-sm text-gray-500 mt-1'>
                      <Calendar size={12} className='mr-1 flex-shrink-0' />
                      <span className='truncate'>{insight.date}</span>
                    </div>
                  </div>
                </div>

                {/* Description - Mobile friendly text size */}
                <p className='text-md text-gray-700 mb-3 line-clamp-2'>
                  {insight.description}
                </p>

                {/* Data Points - Simplified for mobile */}
                <div className={`p-3 rounded-lg ${bgColor} mb-3`}>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    {Object.entries(insight.data).map(([key, value]) => (
                      <div key={key} className='flex flex-col'>
                        <span className='text-gray-500 capitalize'>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className={`font-semibold ${textColor}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation - Mobile friendly left border */}
                <div className={`border-l-2 ${borderColor} pl-2 py-1 mb-3`}>
                  <h4 className='text-sm font-semibold text-gray-700'>
                    Recommended Action:
                  </h4>
                  <p className='text-sm text-gray-700'>
                    {insight.recommendation}
                  </p>
                </div>

                {/* Footer - Optimized for touch targets */}
                <div className='flex justify-between items-center mt-3 pt-2 border-t border-gray-100'>
                  <span className='text-sm text-gray-500'>
                    {insight.source}
                  </span>
                  <button className='flex items-center text-sm text-blue-600 font-medium p-1'>
                    View Details
                    <ChevronRight size={14} className='ml-1' />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* News Based Insights - Mobile optimized */}
      <div className='mt-6 sm:mt-8'>
        <h3 className='text-xl font-semibold text-gray-800 mb-3'>
          Industry Updates
        </h3>
        <Card>
          <div className='w-full space-y-4'>
            {[
              {
                title: 'New Organic Pesticide Approved',
                desc: 'The EPA has approved a new organic pesticide effective against apple maggots.',
                source: 'Organic Farming Today'
              },
              {
                title: 'Drought Warning for Northeast',
                desc: 'Meteorologists predict below-average rainfall for the next month.',
                source: 'Regional Agricultural Alert'
              },
              {
                title: 'Beneficial Insects Boost Yield',
                desc: 'Research shows introducing specific beneficial insects can increase yield by up to 15%.',
                source: 'Agricultural Science Journal'
              }
            ].map((item, index) => (
              <div key={index} className={index < 2 ? 'border-b pb-4' : ''}>
                <h4 className='font-medium text-md text-gray-800'>
                  {item.title}
                </h4>
                <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                  {item.desc}
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <span className='text-sm text-gray-500'>{item.source}</span>
                  <button className='text-blue-600 text-sm font-medium p-1 flex items-center'>
                    Read
                    <ChevronRight size={12} className='ml-0.5' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrchardInsights
