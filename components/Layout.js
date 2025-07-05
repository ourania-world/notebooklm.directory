import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange } from '../lib/auth';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

export default function Layout({ children, title = "NotebookLM Directory" }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

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
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0a0e1a',
        color: '#ffffff'
      }}>
        <header style={{ 
          background: 'linear-gradient(135deg, #1a2332 0%, #0a0e1a 100%)',
          color: 'white',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          borderBottom: '1px solid #2a3441'
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
              fontWeight: 'bold', 
              textDecoration: 'none', 
              color: '#00ff88',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ 
                background: '#00ff88',
                color: '#0a0e1a',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '1rem'
              }}>NLM</span>
              NotebookLM Directory
            </Link>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/browse" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00ff88'}
              onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>
                Browse Projects
              </Link>
              <Link href="/submit" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00ff88'}
              onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>
                Submit Project
              </Link>
              <Link href="/about" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00ff88'}
              onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>
                About
              </Link>
              
              {loading ? (
                <div style={{ color: '#a0aec0' }}>Loading...</div>
              ) : user ? (
                <UserMenu user={user} onSignOut={() => setUser(null)} />
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => openAuthModal('signin')}
                    style={{
                      background: 'transparent',
                      color: '#a0aec0',
                      border: '1px solid #2a3441',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#00ff88';
                      e.target.style.color = '#00ff88';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#2a3441';
                      e.target.style.color = '#a0aec0';
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    style={{
                      background: '#00ff88',
                      color: '#0a0e1a',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#00e67a'}
                    onMouseLeave={(e) => e.target.style.background = '#00ff88'}
                  >
                    Sign Up
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
          background: '#1a2332', 
          padding: '2rem 0', 
          marginTop: '4rem',
          borderTop: '1px solid #2a3441'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 2rem',
            textAlign: 'center',
            color: '#a0aec0'
          }}>
            <p>© 2024 NotebookLM Directory. Empowering AI-assisted research and creativity.</p>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}