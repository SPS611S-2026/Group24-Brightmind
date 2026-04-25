import prisma from '../services/prismaClient.js'

function timeToMinutes(time) {
  if (!time) return null
  const [hours, minutes] = time.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

function hasTimeOverlap(existingStart, existingEnd, newStart, newEnd) {
  const existingStartMinutes = timeToMinutes(existingStart)
  const existingEndMinutes = timeToMinutes(existingEnd)
  const newStartMinutes = timeToMinutes(newStart)
  const newEndMinutes = timeToMinutes(newEnd)

  if (
    existingStartMinutes === null ||
    existingEndMinutes === null ||
    newStartMinutes === null ||
    newEndMinutes === null
  ) {
    return false
  }

  return existingStartMinutes < newEndMinutes && existingEndMinutes > newStartMinutes
}

export async function getAppointments(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        student: true,
        counsellor: true,
      },
    })
    res.json(appointments)
  } catch (error) {
    console.error('Get appointments error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function createAppointment(req, res) {
  const { student_id, counsellor_id, date, startTime, endTime, reason } = req.body

  if (!student_id || !counsellor_id || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const matchingAvailability = await prisma.availability.findFirst({
      where: {
        counsellor_id,
        date,
        startTime,
        endTime,
      },
    })

    if (!matchingAvailability) {
      return res.status(400).json({ error: 'Selected time slot is not available' })
    }

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        counsellor_id,
        date,
        status: { not: 'cancelled' },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    })

    const conflictingAppointment = existingAppointments.find(appointment =>
      hasTimeOverlap(appointment.startTime, appointment.endTime, startTime, endTime)
    )

    if (conflictingAppointment) {
      return res.status(409).json({ error: 'That counsellor is already booked for this time slot' })
    }

    const appointment = await prisma.appointment.create({
      data: {
        student_id,
        counsellor_id,
        date,
        startTime,
        endTime,
        reason: reason || '',
        status: 'pending',
      },
      include: {
        student: true,
        counsellor: true,
      },
    })
    res.status(201).json(appointment)
  } catch (error) {
    console.error('Create appointment error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function updateAppointment(req, res) {
  const { id } = req.params
  const userId = req.user?.userId || req.user?.id
  const { status, reason, urgent, flagged_by } = req.body

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { counsellor: true, student: true },
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }

    const isCounsellorOwner = appointment.counsellor_id === userId
    const isStudentOwner = appointment.student_id === userId

    if (!isCounsellorOwner && !isStudentOwner) {
      return res.status(403).json({ error: 'Not allowed to update this appointment' })
    }

    if (status === 'confirmed' && !isCounsellorOwner) {
      return res.status(403).json({ error: 'Only the assigned counsellor can accept appointments' })
    }

    if (status === 'completed' && !isCounsellorOwner) {
      return res.status(403).json({ error: 'Only the assigned counsellor can complete appointments' })
    }

    if (status === 'cancelled' && !isCounsellorOwner && !isStudentOwner) {
      return res.status(403).json({ error: 'Only appointment participants can cancel/reject appointments' })
    }

    const data = {
      ...(status && { status }),
      ...(reason !== undefined && { reason }),
      ...(urgent !== undefined && { urgent }),
      ...(flagged_by !== undefined && { flagged_by }),
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data,
      include: { student: true, counsellor: true },
    })
    res.json(updatedAppointment)
  } catch (error) {
    console.error('Update appointment error:', error)
    res.status(500).json({ error: error.message })
  }
}
