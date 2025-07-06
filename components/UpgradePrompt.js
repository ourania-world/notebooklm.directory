import { useState } from 'react'
import SubscriptionModal from './SubscriptionModal'

export default function UpgradePrompt({ 
  feature, 
  currentPlan = 'free',
  requiredPlan = 'basic',
  onClose 
}) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  const planNames = {
    free: 'Free',
    basic: 'Basic',
    premium: 'Premium'
  }

  const featureMessages = {
    savedNotebooks: 'You\'ve reached your saved notebooks limit',
    submittedNotebooks: 'You\'ve reached your submission limit',
    premiumContent: 'This is premium content',
    advancedSearch: 'Advanced search requires an upgrade',
    analytics: 'Analytics dashboard requires an upgrade'
  }

  return (
    <>
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
          maxWidth: '500px',
          width: '100%',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            🚀
          </div>

          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 1rem 0'
          }}>
            Upgrade to <span style={{ color: '#00ff88' }}>{planNames[requiredPlan]}</span>
          </h2>

          <p style={{
            color: '#e2e8f0',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            margin: '0 0 2rem 0'
          }}>
            {featureMessages[feature] || 'This feature requires an upgrade'}
          </p>

          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              color: '#00ff88',
              fontSize: '1.2rem',
              fontWeight: '600',
              margin: '0 0 1rem 0'
            }}>
              Unlock with {planNames[requiredPlan]}:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#ffffff'
            }}>
              {requiredPlan === 'basic' && (
                <>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Save unlimited notebooks</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Submit up to 10 notebooks</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Advanced search & filters</li>
                  <li>✓ Priority support</li>
                </>
              )}
              {requiredPlan === 'premium' && (
                <>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Access premium content</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Unlimited submissions</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Analytics dashboard</li>
                  <li>✓ API access</li>
                </>
              )}
            </ul>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500',
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
              Maybe Later
            </button>
            
            <button
              onClick={() => setShowSubscriptionModal(true)}
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: '#0a0a0a',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false)
          onClose()
        }}
        currentPlan={currentPlan}
      />
    </>
  )
}