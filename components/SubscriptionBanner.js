import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionBanner() {
  const { user, loading } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    setMounted(true);
    
    if (!user) {
      setSubLoading(false);
      return;
    }

    async function fetchSubscription() {
      try {
        setSubLoading(true);
        // Simple simulation - in production, you would fetch from your API
        setTimeout(() => {
        }
        )
      }
      // Simulate subscription check - in production, fetch from your API
      setSubLoading(true);
      setTimeout(() => {
        setSubscription({ plan: { id: 'free' } });
        setSubLoading(false);
      }, 100);
    }

    fetchSubscription();
  }, [user]);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (loading || subLoading || !user || (subscription?.plan?.id === 'professional' || subscription?.plan?.id === 'enterprise' || subscription?.plan?.id === 'standard')) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.2) 100%)',
      borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
      padding: '0.75rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#00ff88', fontSize: '1.2rem' }}>✨</span>
          <p style={{ margin: 0, color: '#ffffff', fontSize: '0.9rem' }}>
            Upgrade to <strong>Professional</strong> for unlimited notebooks and premium features
          </p>
        </div>
        
        <button
          onClick={() => window.location.href = '/pricing'}
          style={{
            background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
            color: '#0a0a0a',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}