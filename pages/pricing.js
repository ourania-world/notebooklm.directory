import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'

export default function Pricing() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('standard')

  const plans = [
    {
      id: 'free',
      name: 'Explorer',
      price: 0,
      period: 'forever',
      description: 'Sustainable Discovery for All',
      features: [
        'Access to resource-efficient platform',
        'Browse curated notebook collection',
        'Basic sustainable search features',
        'Community access to responsible research',
        'Save up to 5 notebooks',
        'Mobile-optimized experience'
      ],
      limits: { savedNotebooks: 5, submittedNotebooks: 2, premiumContent: false },
      cta: 'Start Free',
      popular: false,
      environmental: 'Join the sustainable research movement'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 9.99, 
      period: '/month',
      description: 'Enhanced features for serious researchers',
      features: [
        'Everything in Explorer',
        'Save up to 25 notebooks',
        'Submit up to 10 notebooks',
        'Advanced search features',
        'Email notifications',
        'Basic analytics'
      ],
      limits: { savedNotebooks: 25, submittedNotebooks: 10, premiumContent: false },
      cta: 'Upgrade to Standard',
      popular: true,
      environmental: 'Efficient research collaboration'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19.99, 
      period: '/month',
      description: 'Accelerate Your Impact, Measure Your Footprint',
      features: [
        'Everything in Standard',
        'Save unlimited notebooks',
        'Submit up to 25 notebooks',
        'Advanced search & AI recommendations',
        'Personal environmental dashboard',
        'Priority support',
        'API access (1000 calls/month)',
        'Export & integration tools'
      ],
      limits: { savedNotebooks: -1, submittedNotebooks: 25, premiumContent: true },
      cta: 'Upgrade to Professional',
      popular: false,
      environmental: '47% reduction in redundant research'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99, 
      period: '/user/month',
      description: 'Scale Your Innovation, Achieve Your ESG Goals - COMING SOON',
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
      limits: { savedNotebooks: -1, submittedNotebooks: -1, premiumContent: true },
      cta: 'Contact Sales',
      popular: false,
      environmental: 'Institutional carbon footprint tracking'
    }
  ]

  const handlePlanSelect = async (plan) => {
    if (plan.id === 'free') {
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
          priceId: plan.id === 'standard' ? 'price_standard_monthly' : 
                  plan.id === 'professional' ? 'price_professional_monthly' : 
                  'price_enterprise_monthly',
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
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
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
                  if (!plan.popular && plan.id !== 'enterprise') {
                    e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    e.target.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular && plan.id !== 'enterprise') {
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
                    letterSpacing: '0.5px',
                    zIndex: 10
                  }}>
                    Most Popular
                  </div>
                )}

                {plan.id === 'enterprise' && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    zIndex: 10
                  }}>
                    COMING SOON
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
                    <span style={{
                      fontSize: '1rem',
                      color: '#e2e8f0',
                      fontWeight: '400'
                    }}>
                      {plan.period}
                    </span>
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
                  disabled={loading || plan.id === 'enterprise'}
                  style={{
                    width: '100%',
                    background: plan.id === 'enterprise' ? 'rgba(255, 255, 255, 0.1)' : (plan.popular ? 
                      'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' :
                      'transparent'),
                    color: plan.id === 'enterprise' ? '#ffffff' : (plan.popular ? '#0a0a0a' : '#00ff88'),
                    border: plan.id === 'enterprise' || plan.popular ? 'none' : '1px solid rgba(0, 255, 136, 0.3)',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: plan.id === 'enterprise' || loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && plan.id !== 'enterprise') {
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
                    if (!loading && plan.id !== 'enterprise') {
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
                  {loading ? 'Processing...' : (plan.id === 'enterprise' ? 'Coming Soon' : plan.cta)}
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
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at your next billing cycle, and we'll prorate any differences. All plans include a 7-day free trial.
                </p>
              </div>

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  What's included in the API access?
                </h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                  Professional plans include 1,000 API calls per month for integrating our notebook discovery into your workflows. Enterprise plans include unlimited API access plus custom integrations.
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