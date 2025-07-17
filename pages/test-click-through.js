import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function TestClickThrough() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <div style={{ 
        padding: '2rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          color: '#00ff88'
        }}>
          🎉 CLICK-THROUGH TEST SUCCESS!
        </h1>
        
        <div style={{ 
          background: 'rgba(0, 255, 136, 0.1)',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.3)'
        }}>
          <h2 style={{ color: '#00ff88', marginBottom: '1rem' }}>
            ✅ HORIZONTAL VICTORY CONFIRMED
          </h2>
          <p style={{ 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            If you can see this page, the click-through functionality is working! 
            This means users can now discover content AND read the full details.
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1.5rem'
          }}>
            <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>
              🎵 Complete User Journey:
            </h3>
            <p style={{ marginBottom: '0.5rem' }}>✅ User discovers content on browse page</p>
            <p style={{ marginBottom: '0.5rem' }}>✅ User clicks on interesting content</p>
            <p style={{ marginBottom: '0.5rem' }}>✅ User lands on detail page (this page!)</p>
            <p style={{ marginBottom: '0.5rem' }}>✅ User reads full content and gets value</p>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/browse'}
          style={{
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            color: '#000',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Back to Browse (Test Complete!)
        </button>
      </div>
    </Layout>
  );
}