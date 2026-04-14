import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getMoodLogs, createMoodLog } from '../controllers/moodController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getMoodLogs)
router.post('/', createMoodLog)

export default router
