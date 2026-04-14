import prisma from '../services/prismaClient.js'

export async function getAvailability(req, res) {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        counsellor: true,
      },
    })
    res.json(availability)
  } catch (error) {
    console.error('Get availability error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function getAvailabilityByCounsellor(req, res) {
  const { counsellor_id } = req.params

  try {
    const availability = await prisma.availability.findMany({
      where: { counsellor_id },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    res.json(availability)
  } catch (error) {
    console.error('Get availability error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function createAvailability(req, res) {
  const { counsellor_id, date, startTime, endTime } = req.body

  if (!counsellor_id || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields: counsellor_id, date, startTime, endTime' })
  }

  try {
    const newAvailability = await prisma.availability.create({
      data: {
        counsellor_id,
        date,
        startTime,
        endTime,
      },
      include: {
        counsellor: true,
      },
    })
    res.status(201).json(newAvailability)
  } catch (error) {
    console.error('Create availability error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function updateAvailability(req, res) {
  const { id } = req.params
  const { date, startTime, endTime } = req.body

  if (!id) {
    return res.status(400).json({ error: 'Availability ID is required' })
  }

  try {
    const updateData = {}
    if (date !== undefined) updateData.date = date
    if (startTime !== undefined) updateData.startTime = startTime
    if (endTime !== undefined) updateData.endTime = endTime

    const updated = await prisma.availability.update({
      where: { id },
      data: updateData,
      include: {
        counsellor: true,
      },
    })
    res.json(updated)
  } catch (error) {
    console.error('Update availability error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function deleteAvailability(req, res) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'Availability ID is required' })
  }

  try {
    const deleted = await prisma.availability.delete({
      where: { id },
    })
    res.json({ success: true, deleted })
  } catch (error) {
    console.error('Delete availability error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}
