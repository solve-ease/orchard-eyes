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
  Sprout
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
  const getIcon = (category, size = 24) => {
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
    <div className='max-w-4xl mx-auto p-4'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>Orchard Insights</h2>
        <p className='text-gray-600'>
          Actionable recommendations based on drone analysis and weather data
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {insights.map((insight) => {
          const { bgColor, textColor, borderColor } = getUrgencyStyles(
            insight.urgency
          )

          return (
            <Card
              key={insight.id}
              margin='mb-0'
              otherStyles='transform transition-transform hover:scale-102'
            >
              <div className='w-full'>
                {/* Header */}
                <div className='flex items-center mb-3'>
                  <div className={`p-3 rounded-full ${bgColor} mr-3`}>
                    {getIcon(insight.category)}
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800'>{insight.title}</h3>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Calendar size={14} className='mr-1' />
                      <span>{insight.date}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className='text-gray-700 mb-4'>{insight.description}</p>

                {/* Data Points */}
                <div className={`p-3 rounded-lg ${bgColor} mb-4`}>
                  <div className='grid grid-cols-2 gap-2'>
                    {Object.entries(insight.data).map(([key, value]) => (
                      <div key={key} className='flex flex-col'>
                        <span className='text-xs text-gray-500 capitalize'>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className={`font-semibold ${textColor}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`border-l-4 ${borderColor} pl-3 py-1 mb-3`}>
                  <h4 className='text-sm font-semibold text-gray-700'>
                    Recommended Action:
                  </h4>
                  <p className='text-gray-700'>{insight.recommendation}</p>
                </div>

                {/* Source */}
                <div className='flex justify-between items-center mt-4'>
                  <span className='text-xs text-gray-500'>
                    Source: {insight.source}
                  </span>
                  <button className='text-blue-600 text-sm font-medium hover:underline'>
                    View Details
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Weekly Forecast Section */}
      <div className='mt-8'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          7-Day Forecast Impact
        </h3>
        <Card bgColor='bg-gradient-to-r from-blue-50 to-indigo-50'>
          <div className='w-full'>
            <div className='flex overflow-x-auto py-2 space-x-6'>
              {[
                {
                  day: 'Mon',
                  temp: '72°F',
                  icon: <Sunrise size={20} />,
                  impact: 'Ideal Spraying Conditions'
                },
                {
                  day: 'Tue',
                  temp: '75°F',
                  icon: <Droplet size={20} />,
                  impact: 'Irrigation Recommended'
                },
                {
                  day: 'Wed',
                  temp: '68°F',
                  icon: <Wind size={20} />,
                  impact: 'High Winds - Delay Spraying'
                },
                {
                  day: 'Thu',
                  temp: '66°F',
                  icon: <Thermometer size={20} />,
                  impact: 'Cool Weather - Monitor'
                },
                {
                  day: 'Fri',
                  temp: '59°F',
                  icon: <AlertTriangle size={20} />,
                  impact: 'Frost Risk - Prepare'
                },
                {
                  day: 'Sat',
                  temp: '64°F',
                  icon: <Droplet size={20} />,
                  impact: 'Rain Expected'
                },
                {
                  day: 'Sun',
                  temp: '70°F',
                  icon: <Sunrise size={20} />,
                  impact: 'Ideal Conditions'
                }
              ].map((day, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center min-w-fit'
                >
                  <span className='font-medium text-gray-700'>{day.day}</span>
                  <div className='my-2 text-blue-600'>{day.icon}</div>
                  <span className='text-sm font-bold'>{day.temp}</span>
                  <span className='text-xs text-gray-600 mt-1 text-center w-24'>
                    {day.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* News Based Insights */}
      <div className='mt-8'>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Industry Updates
        </h3>
        <Card>
          <div className='w-full space-y-4'>
            <div className='border-b pb-4'>
              <h4 className='font-medium text-gray-800'>
                New Organic Pesticide Approved
              </h4>
              <p className='text-sm text-gray-600 mt-1'>
                The EPA has approved a new organic pesticide effective against
                apple maggots with minimal environmental impact.
              </p>
              <div className='flex justify-between items-center mt-2'>
                <span className='text-xs text-gray-500'>
                  Source: Organic Farming Today
                </span>
                <button className='text-blue-600 text-xs font-medium hover:underline'>
                  Read More
                </button>
              </div>
            </div>

            <div className='border-b pb-4'>
              <h4 className='font-medium text-gray-800'>
                Drought Warning for Northeast Region
              </h4>
              <p className='text-sm text-gray-600 mt-1'>
                Meteorologists predict below-average rainfall for the next
                month. Consider adjusting irrigation schedules.
              </p>
              <div className='flex justify-between items-center mt-2'>
                <span className='text-xs text-gray-500'>
                  Source: Regional Agricultural Alert
                </span>
                <button className='text-blue-600 text-xs font-medium hover:underline'>
                  Read More
                </button>
              </div>
            </div>

            <div>
              <h4 className='font-medium text-gray-800'>
                New Study: Beneficial Insects Boost Apple Yield
              </h4>
              <p className='text-sm text-gray-600 mt-1'>
                Research shows introducing specific beneficial insects can
                increase yield by up to 15% in organic orchards.
              </p>
              <div className='flex justify-between items-center mt-2'>
                <span className='text-xs text-gray-500'>
                  Source: Agricultural Science Journal
                </span>
                <button className='text-blue-600 text-xs font-medium hover:underline'>
                  Read More
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrchardInsights
