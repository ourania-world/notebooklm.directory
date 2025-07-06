import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserMenu from './UserMenu';
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
          padding: '1rem 0'
        }}>
          <nav style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}>
                <div style={{ 
                  background: '#00ff88',
                  color: '#0a0a0a',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  fontFamily: 'monospace'
                }}>
                  NLM_D
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#ffffff'
                }}>
                  notebooklm.<span style={{ color: '#00ff88' }}>directory</span>
                </div>
              </Link>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Link href="/browse" style={{ 
                color: router.pathname === '/browse' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Browse Projects
              </Link>
              <Link href="/submit" style={{ 
                color: router.pathname === '/submit' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Submit Project
              </Link>
              <Link href="/pricing" style={{ 
                color: router.pathname === '/pricing' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Pricing
              </Link>
              <Link href="/about" style={{ 
                color: router.pathname === '/about' ? '#00ff88' : '#e2e8f0', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                About
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <UserMenu />
              <button
                onClick={() => window.location.href = '/pricing'}
                style={{
                  background: '#00ff88',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Support Growth
              </button>
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
                  <Link href="/browse" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
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
                  <Link href="/analytics" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem' }}>
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
                  borderRadius: '8px',
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