import express from 'express'
import { login, registerUser, getProfile } from '../controllers/authController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', registerUser)
router.get('/profile', authenticate, getProfile)

export default router
