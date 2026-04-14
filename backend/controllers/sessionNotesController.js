import prisma from '../services/prismaClient.js'

export async function getSessionNotes(req, res) {
  try {
    const sessionNotes = await prisma.sessionNote.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        appointment: true,
        counsellor: true,
      },
    })
    res.json(sessionNotes)
  } catch (error) {
    console.error('Get session notes error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function createSessionNote(req, res) {
  const { appointment_id, counsellor_id, date, notes } = req.body

  if (!appointment_id || !counsellor_id) {
    return res.status(400).json({ error: 'Missing required fields: appointment_id, counsellor_id' })
  }

  try {
    const sessionNote = await prisma.sessionNote.create({
      data: {
        appointment_id,
        counsellor_id,
        date: date || new Date().toISOString().split('T')[0],
        notes: notes || '',
      },
      include: {
        appointment: true,
        counsellor: true,
      },
    })
    res.status(201).json(sessionNote)
  } catch (error) {
    console.error('Create session note error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}
