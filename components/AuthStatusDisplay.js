import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from './UserMenu';

export default function AuthStatusDisplay() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run this on the client side
    async function checkAuth() {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <div className="auth-display-container">
      {loading ? (
        // Show placeholder during loading to maintain consistent structure
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: '80px', height: '38px' }}></div>
          <div style={{ width: '120px', height: '38px' }}></div>
        </div>
      ) : user ? (
        <UserMenu user={user} />
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              background: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
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
            Log in
          </button>
          <button
            onClick={() => window.location.href = '/signup'}
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 255, 136, 0.3)';
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}