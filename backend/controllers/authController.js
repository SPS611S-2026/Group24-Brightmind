import prisma from '../services/prismaClient.js'

function generateToken() {
  return 'token_' + Math.random().toString(36).substr(2, 21) + Date.now().toString(36)
}

export async function login(req, res) {
  const { email, password, role } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (role && user.role !== role) {
      return res.status(403).json({ error: `Wrong role. Expected ${user.role}.` })
    }

    const token = generateToken()
    res.json({
      token,
      session: {
        access_token: token,
        token_type: 'bearer',
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        faculty: user.faculty,
        institution_code: user.institution_code,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
}

export async function registerUser(req, res) {
  const { email, password, name, role, faculty, institution_code } = req.body
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if ((role === 'student' || role === 'counsellor') && !institution_code) {
    return res.status(400).json({ error: 'Student card / counsellor code is required' })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        institution_code: institution_code || null,
        password,
        role,
        faculty: faculty || null,
      },
    })

    const token = generateToken()
    res.status(201).json({
      token,
      session: {
        access_token: token,
        token_type: 'bearer',
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        faculty: user.faculty,
        institution_code: user.institution_code,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'That student card / counsellor code is already in use' })
    }
    res.status(500).json({ error: error.message })
  }
}

export async function getProfile(req, res) {
  const userId = req.user?.userId || req.user?.id
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      institution_code: user.institution_code,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: error.message })
  }
}
