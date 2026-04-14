import prisma from '../services/prismaClient.js'

export async function getResources(req, res) {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json(resources)
  } catch (error) {
    console.error('Get resources error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}

export async function createResource(req, res) {
  const { title, description, url, type } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Missing required field: title' })
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || '',
        url: url || '',
        type: type || 'article',
      },
    })
    res.status(201).json(resource)
  } catch (error) {
    console.error('Create resource error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}
