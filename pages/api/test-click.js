export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return a simple notebook for testing click functionality
  const testNotebook = {
    id: "test-click-123",
    title: "Test AI Discussion from Reddit",
    description: "This is a test notebook to verify click-through functionality. Users should be able to click on content cards and see full details like this one.",
    category: "AI",
    author: "TestUser",
    source_platform: "reddit",
    url: "https://reddit.com/r/MachineLearning/test",
    notebook_url: "https://reddit.com/r/MachineLearning/test",
    created_at: new Date().toISOString(),
    featured: false,
    tags: ["AI", "Test", "Machine Learning"],
    extraction_data: {
      qualityScore: 0.85,
      originalMetadata: {
        subreddit: "MachineLearning",
        score: 42,
        comments: 15
      }
    }
  };

  return res.status(200).json({
    success: true,
    notebook: testNotebook,
    message: "Click-through test data ready"
  });
}