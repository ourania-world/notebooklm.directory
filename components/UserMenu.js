import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR or loading to prevent hydration mismatch
  if (!mounted || loading) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSignOutLoading(false);
    }
  };

  if (!user) {
    return (
      <div>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          Log in
        </button>
      </div>
    );
  }
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.2s ease',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 255, 136, 0.2)';
          e.target.style.borderColor = '#00ff88';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 255, 136, 0.1)';
          e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
          color: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          fontWeight: '700'
        }}>
          {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span style={{ fontSize: '0.9rem' }}>
          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
        </span>
        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            minWidth: '220px',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            <div style={{ padding: '0.5rem 0' }}>
              <button
                onClick={() => {
                  window.location.href = '/profile';
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                  e.target.style.color = '#00ff88';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#ffffff';
                }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => {
                  window.location.href = '/my-notebooks';
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                  e.target.style.color = '#00ff88';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#ffffff';
                }}
              >
                📚 My Notebooks
              </button>
              <button
                onClick={() => {
                  window.location.href = '/saved';
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                  e.target.style.color = '#00ff88';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#ffffff';
                }}
              >
                💾 Saved
              </button>
              <hr style={{ 
                margin: '0.5rem 0', 
                border: 'none', 
                borderTop: '1px solid rgba(0, 255, 136, 0.2)' 
              }} />
              <button
                onClick={handleSignOut}
                disabled={signOutLoading}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  cursor: signOutLoading ? 'wait' : 'pointer',
                  color: '#dc3545',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  if (!signOutLoading) {
                    e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                }}
              >
                {signOutLoading ? '⏳ Signing Out...' : '🚪 Sign Out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}