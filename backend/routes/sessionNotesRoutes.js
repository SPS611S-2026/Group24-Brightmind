import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getSessionNotes, createSessionNote } from '../controllers/sessionNotesController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getSessionNotes)
router.post('/', createSessionNote)

export default router
