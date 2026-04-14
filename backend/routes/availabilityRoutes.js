import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getAvailability, createAvailability, updateAvailability, deleteAvailability } from '../controllers/availabilityController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getAvailability)
router.post('/', createAvailability)
router.put('/:id', updateAvailability)
router.delete('/:id', deleteAvailability)

export default router
