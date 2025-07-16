import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { getCurrentUser } from '../lib/supabase';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptions';

export default function Payment() {
  const router = useRouter();
  const { plan = 'standard' } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  
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
  
  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setError(null);
    
    try {
      // Validate form
      if (!cardNumber || !cardExpiry || !cardCvc || !nameOnCard) {
        throw new Error('Please fill in all payment details');
      }
      
      // Simple validation
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Please enter a valid 16-digit card number');
      }
      
      if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        throw new Error('Please enter expiry date in MM/YY format');
      }
      
      if (cardCvc.length !== 3) {
        throw new Error('Please enter a valid 3-digit CVC code');
      }
      
      // For demo purposes, we'll simulate a successful payment
      // In a real implementation, this would call the Stripe API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      setPaymentSuccessful(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/subscription/success';
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiry(e.target.value);
    setCardExpiry(formattedValue);
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
  
  if (paymentSuccessful) {
    return (
      <Layout title="Payment Successful - NotebookLM Directory">
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '16px',
            padding: '3rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ 
              color: '#00ff88', 
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>
              Payment Successful!
            </h2>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', marginBottom: '1rem' }}>
              Your payment has been processed successfully.
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
              Redirecting you to your subscription details...
            </p>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 255, 136, 0.3)',
              borderTop: '3px solid #00ff88',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '2rem auto 0'
            }} />
          </div>
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
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ 
                color: '#00ff88', 
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}>
                Complete Your Subscription
              </h1>
              <p style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
                You're subscribing to the {selectedPlan.name} plan for ${selectedPlan.price}/month
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                color: '#ff6b6b'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handlePayment} style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#e2e8f0', 
                  marginBottom: '0.5rem',
                  fontSize: '1rem'
                }}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#e2e8f0',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#e2e8f0', 
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#e2e8f0', 
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength="3"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: '#e2e8f0', 
                  marginBottom: '0.5rem',
                  fontSize: '1rem'
                }}>
                  Name on Card
                </label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#e2e8f0',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={paymentLoading}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  background: paymentLoading ? 'rgba(0, 255, 136, 0.5)' : '#00ff88',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: paymentLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {paymentLoading ? 'Processing...' : `Pay $${selectedPlan.price}`}
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Link href="/pricing" style={{
                color: '#00ff88',
                textDecoration: 'none',
                fontSize: '1rem'
              }}>
                ← Back to Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}