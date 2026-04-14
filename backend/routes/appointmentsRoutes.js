import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getAppointments, createAppointment, updateAppointment } from '../controllers/appointmentsController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getAppointments)
router.post('/', createAppointment)
router.put('/:id', updateAppointment)

export default router
