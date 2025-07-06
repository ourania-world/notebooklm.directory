import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

export default function AuthStatusDisplay() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (loading) {
    // Show placeholder during loading to maintain consistent structure
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ width: '80px', height: '38px' }}></div>
        <div style={{ width: '120px', height: '38px' }}></div>
      </div>
    );
  }

  if (user) {
    return <UserMenu />;
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link href="/login" style={{
        background: 'transparent',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        textDecoration: 'none'
      }}>
        Log in
      </Link>
      <Link href="/signup" style={{
        background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
        color: '#0a0a0a',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3)',
        textDecoration: 'none'
      }}>
        Get Started
      </Link>
    </div>
  );
}