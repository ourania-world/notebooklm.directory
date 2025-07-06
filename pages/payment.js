import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getCurrentUser } from '../lib/supabase';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptions';

export default function Payment() {
  const router = useRouter();
  const { plan = 'standard' } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login?redirect=/payment');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('Authentication error. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);
  
  const selectedPlan = SUBSCRIPTION_PLANS[plan?.toUpperCase()] || SUBSCRIPTION_PLANS.STANDARD;
  
  const handlePayment = async () => {
    setPaymentLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.id,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Layout title="Payment - NotebookLM Directory">
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 255, 136, 0.3)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ color: '#e2e8f0', marginTop: '1rem' }}>
            Loading payment details...
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${selectedPlan.name} Plan - NotebookLM Directory`}>
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '80vh',
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Complete Your <span style={{ color: '#00ff88' }}>{selectedPlan.name}</span> Subscription
          </h1>
          
          <p style={{ 
            color: '#e2e8f0', 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            You're just one step away from unlocking premium features and supporting our platform.
          </p>
          
          {error && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.1)',
              color: '#ff6b6b',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              border: '1px solid rgba(220, 53, 69, 0.3)'
            }}>
              {error}
            </div>
          )}
          
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0'
                }}>
                  {selectedPlan.name} Plan
                </h2>
                <p style={{ color: '#e2e8f0', margin: 0 }}>
                  {selectedPlan.description}
                </p>
              </div>
              
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#00ff88'
              }}>
                ${selectedPlan.price}
                <span style={{
                  fontSize: '1rem',
                  color: '#e2e8f0',
                  fontWeight: '400'
                }}>
                  /{selectedPlan.interval || 'forever'}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '1rem'
              }}>
                What's Included:
              </h3>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem'
              }}>
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    color: '#e2e8f0'
                  }}>
                    <span style={{ color: '#00ff88', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '2rem'
            }}>
              <p style={{ color: '#00ff88', margin: 0 }}>
                <strong>7-day free trial included!</strong> You won't be charged until your trial ends, and you can cancel anytime.
              </p>
            </div>
            
            <button
              onClick={handlePayment}
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
              {paymentLoading ? 'Processing...' : `Subscribe to ${selectedPlan.name}`}
            </button>
          </div>
          
          <div style={{
            textAlign: 'center',
            color: '#e2e8f0',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              ✓ 7-day free trial • ✓ Cancel anytime • ✓ Secure payment with Stripe
            </p>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Questions? Contact us at support@notebooklm.directory
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}