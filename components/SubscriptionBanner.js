import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubscriptionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible && (
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 230, 122, 0.05) 100%)',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
        padding: '0.75rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}></div>
          <div>
            <p style={{ margin: 0, color: '#ffffff', fontSize: '0.9rem' }}>
              <span style={{ color: '#00ff88', fontWeight: '600' }}>Subscribe & Support Our Growth!</span> Help us build the premier platform for NotebookLM projects
            </p>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <button 
              onClick={() => setIsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#e2e8f0',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.25rem'
              }}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    )
  );
}