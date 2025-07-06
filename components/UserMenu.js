import { useState, useEffect } from 'react';
export default function UserMenu({ user }) {
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      const { supabase } = await import('../lib/supabase');
      await supabase.auth.signOut();
      setIsOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSignOutLoading(false);
    }
  };
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
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
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
                  gap: '0.75rem',
                  textDecoration: 'none'
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
              </Link>
              <Link
                href="/my-notebooks"
                onClick={() => setIsOpen(false)}
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
                  gap: '0.75rem',
                  textDecoration: 'none'
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
              </Link>
              <Link
                href="/saved"
                onClick={() => setIsOpen(false)}
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
                  gap: '0.75rem',
                  textDecoration: 'none'
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
              </Link>
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