import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthStatusDisplay from './AuthStatusDisplay';
import SubscriptionBanner from './SubscriptionBanner';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, title = "NotebookLM Directory" }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Discover and share innovative NotebookLM projects across domains" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        background: '#0a0a0a',
        color: '#ffffff'
      }}>
        <SubscriptionBanner />
        
        <header style={{ 
          position: 'sticky',
          top: 0,
          zIndex: 50, 
          background: 'rgba(10, 10, 10, 0.7)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 255, 136, 0.1)', 
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
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
              }}>NLM_D</span>{"notebooklm"}<span style={{ color: '#00ff88' }}>.directory</span>
            </Link>
             
            <div style={{ 
              display: mobileMenuOpen ? 'flex' : 'flex',
              flexDirection: mobileMenuOpen ? 'column' : 'row',
              position: mobileMenuOpen ? 'absolute' : 'static',
              top: mobileMenuOpen ? '100%' : 'auto',
              left: mobileMenuOpen ? '0' : 'auto',
              right: mobileMenuOpen ? '0' : 'auto',
              background: mobileMenuOpen ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
              padding: mobileMenuOpen ? '1rem 2rem' : '0',
              gap: mobileMenuOpen ? '1rem' : '2rem',
              alignItems: 'center',
              zIndex: 40,
              borderBottom: mobileMenuOpen ? '1px solid rgba(0, 255, 136, 0.1)' : 'none'
            }}>
              <Link href="/browse" className="nav-link" style={{ 
                color: router.pathname === '/browse' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}>
                Browse
              </Link>
              <Link href="/submit" className="nav-link" style={{ 
                color: router.pathname === '/submit' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}>
                Submit
              </Link>
              <Link href="/about" className="nav-link" style={{ 
                color: router.pathname === '/about' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}>
                About
              </Link>
              <Link href="/pricing" className="nav-link" style={{ 
                color: router.pathname === '/pricing' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500'
              }}>
                Pricing
              </Link>
              
              {!loading && user && (
                <Link href="/analytics" className="nav-link" style={{ 
                  color: router.pathname === '/analytics' ? '#00ff88' : '#e2e8f0', 
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  fontWeight: '500'
                }}>
                  Analytics
                </Link>
              )}
              
              <AuthStatusDisplay />
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none', // Hide on desktop, show on mobile with media query
                background: 'transparent',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                color: '#00ff88',
                padding: '0.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {mobileMenuOpen ? '×' : '☰'}
            </button>
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
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem', 
              marginBottom: '3rem' 
            }}>
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  notebooklm.directory
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Building the future of AI research through community collaboration and environmental responsibility.
                </p> 
              </div>
              
              <div>
                <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>
                  Quick Links
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/browse" className="footer-link" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Browse Projects
                  </Link>
                  <Link href="/submit" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Submit Project
                  </Link>
                  <Link href="/about" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                    About
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>
                  Community
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/pricing" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Support Us
                  </Link>
                  <Link href="/analytics" className="footer-link" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Analytics
                  </Link>
                  <a 
                    href="mailto:support@notebooklm.directory" 
                    style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}
                  >
                    Contact
                  </a>
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>
                  Environmental Impact
                </h4> 
                <div style={{ 
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.2)', 
                  boxShadow: '0 4px 16px rgba(0, 255, 136, 0.1)',
                  borderRadius: '12px', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  padding: '1rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ color: '#00ff88', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Our Impact Today: 
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.8rem', lineHeight: '1.6' }}>
                    • 47% reduction in redundant research<br />
                    • $3.2M in computational costs saved<br />
                    • 156T CO₂ emissions prevented
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              borderTop: '1px solid rgba(0, 255, 136, 0.1)',
              paddingTop: '2rem',
              display: 'flex',
              justifyContent: 'space-between',  
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem' }}>
                © 2025 notebooklm.directory. Empowering sustainable AI research.
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="#" style={{ color: '#e2e8f0', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Privacy
                </a>
                <a href="#" style={{ color: '#e2e8f0', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Terms
                </a>
                <a href="#" style={{ color: '#e2e8f0', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}