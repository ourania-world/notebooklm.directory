import { useState, useEffect } from 'react';

export default function SubscriptionBanner() {
  const [shouldShow, setShouldShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkSubscriptionStatus = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user has a subscription
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select(`
              *,
              subscription_plans (*)
            `)
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .single();
          
          // Show banner if user is logged in but doesn't have a premium subscription
          setShouldShow(session.user && (!subscription || 
            (subscription?.subscription_plans?.id !== 'professional' && 
             subscription?.subscription_plans?.id !== 'enterprise')));
        } else {
          setShouldShow(true); // Show banner for unauthenticated users
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setShouldShow(false);
      }
    };

    // Add a small delay to prevent hydration mismatch
    setTimeout(() => {
      checkSubscriptionStatus();
    }, 100);
  }, []);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Always render a container div to maintain consistent structure
  // but only show content when shouldShow is true
  return (
    <div style={{ display: shouldShow ? 'block' : 'none' }}>
      {shouldShow && (
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
                Upgrade to <strong>Standard</strong> for unlimited saved notebooks and advanced features
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
      )}
    </div>
  );
}