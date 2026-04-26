export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  const userId = req.headers['x-user-id']

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  if (!token.startsWith('token_')) {
    return res.status(401).json({ error: 'Invalid token format' })
  }


  req.user = {
    id: userId || token,
    token: token,
    userId: userId,
  }

  next()
}
