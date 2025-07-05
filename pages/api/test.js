// API route for testing Next.js API functionality
import { getNotebooks, getCategoryCounts } from '../../lib/notebooks';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Test basic functionality
      const notebooks = await getNotebooks();
      const featuredNotebooks = await getNotebooks({ featured: true });
      const categoryCounts = await getCategoryCounts();
      
      res.status(200).json({
        success: true,
        data: {
          totalNotebooks: notebooks.length,
          featuredNotebooks: featuredNotebooks.length,
          categoryCounts,
          sampleNotebook: notebooks[0] || null
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}