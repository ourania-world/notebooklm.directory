import { useState } from 'react'
import Layout from '../components/Layout'
import SubscriptionModal from '../components/SubscriptionModal'

export default function Pricing() {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('premium')

  const plans = [
    {
      id: 'free',
      name: 'Explorer',
      price: 0,
      period: 'Forever Free',
      description: 'Perfect for getting started with NotebookLM discovery',
      features: [
        'Browse 50,000+ public notebooks',
        'Basic search and filtering',
        'Save up to 10 notebooks',
        'Community access',
        'Mobile app access'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      id: 'premium',
      name: 'Professional',
      price: 29,
      period: 'per month',
      description: 'For researchers and professionals who need advanced features',
      features: [
        'Everything in Explorer',
        'Unlimited saved notebooks',
        'Advanced AI-powered search',
        'Premium notebook collections',
        'Priority customer support',
        'API access (10k requests/month)',
        'Export to multiple formats',
        'Custom tags and organization'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'per month',
      description: 'For teams and organizations scaling AI research',
      features: [
        'Everything in Professional',
        'Team collaboration tools',
        'Unlimited API access',
        'Custom integrations',
        'Dedicated account manager',
        'SSO and advanced security',
        'Custom crawler configurations',
        'White-label options'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  const handlePlanSelect = (planId) => {
    if (planId === 'free') {
      window.location.href = '/browse'
    } else if (planId === 'enterprise') {
      window.location.href = 'mailto:enterprise@notebooklm-directory.com'
    } else {
      setSelectedPlan(planId)
      setSubscriptionModalOpen(true)
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
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}>
              Choose Your <span style={{ color: '#00ff88' }}>Plan</span>
            </h1>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#e2e8f0',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Join thousands of researchers, students, and professionals discovering the power of AI-assisted research
            </p>
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
                  border: plan.popular ? 
                    '2px solid #00ff88' : 
                    '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                    e.target.style.transform = 'translateY(-8px)';
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
                    fontSize: '0.9rem',
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
                    {plan.period !== 'Forever Free' && (
                      <span style={{
                        fontSize: '1rem',
                        color: '#e2e8f0',
                        fontWeight: '400'
                      }}>
                        /{plan.period.split(' ')[1]}
                      </span>
                    )}
                  </div>
                  <p style={{
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    margin: 0
                  }}>
                    {plan.period}
                  </p>
                </div>

                <p style={{
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  {plan.description}
                </p>

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

                <button
                  onClick={() => handlePlanSelect(plan.id)}
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
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.popular) {
                      e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                    } else {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.popular) {
                      e.target.style.background = 'transparent';
                    } else {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  How does the crawler work?
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Our AI-powered crawlers continuously scan GitHub, academic repositories, and public NotebookLM shares to discover new projects. We add thousands of notebooks daily.
                </p>
              </div>
              
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  Can I cancel anytime?
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Yes! Cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  What's included in API access?
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Full REST API access to search, filter, and retrieve notebook metadata. Perfect for building integrations or custom applications.
                </p>
              </div>
              
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>
                  Do you offer team discounts?
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Yes! Contact our sales team for volume discounts on 5+ seats. Enterprise plans include team collaboration features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
      />
    </Layout>
  )
}