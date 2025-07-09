import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../lib/supabase';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptions';

export default function PaymentTest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  
  // Test card details
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/25');
  const [cardCvc, setCardCvc] = useState('123');
  const [nameOnCard, setNameOnCard] = useState('Test User');
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login?redirect=/payment-test';
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
  }, []);
  
  const plan = SUBSCRIPTION_PLANS[selectedPlan?.toUpperCase()] || SUBSCRIPTION_PLANS.STANDARD;
  
  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setError(null);
    setSuccess(null);
    
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if using test card
      if (cardNumber.replace(/\s/g, '') === '4242424242424242') {
        setSuccess('Payment successful! Your subscription is now active.');
        
        // Simulate redirect to success page
        setTimeout(() => {
          window.location.href = '/subscription/success';
        }, 2000);
      } else if (cardNumber.replace(/\s/g, '') === '4000000000000002') {
        throw new Error('Your card was declined. Please try a different card.');
      } else {
        throw new Error('Invalid test card. Please use 4242 4242 4242 4242 for success or 4000 0000 0000 0002 for failure.');
      }
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
      <Layout title="Payment Test - NotebookLM Directory">
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
            Loading payment test...
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
    <Layout title="Payment Test - NotebookLM Directory">
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Payment System <span style={{ color: '#00ff88' }}>Test</span>
        </h1>
        
        <p style={{ 
          color: '#e2e8f0', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Use this page to test the payment system with Stripe test cards.
        </p>
        
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.5rem'
          }}>
            Test Cards
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem'
          }}>
            <div style={{
              background: 'rgba(0, 255, 136, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h3 style={{ 
                color: '#00ff88', 
                marginTop: 0,
                marginBottom: '0.5rem',
                fontSize: '1.2rem'
              }}>
                Success Card
              </h3>
              <p style={{ 
                color: '#e2e8f0', 
                margin: '0 0 0.5rem 0',
                fontFamily: 'monospace',
                fontSize: '1.1rem'
              }}>
                4242 4242 4242 4242
              </p>
              <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                Use any future date and any 3 digits for CVC
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 107, 107, 0.2)'
            }}>
              <h3 style={{ 
                color: '#ff6b6b', 
                marginTop: 0,
                marginBottom: '0.5rem',
                fontSize: '1.2rem'
              }}>
                Decline Card
              </h3>
              <p style={{ 
                color: '#e2e8f0', 
                margin: '0 0 0.5rem 0',
                fontFamily: 'monospace',
                fontSize: '1.1rem'
              }}>
                4000 0000 0000 0002
              </p>
              <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                Use any future date and any 3 digits for CVC
              </p>
            </div>
          </div>
        </div>
        
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
        
        {success && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            color: '#00ff88',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            fontSize: '0.9rem'
          }}>
            {success}
          </div>
        )}
        
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: '#ffffff',
            marginTop: 0,
            marginBottom: '1.5rem'
          }}>
            Payment Form
          </h2>
          
          <form onSubmit={handlePayment}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Select Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                <option value="standard" style={{ background: '#1a1a2e', color: '#ffffff' }}>
                  Standard - $9.99/month
                </option>
                <option value="professional" style={{ background: '#1a1a2e', color: '#ffffff' }}>
                  Professional - $19.99/month
                </option>
              </select>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Name on Card
              </label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="John Smith"
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                required
                maxLength="19"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  required
                  maxLength="5"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  CVC
                </label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  required
                  maxLength="3"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            
            <button
              type="submit"
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
              {paymentLoading ? 'Processing...' : `Pay $${plan.price}/${plan.interval || 'once'}`}
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
          </form>
        </div>
      </div>
    </Layout>
  );
}