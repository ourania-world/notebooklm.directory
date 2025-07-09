import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { getCurrentUser } from '../../lib/supabase'
import { getUserSubscription } from '../../lib/subscriptions'

export default function SubscriptionSuccess() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function checkSubscription() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/')
          return
        }
        
        setUser(user)

        // Wait a moment for webhook to process
        setTimeout(async () => {
          const userSubscription = await getUserSubscription(user.id)
          setSubscription(userSubscription)
          setLoading(false)
        }, 2000)
      } catch (error) {
        console.error('Error checking subscription:', error)
        setLoading(false)
      }
    }

    checkSubscription()
  }, [router])

  if (loading) {
    return (
      <Layout title="Processing Subscription - NotebookLM Directory">
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>⏳</div>
          <h1 style={{ 
            fontSize: '2rem', 
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Processing Your Subscription
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
            Please wait while we activate your account...
          </p>
          
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 255, 136, 0.3)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '2rem auto'
          }} />
          
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Subscription Activated - NotebookLM Directory">
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎉</div>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#ffffff',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Welcome to <span style={{ color: '#00ff88' }}>Premium</span>!
        </h1>
        
        <p style={{ 
          color: '#e2e8f0', 
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Your subscription has been activated successfully. 
          {user?.email && <span> Thank you for your support, <strong>{user.email}</strong>!</span>}
          You now have access to all premium features!
        </p>

        {subscription && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              color: '#00ff88', 
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Your {subscription.subscription_plans?.name || 'Premium'} Plan Includes:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#ffffff'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Unlimited saved notebooks</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Unlimited notebook submissions</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Access to premium content</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Advanced analytics dashboard</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/browse')}
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Explore Premium Content
          </button>
          
          <button
            onClick={() => router.push('/profile')}
            style={{
              background: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </Layout>
  )
}