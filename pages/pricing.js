import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Pricing() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('standard')

  const supportedFeatures = {
    'Access to public notebooks': true,
    'Browse curated collections': true,
    'Basic search features': true,
    'Community access': true,
    'Save up to 5 notebooks': true,
    'Submit unlimited notebooks': true,
    'Everything in Free': true,
    'Everything in Explorer': true,
    'Unlimited saved notebooks': true,
    'Advanced search with filters': true,
    'Email notifications': false,
    'Basic analytics': false,
    'Everything in Standard': true,
    'AI-powered search & recommendations': false,
    'Performance metrics': false,
    'Priority support': false,
    'API access (1000 calls/month)': false,
    'Export & integration tools': false,
    'Team collaboration tools': false,
    'Advanced analytics dashboard': false,
    'Custom reporting': false,
    'White-label options': false,
    'Dedicated account manager': false,
    'API access (10,000 calls/month)': false,
    'Custom integrations': false
  }

  const plans = [
    {
      id: 'free',
      name: 'Explorer',
      price: 0,
      period: 'forever', 
      description: 'Perfect for getting started',
      features: [
        'Access to all public notebooks',
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
        'Advanced search with filters',
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
      window.location.href = user ? '/browse' : '/'
      return
    }

    if (planId === 'enterprise') {
      window.location.href = 'mailto:sales@notebooklm.directory?subject=Enterprise Plan Inquiry'
      return
    }

    if (!user) {
      alert('Please sign up for a free account first, then upgrade')
      return
    }

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
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}>
              Simple, Transparent <span className="neon-text">Pricing</span>
            </h1>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Choose the plan that's right for you. All plans include unlimited notebook submissions.
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
                  background: plan.popular
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)'
                    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  border: plan.popular
                    ? '2px solid #00ff88'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPlan(plan.id)}
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
                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
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
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
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
                      fontSize: '0.95rem',
                      opacity: supportedFeatures[feature] ? 1 : 0.6
                    }}>
                      <span style={{ color: '#00ff88', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <span>{feature}</span>
                        {!supportedFeatures[feature] && feature !== 'Everything in Standard' && (
                          <span style={{ 
                            fontSize: '0.75rem',
                            color: '#ffc107',
                            background: 'rgba(255, 193, 7, 0.1)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            marginLeft: '0.5rem',
                            whiteSpace: 'nowrap'
                          }}>
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || plan.comingSoon}
                  style={{
                    width: '100%',
                    background: plan.comingSoon
                      ? 'rgba(255, 255, 255, 0.1)'
                      : (plan.popular
                        ? 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)'
                        : 'transparent'),
                    color: plan.comingSoon
                      ? '#ffffff'
                      : (plan.popular ? '#0a0a0a' : '#00ff88'),
                    border: plan.comingSoon || plan.popular
                      ? 'none'
                      : '1px solid rgba(0, 255, 136, 0.3)',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: plan.comingSoon || loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {loading ? 'Processing...' : (plan.comingSoon ? 'Coming Soon' : plan.cta)}
                </button>
              </div>
            ))}
          </div>

          {/* You can continue the rest of the component below this line with your FAQ + Trust signals if needed */}
        </div>
      </div>
    </Layout>
  )
}
