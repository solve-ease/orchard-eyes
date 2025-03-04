import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/user.js'
import imagePredictionRoutes from './src/routes/imagePrediction.js'
import weatherRoutes from './src/routes/weather.js'
import { prisma } from './src/utils/prismaClient.js'

const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.110.180:5173',
      'http://192.168.3.117:5173',
      'https://iiituna-orchardeyes.vercel.app',
      'http://172.16.4.155:5173',
      'https://agri-aero.vercel.app',
      'https://orchard-eyes-new.vercel.app'
    ],
    credentials: true // Allows cookies/auth headers
  })
)

app.use(express.json())

// sse setup
let clients = []

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Send an initial connection confirmation
  // res.write(
  //   `data: ${JSON.stringify({
  //     status: 'Connected',
  //     timestamp: new Date().toISOString()
  //   })}\n\n`
  // )

  clients.push(res)

  // Remove the client when the connection closes
  req.on('close', () => {
    clients = clients.filter((client) => client !== res)
  })
})

app.get('/', (req, res) => {
  console.log('req received')
  res.send('Hello World!')
})
app.post('/farm-metrics', async (req, res) => {
  //getting farm metrics from drone/ml server
  console.log('req received', req.body)
  const data = req.body.Tree_Health_Report
  //uploading analysis data to db
  await prisma.analysis.create({
    data: {
      detected_diseases: data.Detected_Diseases,
      organ_counts: data.Organ_Counts,
      farmId: data.farmId
    }
  })
  //not using sse code now
  // clients.forEach((client) => {
  //   client.write(`data: ${JSON.stringify(req.body)}\n\n`)
  // })

  res.json({ success: true, message: 'Data sent to SSE clients' })
})
app.use('/user', userRoutes)
app.use('/predict', imagePredictionRoutes)
app.use('/', weatherRoutes)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// {
//   "Tree_Health_Report":{
// "Detected_Diseases":{
//   "Apple-Scab":{
//     "fruits":3,
//     "leaves":2
//   },
//   "Fire-Blight":{
//     "fruits":2
//   },
//   "Powdery-Mildew":{
//     "leaves":4
//   }
// },
// "Organ_Counts":{
//   "Fruits":{
//   "diseased":10,
//   "healthy":20
//   },
//   "Leaves":{
//   "diseased":70,
//   "healthy":50
//   }
// }
//   }
// }
