import { useState } from 'react'
import { SUBSCRIPTION_PLANS, createCheckoutSession } from '../lib/subscriptions'
import { getCurrentUser } from '../lib/auth'

export default function SubscriptionModal({ isOpen, onClose, currentPlan = 'free' }) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('basic')

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      
      if (!user) {
        alert('Please sign in to upgrade your subscription')
        return
      }

      const successUrl = `${window.location.origin}/subscription/success`
      const cancelUrl = `${window.location.origin}/subscription/cancel`
      
      const { url } = await createCheckoutSession(user.id, planId, successUrl, cancelUrl)
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '20px',
        padding: '2.5rem',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            Choose Your <span style={{ color: '#00ff88' }}>Plan</span>
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#e2e8f0',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#00ff88';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#e2e8f0';
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {[SUBSCRIPTION_PLANS.FREE, SUBSCRIPTION_PLANS.STANDARD, SUBSCRIPTION_PLANS.PROFESSIONAL].map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.id === 'professional' ? 
                  'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                border: plan.id === currentPlan ? 
                  '2px solid #00ff88' : 
                  '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (plan.id !== currentPlan) {
                  e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                  e.target.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (plan.id !== currentPlan) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {plan.id === 'professional' && (
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
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    color: '#e2e8f0',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === currentPlan ? (
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
                  Current Plan
                </button>
              ) : plan.id === 'free' ? (
                <button
                  onClick={onClose}
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
                  Continue Free
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
                  {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
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
          <p style={{ margin: '0 0 0.5rem 0' }}>
            ✓ Cancel anytime • ✓ 30-day money-back guarantee • ✓ Secure payment with Stripe
          </p>
          <p style={{ margin: 0, opacity: 0.7 }}>
            Questions? Contact us at support@notebooklm-directory.com
          </p>
        </div>
      </div>
    </div>
  )
}