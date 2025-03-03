import express from 'express'
import { body, validationResult } from 'express-validator'
import { createUser, editUser, getUser } from '../controllers/userController.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = express.Router()

router.post(
  '/create-user',
  [body('email').isEmail().withMessage('Invalid email')],
  createUser
)
router.post('/edit-user', checkAuth, editUser)
router.get('/get-user', getUser)
export default router
