const { VITE_BACKEND_URL } = import.meta.env

export const createUser = async (email, name) => {
  const response = await fetch(`${VITE_BACKEND_URL}/user/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, name })
  })
  return response.json()
}
export const getUser = async (email) => {
  const userData = await fetch(
    `${VITE_BACKEND_URL}/user/get-user?email=${encodeURIComponent(email)}`
  )
  return userData.json()
}
export const getImagePrediction = async (formdata) => {
  const response = await fetch(
    `${VITE_BACKEND_URL}/predict/part-classification`,
    {
      method: 'POST',
      body: formdata
    }
  )
  return response.json()
}
export const getWeatherData = async (latitude, longitude) => {
  const res = await fetch(
    `${VITE_BACKEND_URL}/get-weather-data?lat=${latitude}&lon=${longitude}`
  )
  const data = await res.json()
  console.log(data)
  return data
}
export const getFarmMetrics = async (onDataRecieved) => {
  const eventSource = new EventSource(`${VITE_BACKEND_URL}/events`)

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('data', data)
    onDataRecieved(data) // Update UI when new data arrives
  }

  return () => eventSource.close()
}
