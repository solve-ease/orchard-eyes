import express from 'express'
import {
  getAllAnalysis,
  getLastAnalysis
} from '../controllers/analysisController'
import { checkAuth } from '../middlewares/checkAuth'

const router = express.Router()

router.get('/get-all-analysis', checkAuth, getAllAnalysis)
router.get('/get-last-analysis', checkAuth, getLastAnalysis)
export default router
