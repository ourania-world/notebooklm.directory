export default function Payment() {
  const router = useRouter();
  const { plan = 'standard' } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showStripe, setShowStripe] = useState(false);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login?redirect=/payment');
          return;
        }
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('Authentication error. Please try logging in again.');
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);
  
  const selectedPlan = SUBSCRIPTION_PLANS[plan?.toUpperCase()] || SUBSCRIPTION_PLANS.STANDARD;
  
  const handleInitiatePayment = async () => {
    setPaymentLoading(true);
    setError(null);
    
    try {
      // Create a payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100, // Convert to cents
          currency: 'usd',
          description: `Subscription to ${selectedPlan.name} plan`,
          planId: selectedPlan.id
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }
      
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setShowStripe(true);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Rest of your component...
  
  return (
    <Layout>
      {/* Your existing layout code */}
      
      {!showStripe ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Left Column - Plan Details */}
          <div style={{ flex: '1 1 400px' }}>
            {/* Plan details content... */}
          </div>
          
          {/* Right Column - Payment Form */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '1.5rem'
              }}>
                Payment Details
              </h2>
              
              {error && (
                <div style={{
                  background: 'rgba(220, 53, 69, 0.1)',
                  color: '#ff6b6b',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  fontSize: '0.9rem'
                }}>
                  {error}
                </div>
              )}
              
              <div style={{ marginBottom: '2rem' }}>
                <button 
                  onClick={handleInitiatePayment}
                  disabled={paymentLoading}
                  style={{
                    width: '100%',
                    background: paymentLoading ? 
                      'rgba(255, 255, 255, 0.1)' : 
                      'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    color: paymentLoading ? '#ffffff' : '#0a0a0a',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: paymentLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {paymentLoading ? 'Processing...' : `Pay $${selectedPlan.price}/${selectedPlan.interval || 'once'}`}
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🔒</span>
                  Secure payment processed by Stripe
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                color: '#e2e8f0',
                fontSize: '0.9rem'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  ✓ Cancel anytime • ✓ No hidden fees
                </p>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  Questions? Contact us at support@notebooklm.directory
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '1.5'
      }}
