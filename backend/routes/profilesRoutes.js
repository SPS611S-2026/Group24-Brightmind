import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, getAllProfiles } from '../controllers/profilesController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getAllProfiles)
router.get('/me', getProfile)
router.put('/:id', updateProfile)

export default router
