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
          marginBottom: '