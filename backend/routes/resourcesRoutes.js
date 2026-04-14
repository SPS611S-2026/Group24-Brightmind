import express from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { getResources, createResource } from '../controllers/resourcesController.js'

const router = express.Router()

router.use(authenticate)
router.get('/', getResources)
router.post('/', createResource)

export default router
