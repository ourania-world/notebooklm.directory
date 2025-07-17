export default function TestAll() {
  const dashboards = [
    {
      name: 'Debug Dashboard',
      url: '/debug-dashboard',
      description: 'Basic test - checks if React/Next.js is working',
      status: '🟢 Should work'
    },
    {
      name: 'Minimal Enhanced',
      url: '/enhanced-minimal', 
      description: 'Core functionality without Layout wrapper',
      status: '🟢 Should work'
    },
    {
      name: 'Simple Test',
      url: '/test-enhanced-simple',
      description: 'Basic version with Layout component',
      status: '🟡 Testing Layout'
    },
    {
      name: 'API Test Dashboard',
      url: '/test-apis',
      description: 'Test all API endpoints',
      status: '🟢 Should work'
    },
    {
      name: 'Enhanced Scraping Dashboard',
      url: '/enhanced-scraping-dashboard',
      description: 'Full featured dashboard - main target',
      status: '🔴 Issue found'
    }
  ];

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#00ff88',
            marginBottom: '1rem'
          }}>
            Dashboard Test Suite
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
            Testing all dashboard versions to identify the loading issue
          </p>
        </div>

        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          {dashboards.map((dashboard, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: '#ffffff',
                    marginBottom: '0.5rem'
                  }}>
                    {dashboard.name}
                  </h3>
                  <p style={{
                    color: '#e2e8f0',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {dashboard.description}
                  </p>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  {dashboard.status}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <a
                  href={dashboard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    background: '#00ff88',
                    color: '#000',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#00e67a';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#00ff88';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Open Dashboard
                </a>
                
                <code style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#00ff88',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}>
                  {dashboard.url}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Debugging Steps
          </h2>
          <ol style={{
            color: '#e2e8f0',
            textAlign: 'left',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <li>Start with <strong>Debug Dashboard</strong> - should load immediately</li>
            <li>Try <strong>Minimal Enhanced</strong> - tests core functionality</li>
            <li>Test <strong>API Test Dashboard</strong> - verifies backend</li>
            <li>Finally try <strong>Enhanced Scraping Dashboard</strong></li>
            <li>Check browser console (F12) for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}