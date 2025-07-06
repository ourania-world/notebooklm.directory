import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

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
      description: 'Perfect for getting started',
      features: [
        'Access to public notebooks',
        'Browse curated collections',
        'Basic search features',
        'Community access',
        'Save up to 5 notebooks',
        'Submit unlimited notebooks'
      ],
      limits: {
        savedNotebooks: 5,
        submittedNotebooks: -1,
        premiumContent: false
      },
      cta: 'Start Free',
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 9.99,
      period: 'month',
      description: 'Great for regular users',
      features: [
        'Everything in Explorer',
        'Unlimited saved notebooks',
        'Submit unlimited notebooks',
        'Advanced search features',
        'Email notifications',
        'Basic analytics'
      ],
      limits: {
        savedNotebooks: -1,
        submittedNotebooks: -1,
        premiumContent: false
      },
      cta: 'Upgrade to Standard',
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19.99,
      period: 'month',
      description: 'For power users and professionals',
      features: [
        'Everything in Standard',
        'Unlimited saved notebooks',
        'Submit unlimited notebooks',
        'AI-powered search & recommendations',
        'Performance metrics',
        'Priority support',
        'API access (1000 calls/month)',
        'Export & integration tools'
      ],
      limits: {
        savedNotebooks: -1,
        submittedNotebooks: -1,
        premiumContent: true
      },
      cta: 'Upgrade to Pro',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'user/month',
      description: 'For teams & organizations',
      features: [
        'Everything in Professional',
        'Team collaboration tools',
        'Advanced analytics dashboard',
        'Custom reporting',
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
      comingSoon: true
    }
  ]

  const handleUpgrade = async (planId) => {
    if (planId === 'free') {
      // Free plan - just redirect to signup
      window.location.href = user ? '/browse' : '/'
      return
    }

    if (planId === 'enterprise') {
      // Enterprise - contact sales
      window.location.href = 'mailto:sales@notebooklm.directory?subject=Enterprise Plan Inquiry'
      return
    }

    if (!user) {
      // Need to sign up first
      alert('Please sign up for a free account first, then upgrade')
      return
    }

    // Redirect to payment page with plan parameter
    window.location.href = `/payment?plan=${planId}`
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
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}>
              Simple, Transparent <span style={{ color: '#00ff88' }}>Pricing</span>
            </h1>
            
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.1rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Choose the plan that's right for you. All plans include a 7-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                  if (!plan.popular && !plan.comingSoon) {
                    e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    e.target.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular && !plan.comingSoon) {
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
                
                {plan.comingSoon && (
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
                    letterSpacing: '0.5px'
                  }}>
                    Coming Soon
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
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || plan.comingSoon}
                  style={{
                    width: '100%',
                    background: plan.comingSoon ? 'rgba(255, 255, 255, 0.1)' : (plan.popular ? 
                      'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' :
                      'transparent'),
                    color: plan.comingSoon ? '#ffffff' : (plan.popular ? '#0a0a0a' : '#00ff88'),
                    border: plan.comingSoon || plan.popular ? 'none' : '1px solid rgba(0, 255, 136, 0.3)',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: plan.comingSoon || loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !plan.comingSoon) {
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
                    if (!loading && !plan.comingSoon) {
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
                  {loading ? 'Processing...' : (plan.comingSoon ? 'Coming Soon' : plan.cta)}
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

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  What payment methods do you accept?
                </h3>
                <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe. For Enterprise plans, we also offer invoicing.
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
              ✓ 7-day free trial • ✓ Cancel anytime • ✓ Secure payment with Stripe
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