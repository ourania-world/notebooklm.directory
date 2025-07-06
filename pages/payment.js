import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { getCurrentUser } from '../lib/supabase';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptions';
import dynamic from 'next/dynamic';

const StripeComponents = dynamic(
  () => import('../components/StripeComponents'),
  { ssr: false }
);

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
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price * 100,
          currency: 'usd',
          description: `Subscription to ${selectedPlan.name} plan`,
          planId: selectedPlan.id,
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

  if (loading) {
    return (
      <Layout title={`${selectedPlan.name} Plan - NotebookLM Directory`}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid rgba(0, 255, 136, 0.3)', borderTop: '4px solid #00ff88', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ color: '#e2e8f0', marginTop: '1rem' }}>Loading payment details...</p>
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
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', minHeight: '80vh', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          {!showStripe ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 400px' }}>
                {/* Plan details would be here */}
              </div>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem' }}>Payment Details</h2>

                  {error && (
                    <div style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(220, 53, 69, 0.3)', fontSize: '0.9rem' }}>
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleInitiatePayment}
                    disabled={paymentLoading}
                    style={{
                      width: '100%',
                      background: paymentLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                      color: paymentLoading ? '#ffffff' : '#0a0a0a',
                      border: 'none',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: paymentLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {paymentLoading ? 'Processing...' : `Pay $${selectedPlan.price}/${selectedPlan.interval || 'once'}`}
                  </button>

                  <div style={{ textAlign: 'center', color: '#e2e8f0', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>✓ Cancel anytime • ✓ No hidden fees</p>
                    <p style={{ margin: 0, opacity: 0.7 }}>Questions? Contact us at support@notebooklm.directory</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(0, 255, 136, 0.2)', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>Complete Your Payment</h2>
              <StripeComponents clientSecret={clientSecret} />
              <button onClick={() => setShowStripe(false)} style={{ display: 'block', margin: '2rem auto 0', background: 'transparent', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>← Back to plan details</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
