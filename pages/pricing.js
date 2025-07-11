import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS } from '../lib/subscriptions';
import { getCurrentUser } from '../lib/supabase';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);
      
      // Redirect to payment page with selected plan
      window.location.href = `/payment?plan=${planId}`;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Pricing - NotebookLM Directory">
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '80vh',
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Simple, Transparent <span style={{ color: '#00ff88' }}>Pricing</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#e2e8f0',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto 3rem auto'
          }}>
            <span style={{ color: '#00ff88', fontWeight: '600' }}>Subscribe & Support Our Growth!</span> Choose the plan that works best for you
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: plan.id === 'premium' ? 
                    'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)' :
                    'rgba(255, 255, 255, 0.05)',
                  border: plan.id === selectedPlan ?  
                    '2px solid #00ff88' : 
                    '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  opacity: plan.id === 'enterprise' ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (plan.id !== selectedPlan && plan.id !== 'enterprise') {
                    e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    e.target.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.id !== selectedPlan && plan.id !== 'enterprise') {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {plan.limits?.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    color: '#0a0a0a',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Most Popular
                  </div>
                )}
                
                {plan.id === 'enterprise' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)', 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Coming Soon
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#00ff88',
                    margin: '0 0 0.25rem 0'
                  }}>
                    ${plan.price}
                    {plan.interval && (
                      <span style={{
                        fontSize: '1rem',
                        color: '#e2e8f0',
                        fontWeight: '400'
                      }}>
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 2rem 0'
                }}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      color: '#e2e8f0',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
                      {feature}
                      {(feature.includes('API') || 
                        feature.includes('analytics') || 
                        feature.includes('metrics') || 
                        feature.includes('recommendations') || 
                        feature.includes('Email notifications')) && (
                        <span style={{ 
                          marginLeft: '0.25rem',
                          fontSize: '0.7rem',
                          color: '#ffc107',
                          background: 'rgba(255, 193, 7, 0.1)',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '4px'
                        }}>
                          Coming Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {plan.id === 'enterprise' ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'not-allowed'
                    }}
                  >
                    Coming Soon
                  </button>
                ) : plan.id === 'free' ? (
                  <button
                    onClick={() => setSelectedPlan('free')}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      color: '#e2e8f0',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#00ff88';
                      e.target.style.color = '#00ff88';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.color = '#e2e8f0';
                    }}
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)} 
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading ? 
                        'rgba(255, 255, 255, 0.1)' : 
                        'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                      color: loading ? '#ffffff' : '#0a0a0a',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px' 
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  > 
                    {loading ? 'Processing...' : `Upgrade to ${plan.name} Plan`}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            color: '#e2e8f0',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
              ✓ Cancel anytime • ✓ 30-day money-back guarantee • ✓ Secure payment with Stripe
            </p>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>
              Questions? Contact us at support@notebooklm.directory
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}