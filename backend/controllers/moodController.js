import prisma from '../services/prismaClient.js'

export async function getMoodLogs(req, res) {
  try {
    const logs = await prisma.moodLog.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function createMoodLog(req, res) {
  const { student_id, mood, sleep, appetite, energy, stress, notes } = req.body

  if (!student_id || !mood) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const log = await prisma.moodLog.create({
      data: {
        student_id,
        mood,
        sleep: sleep || null,
        appetite: appetite || null,
        energy: energy || null,
        stress: stress || null,
        notes: notes || null,
        date: new Date().toISOString().split('T')[0],
      },
    })
    res.status(201).json(log)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
