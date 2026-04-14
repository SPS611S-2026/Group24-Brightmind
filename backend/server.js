import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import appointmentRoutes from './routes/appointmentsRoutes.js'
import moodRoutes from './routes/moodRoutes.js'
import resourceRoutes from './routes/resourcesRoutes.js'
import sessionNotesRoutes from './routes/sessionNotesRoutes.js'
import availabilityRoutes from './routes/availabilityRoutes.js'
import profilesRoutes from './routes/profilesRoutes.js'

dotenv.config()

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/mood_logs', moodRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/session_notes', sessionNotesRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/profiles', profilesRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`)
})
