import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Link from 'next/link';

export default function UserMenu() {
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR or loading to prevent hydration mismatch
  if (!mounted) {
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

  if (loading) {
    return null;
  }

  if (!user) {
    return null; // Login button is now in Layout.js
  }

  if (loading) {
    return null;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR or loading to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div>
      {isOpen && (
        <>
          <div style={{
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