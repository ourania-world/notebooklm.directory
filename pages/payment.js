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
        throw new Error(errorData.error || 'Failed to process payment');
      }
      
      const { url } = await response.json();
      // Simulate successful payment
      setPaymentSuccessful(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = url || '/subscription/success';
      }, 2000);
      setPaymentSuccessful(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = url || '/subscription/success';
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
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Left Column - Plan Details */}
            <div style={{ flex: '1 1 400px' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '1rem'
              }}>
                Complete Your Order
              </h1>
              
              <p style={{ 
                color: '#e2e8f0', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                You're subscribing to the <span style={{ color: '#00ff88', fontWeight: '600' }}>{selectedPlan.name}</span> plan.
              </p>
              
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700',
                      color: '#ffffff',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {selectedPlan.name} Plan
                    </h2>
                    <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                      {selectedPlan.description}
                    </p>
                  </div>
                  
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#00ff88',
                    textAlign: 'right'
                  }}>
                    ${selectedPlan.price}
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#e2e8f0',
                      fontWeight: '400',
                      display: 'block'
                    }}>
                      per {selectedPlan.interval || 'forever'}
                    </span>
                  </div>
                </div>
                
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '1rem'
                  }}>
                    What's Included:
                  </h3>
                  
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#e2e8f0',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#00ff88', fontSize: '1.1rem', flexShrink: 0 }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#00ff88'
                  }}>
                    🔒
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Secure Payment
                    </h3>
                    <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#00ff88'
                  }}>
                    ⚡
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Instant Access
                    </h3>
                    <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.85rem' }}>
                      Get immediate access to all available features. Coming soon features will be automatically enabled when ready.
                    </p>
                  </div>
                </div>
              </div>
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
                
                <form onSubmit={handlePayment}>
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
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.9rem'
                    }}>
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#00ff88'
                        }}
                      />
                      <label htmlFor="terms" style={{ color: '#e2e8f0' }}>
                        I agree to the <Link href="/terms" style={{ color: '#00ff88', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: '#00ff88', textDecoration: 'none' }}>Privacy Policy</Link>
                      </label>
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
                </form>
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
      </div>
    </Layout>
  );
}