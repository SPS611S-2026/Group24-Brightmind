export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  const userId = req.headers['x-user-id']

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  // Validate token format (basic check)
  if (!token.startsWith('token_')) {
    return res.status(401).json({ error: 'Invalid token format' })
  }

  // For now, accept any valid token format
  // In production, implement proper JWT validation
  req.user = {
    id: userId || token,
    token: token,
    userId: userId,
  }

  next()
}
