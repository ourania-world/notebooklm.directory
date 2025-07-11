import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/supabase'

export default function SubscriptionManager() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [availablePlans, setAvailablePlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null) 

  useEffect(() => {
    async function loadSubscriptionData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          setError('Authentication required')
          setLoading(false)
          return
        }

        // In a real implementation, we would fetch subscription data from the API
        // For now, we'll just simulate a subscription
        setTimeout(() => {
          setSubscription({
            subscription_plans: {
              id: 'standard',
              name: 'Standard',
              price: 9.99,
              interval: 'month',
              description: 'Great for regular users'
            },
            status: 'active',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          
          setAvailablePlans([
            {
              id: 'free',
              name: 'Explorer',
              price: 0,
              description: 'Perfect for getting started',
              features: ['Access to public notebooks', 'Save up to 5 notebooks', 'Submit unlimited notebooks']
            },
            {
              id: 'standard',
              name: 'Standard',
              price: 9.99,
              interval: 'month',
              description: 'Great for regular users',
              features: ['Everything in Explorer', 'Unlimited saved notebooks', 'Advanced search features']
            },
            {
              id: 'professional',
              name: 'Professional',
              price: 19.99,
              interval: 'month',
              description: 'For power users and professionals',
              features: ['Everything in Standard', 'Premium content access', 'Advanced analytics']
            }
          ])

          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error('Error loading subscription:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSubscriptionData()
  }, [])

  const handleAction = async (action) => {
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    // Simulate API call
    setTimeout(() => {
      if (action === 'portal') {
        // Redirect to pricing page for now
        window.location.href = '/pricing'
      } else if (action === 'cancel') {
        setSuccess('Your subscription has been canceled and will end at the end of the current billing period.')
        setSubscription({
          ...subscription,
          canceled_at: new Date().toISOString(),
          status: 'canceled'
        })
      } else if (action === 'reactivate') {
        setSuccess('Your subscription has been reactivated successfully.')
        setSubscription({
          ...subscription,
          canceled_at: null,
          status: 'active'
        })
      }
      setActionLoading(false)
    }, 1500)
  }

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0, 255, 136, 0.3)',
          borderTop: '3px solid #00ff88',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <p style={{ color: '#e2e8f0', marginTop: '1rem' }}>
          Loading subscription details...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(220, 53, 69, 0.1)',
        color: '#dc3545',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(220, 53, 69, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ margin: '0 0 1rem 0' }}>Error Loading Subscription</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    )
  }

  return (
    <div>
      {success && (
        <div style={{
          background: 'rgba(0, 255, 136, 0.1)',
          color: '#00ff88',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.3)'
        }}>
          {success}
        </div>
      )}

      {/* Current Subscription */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ 
          color: '#ffffff', 
          fontSize: '1.3rem', 
          margin: '0 0 1.5rem 0',
          fontWeight: '600'
        }}>
          Current Subscription
        </h3>

        {subscription ? (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ color: '#00ff88', fontSize: '1.2rem', fontWeight: '600' }}>
                  {subscription.subscription_plans?.name || 'Unknown Plan'}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  ${subscription.subscription_plans?.price || 0}
                  {subscription.subscription_plans?.interval ? `/${subscription.subscription_plans?.interval}` : '/month'}
                </div>
              </div>
              <div style={{
                background: subscription.status === 'active' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                color: subscription.status === 'active' ? '#00ff88' : '#dc3545',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {subscription.status}
              </div>
            </div>

            <div style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {subscription.current_period_end && (
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
              {subscription.canceled_at && (
                <p style={{ margin: 0, color: '#ffc107' }}>
                  ⚠️ Subscription will cancel at the end of the current period
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleAction('portal')}
                disabled={actionLoading}
                style={{ 
                  background: 'rgba(220, 53, 69, 0.05)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.7 : 1
                }}
              >
                {actionLoading ? 'Loading...' : 'Manage Billing'}
              </button>

              {subscription.canceled_at ? (
                <button
                  onClick={() => handleAction('reactivate')}
                  disabled={actionLoading}
                  style={{
                    background: 'transparent',
                    color: '#00ff88',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.7 : 1
                  }}
                >
                  {actionLoading ? 'Loading...' : 'Reactivate'}
                </button>
              ) : (
                <button
                  onClick={() => handleAction('cancel')}
                  disabled={actionLoading}
                  style={{
                    background: 'transparent',
                    color: '#dc3545',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.7 : 1
                  }}
                >
                  {actionLoading ? 'Loading...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
              No Active Subscription
            </h4>
            <p style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>
              You're currently on the free plan
            </p>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: '#0a0a0a',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
      
      {/* Available Plans */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(0, 255, 136, 0.2)'
      }}>
        <h3 style={{ 
          color: '#ffffff', 
          fontSize: '1.3rem', 
          margin: '0 0 1.5rem 0',
          fontWeight: '600'
        }}>
          Available Plans
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {availablePlans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.id === subscription?.subscription_plans?.id ? 
                  'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: plan.id === subscription?.subscription_plans?.id ? 
                  '2px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              {plan.id === subscription?.subscription_plans?.id && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#00ff88',
                  color: '#0a0a0a',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  Current
                </div>
              )}

              <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                {plan.name}
              </h4>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {plan.description}
              </p>
              
              {plan.features && (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}