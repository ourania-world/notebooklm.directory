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
    getCurrentUser().then(setUser).finally(() => setLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <header style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
              color: 'white' 
            }}>
              📘 NotebookLM Directory
            </Link>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/browse" style={{ color: 'white', textDecoration: 'none' }}>
                Browse Projects
              </Link>
              <Link href="/submit" style={{ color: 'white', textDecoration: 'none' }}>
                Submit Project
              </Link>
              <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>
                About
              </Link>
              
              {loading ? (
                <div style={{ color: 'white' }}>Loading...</div>
              ) : user ? (
                <UserMenu user={user} onSignOut={() => setUser(null)} />
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => openAuthModal('signin')}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    style={{
                      background: 'white',
                      color: '#667eea',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
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
          background: '#f8f9fa', 
          padding: '2rem 0', 
          marginTop: '4rem',
          borderTop: '1px solid #e9ecef'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 2rem',
            textAlign: 'center',
            color: '#6c757d'
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