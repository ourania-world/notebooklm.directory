export default function TestEnhancedDashboard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      <div>
        <h1>🚀 Enhanced Dashboard Test Page</h1>
        <p>If you can see this, routing is working!</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
} 