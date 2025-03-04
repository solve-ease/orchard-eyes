import express from 'express'
import {
  getAllAnalysis,
  getLastAnalysis
} from '../controllers/analysisController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = express.Router()

router.get('/get-all-analysis', getAllAnalysis)
router.get('/get-last-analysis', getLastAnalysis)
export default router
