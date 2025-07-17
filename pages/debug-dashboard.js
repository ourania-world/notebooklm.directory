import { useState, useEffect } from 'react';

export default function DebugDashboard() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('initializing');

  useEffect(() => {
    console.log('🔧 DEBUG: Component mounting...');
    setStep('mounting');
    
    setTimeout(() => {
      setStep('checking-auth');
      console.log('🔧 DEBUG: Checking auth...');
      
      setTimeout(() => {
        setStep('loading-data');
        console.log('🔧 DEBUG: Loading data...');
        
        setTimeout(() => {
          setStep('complete');
          setMounted(true);
          console.log('🔧 DEBUG: Complete - should render now');
        }, 500);
      }, 500);
    }, 500);
  }, []);

  console.log('🎨 DEBUG: Rendering, step:', step, 'mounted:', mounted);

  // Show step-by-step loading
  if (!mounted) {
    return (
      <div style={{
        background: '#0a0a0a',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'monospace'
      }}>
        <h1 style={{ color: '#00ff88' }}>Debug Dashboard</h1>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <p>Loading Step: <strong style={{ color: '#00ff88' }}>{step}</strong></p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '1rem'
          }}>
            <div style={{
              width: step === 'initializing' ? '25%' : 
                     step === 'mounting' ? '50%' : 
                     step === 'checking-auth' ? '75%' : '100%',
              height: '100%',
              background: '#00ff88',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>
    );
  }

  // Main content when loaded
  return (
    <div style={{
      background: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#00ff88',
          marginBottom: '2rem'
        }}>
          ✅ Debug Dashboard - Working!
        </h1>
        
        <div style={{
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>
            Status Check ✅
          </h2>
          <ul style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
            <li>✅ Component mounted successfully</li>
            <li>✅ State management working</li>
            <li>✅ Styles rendering correctly</li>
            <li>✅ No JavaScript errors</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>
            Next: Test Enhanced Dashboard
          </h3>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
            If you can see this page, the basic React/Next.js setup is working.
            The issue might be in the enhanced dashboard's specific components.
          </p>
          <a 
            href="/enhanced-scraping-dashboard"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: '#00ff88',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Try Enhanced Dashboard Again
          </a>
        </div>
      </div>
    </div>
  );
}