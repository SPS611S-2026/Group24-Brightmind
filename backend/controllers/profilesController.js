import prisma from '../services/prismaClient.js'

export async function getAllProfiles(req, res) {
  try {
    // Return only counselors
    const users = await prisma.user.findMany({
      where: { role: 'counsellor' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        faculty: true,
        institution_code: true,
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getProfile(req, res) {
  const userId = req.user?.userId || req.user?.id
  if (!userId) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        faculty: true,
        institution_code: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateProfile(req, res) {
  const userId = req.user?.userId || req.user?.id
  if (!userId) return res.status(401).json({ error: 'Not authenticated' })

  const { name, faculty, institution_code } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(faculty !== undefined && { faculty }),
        ...(institution_code !== undefined && { institution_code: institution_code || null }),
      },
    })

    res.json(user)
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'That student card / counsellor code is already in use' })
    }
    res.status(500).json({ error: error.message })
  }
}

