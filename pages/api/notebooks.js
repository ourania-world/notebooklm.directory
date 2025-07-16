import { getNotebooks } from '../../lib/notebooks'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse query parameters
    const { category, search, featured, limit } = req.query
    
    const filters = {}
    if (category) filters.category = category
    if (search) filters.search = search
    if (featured) filters.featured = featured === 'true'
    if (limit) filters.limit = parseInt(limit)

    const notebooks = await getNotebooks(filters)
    
    res.status(200).json(notebooks)
  } catch (error) {
    console.error('Error in /api/notebooks:', error)
    res.status(500).json({ error: 'Failed to fetch notebooks' })
  }
} 