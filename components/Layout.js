import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, signOut } from '../lib/auth';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff' }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            textDecoration: 'none',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            <span style={{ color: '#00ff88' }}>notebook</span>lm.directory
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <Link href="/browse" style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              Browse
            </Link>
            
            <Link href="/about" style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              About
            </Link>

            {/* User Menu or Auth Button */}
            {loading ? (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '2px solid rgba(0, 255, 136, 0.3)',
                animation: 'pulse 2s infinite'
              }} />
            ) : user ? (
              <UserMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
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
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(26, 26, 46, 0.5)',
        borderTop: '1px solid rgba(0, 255, 136, 0.1)',
        padding: '3rem 0',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{
                color: '#00ff88',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Platform
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/browse" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Browse Notebooks
                </Link>
                <Link href="/submit" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Submit Project
                </Link>
                <Link href="/pricing" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Pricing
                </Link>
              </div>
            </div>
            
            <div>
              <h3 style={{
                color: '#00ff88',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Community
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/about" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                  About
                </Link>
                <a href="mailto:hello@notebooklm.directory" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Contact
                </a>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(0, 255, 136, 0.1)',
            paddingTop: '2rem',
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: 0 }}>
              © 2025 notebooklm.directory - Building the future of AI research discovery
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setUser(user);
          setShowAuthModal(false);
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}