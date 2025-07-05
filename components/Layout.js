import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserMenu from './UserMenu';

export default function Layout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff' }}>
      {/* Navigation Header */}
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
          alignItems: 'center',
          justifyContent: 'space-between'
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

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            '@media (max-width: 768px)': {
              display: mobileMenuOpen ? 'flex' : 'none',
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(10, 10, 10, 0.98)',
              flexDirection: 'column',
              padding: '2rem',
              borderTop: '1px solid rgba(0, 255, 136, 0.1)'
            }
          }}>
            <Link href="/browse" style={{
              color: router.pathname === '/browse' ? '#00ff88' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              Browse
            </Link>
            <Link href="/submit" style={{
              color: router.pathname === '/submit' ? '#00ff88' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              Submit
            </Link>
            <Link href="/about" style={{
              color: router.pathname === '/about' ? '#00ff88' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              About
            </Link>
            <Link href="/pricing" style={{
              color: router.pathname === '/pricing' ? '#00ff88' : '#e2e8f0',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              Pricing
            </Link>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              '@media (max-width: 768px)': {
                display: 'block'
              },
              background: 'transparent',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              color: '#00ff88',
              padding: '0.5rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(26, 26, 46, 0.8)',
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
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>NotebookLM Directory</h3>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                Building the future of AI research through community collaboration.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/browse" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Browse</Link>
                <Link href="/submit" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Submit</Link>
                <Link href="/about" style={{ color: '#e2e8f0', textDecoration: 'none' }}>About</Link>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Community</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/pricing" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Support Us</Link>
                <Link href="/analytics" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Analytics</Link>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(0, 255, 136, 0.1)',
            paddingTop: '2rem',
            color: '#e2e8f0',
            fontSize: '0.9rem'
          }}>
            <p>&copy; 2025 NotebookLM Directory. Building sustainable AI research.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}