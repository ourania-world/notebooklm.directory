export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // This is a mock webhook handler for demonstration purposes
  // In a real implementation, this would verify and process Stripe webhook events

  console.log('Received webhook event:', req.body);

  // Respond with success
  res.status(200).json({ received: true });
}