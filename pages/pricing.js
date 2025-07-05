import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Pricing() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('professional')

  const plans = [
    {
      id: 'explorer',
      name: 'Explorer',
      price: 0,
      period: 'forever',
      description: 'Sustainable Discovery for All',
      features: [
        'Browse 10,000+ curated notebooks',
        'Save up to 5 notebooks',
        'Basic search & filtering',
        'Community access',
        'Environmental impact tracking',
        'Mobile-optimized experience'
      ],
      limits: {
        savedNotebooks: 5,
        submittedNotebooks: 2,
        premiumContent: false
      },
      cta: 'Start Free',
      popular: false,
      environmental: 'Join the sustainable research movement'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 29,
      period: 'month',
      description: 'Accelerate Your Impact, Measure Your Footprint',
      features: [
        'Everything in Explorer',
        'Save unlimited notebooks',
        'Submit up to 25 notebooks',
        'Advanced search & AI recommendations',
        'Personal environmental dashboard',
        'Priority support',
        'API access (1000 calls/month)',
        'Export & integration tools'
      ],
      limits: {
        savedNotebooks: -1,
        submittedNotebooks: 25,
        premiumContent: true
      },
      cta: 'Upgrade to Professional',
      popular: true,
      environmental: '47% reduction in redundant research'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'Scale Your Innovation, Achieve Your ESG Goals',
      features: [
        'Everything in Professional',
        'Unlimited notebook submissions',
        'Team collaboration tools',
        'Advanced analytics dashboard',
        'Custom ESG reporting',
        'White-label options',
        'Dedicated account manager',
        'API access (10,000 calls/month)',
        'Custom integrations'
      ],
      limits: {
        savedNotebooks: -1,
        submittedNotebooks: -1,
        premiumContent: true
      },
      cta: 'Contact Sales',
      popular: false,
      environmental: 'Institutional carbon footprint tracking'
    }
  ]

  const handlePlanSelect = async (plan) => {
    if (plan.id === 'explorer') {
      // Free plan - just redirect to signup
      window.location.href = user ? '/browse' : '/'
      return
    }

    if (plan.id === 'enterprise') {
      // Enterprise - contact sales
      window.location.href = 'mailto:sales@notebooklm.directory?subject=Enterprise Plan Inquiry'
      return
    }

    if (!user) {
      // Need to sign up first
      alert('Please sign up for a free account first, then upgrade to Professional')
      return
    }

    setLoading(true)
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_professional_monthly', // This would be your actual Stripe price ID
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Error starting checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Pricing - NotebookLM Directory">
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh',
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0',
              lineHeight: '1.1'
            }}>
              Choose Your <span style={{ color: '#00ff88' }}>Impact</span>
            </h1>
            <p style={{ 
              fontSize: '1.3rem',
              color: '#e2e8f0',
              maxWidth: '600px',
              margin: '0 auto 2rem auto',
              lineHeight: '1.6'
            }}>
              Resource-efficient design delivers superior performance while reducing computational waste and accelerating discovery
            </p>
            
            {/* Environmental Impact Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '2rem',
              background: 'rgba(0, 255, 136, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  $3.2M
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Computational Costs Saved
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  47%
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Reduction in Redundant Research
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  156T
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  CO₂ Emissions Prevented
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: plan.popular ? 
                    'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)' :
                    'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  border: plan.popular ? 
                    '2px solid #00ff88' : 
                    '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPlan(plan.id)}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    e.target.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    color: '#0a0a0a',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: '#00ff88',
                    margin: '0 0 0.25rem 0'
                  }}>
                    ${plan.price}
                    {plan.period !== 'forever' && (
                      <span style={{
                        fontSize: '1rem',
                        color: '#e2e8f0',
                        fontWeight: '400'
                      }}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  
                  <p style={{
                    color: '#e2e8f0',
                    fontSize: '1rem',
                    margin: '0 0 1rem 0'
                  }}>
                    {plan.description}
                  </p>
                  
                  <div style={{
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#00ff88',
                    fontWeight: '600'
                  }}>
                    🌱 {plan.environmental}
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
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      color: '#e2e8f0',
                      fontSize: '0.95rem'
                    }}>
                      <span style={{ color: '#00ff88', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: plan.popular ? 
                      'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' :
                      'transparent',
                    color: plan.popular ? '#0a0a0a' : '#00ff88',
                    border: plan.popular ? 'none' : '1px solid rgba(0, 255, 136, 0.3)',
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
                      if (plan.popular) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
                      } else {
                        e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                        e.target.style.borderColor = '#00ff88';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      if (plan.popular) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      } else {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                      }
                    }
                  }}
                >
                  {loading ? 'Processing...' : plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              Frequently Asked Questions
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  How do you calculate environmental impact?
                </h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                  We track computational resources saved through knowledge sharing, preventing redundant research cycles. Each shared notebook prevents an average of 10 redundant experiments, saving significant computational energy and costs.
                </p>
              </div>

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  Can I upgrade or downgrade anytime?
                </h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at your next billing cycle, and we'll prorate any differences.
                </p>
              </div>

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  What's included in the API access?
                </h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                  Professional plans include 1,000 API calls per month for integrating our notebook discovery into your workflows. Enterprise plans include 10,000 calls plus custom integrations.
                </p>
              </div>

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  Do you offer educational discounts?
                </h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                  Yes! We offer 50% discounts for students and educators. Contact us with your academic email for verification and discount codes.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div style={{
            textAlign: 'center',
            color: '#e2e8f0',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: '0 0 1rem 0' }}>
              ✓ 30-day money-back guarantee • ✓ Cancel anytime • ✓ Secure payment with Stripe
            </p>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Questions? Contact us at support@notebooklm.directory
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}