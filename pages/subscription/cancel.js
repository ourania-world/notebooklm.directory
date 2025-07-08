import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

export default function SubscriptionCancel() {
  const router = useRouter()

  return (
    <Layout title="Subscription Cancelled - NotebookLM Directory">
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>😔</div>
        
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#ffffff',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Subscription Cancelled
        </h1>
        
        <p style={{ 
          color: '#e2e8f0', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          No worries! Your subscription wasn't processed. You can still enjoy our free features or try upgrading again anytime.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            color: '#ffffff', 
            fontSize: '1.2rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            You Still Have Access To:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#e2e8f0'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>✓ Browse public notebooks</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Save up to 5 notebooks</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Submit unlimited notebooks</li>
            <li>✓ Community access</li>
          </ul>
        </div>

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
            Continue Browsing
          </button>
          
          <button
            onClick={() => router.push('/')}
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
            Back to Home
          </button>
        </div>
      </div>
    </Layout>
  )
}