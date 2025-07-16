import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getCurrentUser } from '../utils/yourHelpers';

export default function PaymentSuccess() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }
        
        setUser(currentUser);
        
        // Fetch subscription status
        const response = await fetch('/api/subscription-status');
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Layout title="Payment Successful - NotebookLM Directory">
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
            Processing Your Payment
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
    );
  }

  return (
    <Layout title="Payment Successful - NotebookLM Directory">
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
          Your payment was successful! You now have access to all premium features.
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
              Your {subscription.plan?.name || 'Premium'} Plan Includes:
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
  );
}