import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange } from '../lib/auth';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import SubscriptionModal from './SubscriptionModal';

export default function Layout({ children, title = "NotebookLM Directory" }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  useEffect(() => {
    // Get initial user
    getCurrentUser()
      .then(setUser)
      .catch(error => {
        console.warn('Failed to get user:', error)
        setUser(null)
      })
      .finally(() => setLoading(false));

    // Listen for auth changes
    try {
      const { data: { subscription } } = onAuthStateChange((event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => subscription?.unsubscribe();
    } catch (error) {
      console.warn('Failed to set up auth listener:', error)
      setLoading(false)
    }
  }, []);

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Discover and share innovative NotebookLM projects across domains" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        background: '#0a0a0a',
        color: '#ffffff',
        antialiased: true
      }}>
        <header style={{ 
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
          padding: '1rem 0'
        }}>
          <nav style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              textDecoration: 'none', 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: '#0a0a0a',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '700',
                letterSpacing: '1px',
                fontFamily: 'monospace'
              }}>NLM_D</span>
              NotebookLM Directory
            </Link>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/browse" style={{ 
                color: '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00ff88'}
              onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}>
                Browse Projects
              </Link>
              <Link href="/submit" style={{ 
                color: '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00ff88'}
              onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}>
                Submit Project
              </Link>
              <Link href="/about" style={{ 
                color: '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00ff88'}
              onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}>
                About
              </Link>
              
              {user && (
                <Link href="/analytics" style={{ 
                  color: '#e2e8f0', 
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.color = '#00ff88'}
                onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}>
                  Analytics
                </Link>
              )}
              
              {loading ? (
                <div style={{ color: '#e2e8f0' }}>Loading...</div>
              ) : user ? (
                <UserMenu user={user} onSignOut={() => setUser(null)} />
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => openAuthModal('signin')}
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
                    onClick={() => openAuthModal('signup')}
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
          </nav>
        </header>
        
        <main>
          {children}
        </main>
        
        <footer style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', 
          padding: '3rem 0', 
          marginTop: '4rem',
          borderTop: '1px solid rgba(0, 255, 136, 0.1)'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 2rem',
            textAlign: 'center',
            color: '#e2e8f0'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              © 2024 NotebookLM Directory. Empowering AI-assisted research and creativity.
            </p>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
        mode={authMode}
      />

      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
      />
    </>
  );
}