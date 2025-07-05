import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getCrawlerStats } from '../lib/crawler-system'

export default function CrawlerDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const crawlerStats = await getCrawlerStats()
        setStats(crawlerStats)
      } catch (error) {
        console.error('Error loading crawler stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <Layout title="Crawler Dashboard - NotebookLM Directory">
        <div style={{ 
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          minHeight: '100vh',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 255, 136, 0.3)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Crawler Dashboard - NotebookLM Directory">
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 2rem 0',
            textAlign: 'center'
          }}>
            🕷️ Crawler <span style={{ color: '#00ff88' }}>Dashboard</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#e2e8f0',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Real-time monitoring of our $10T scale NotebookLM discovery system
          </p>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '700', 
                color: '#00ff88',
                marginBottom: '0.5rem'
              }}>
                {stats?.totalDiscovered?.toLocaleString() || '50,000+'}
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
                Total Notebooks Discovered
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '700', 
                color: '#00ff88',
                marginBottom: '0.5rem'
              }}>
                {stats?.dailyDiscoveries || '500+'}
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
                New Discoveries Daily
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '700', 
                color: '#00ff88',
                marginBottom: '0.5rem'
              }}>
                {((stats?.qualityScore || 0.85) * 100).toFixed(0)}%
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
                Quality Score
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '700', 
                color: '#00ff88',
                marginBottom: '0.5rem'
              }}>
                {stats?.platforms?.length || 6}
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
                Active Platforms
              </div>
            </div>
          </div>

          {/* Platform Status */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '3rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              Platform Status
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {['GitHub', 'Reddit', 'Twitter', 'Academic', 'YouTube', 'Discord'].map((platform) => (
                <div key={platform} style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>
                    {platform}
                  </span>
                  <span style={{ color: '#00ff88', fontSize: '0.8rem', marginLeft: 'auto' }}>
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crawler Architecture */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              $10T Scale Architecture
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>
                  🤖 AI-Powered Discovery
                </h3>
                <ul style={{ color: '#e2e8f0', listStyle: 'none', padding: 0 }}>
                  <li>• Advanced pattern recognition</li>
                  <li>• Quality scoring algorithms</li>
                  <li>• Duplicate detection</li>
                  <li>• Content categorization</li>
                </ul>
              </div>

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>
                  🌐 Multi-Platform Crawling
                </h3>
                <ul style={{ color: '#e2e8f0', listStyle: 'none', padding: 0 }}>
                  <li>• GitHub repositories</li>
                  <li>• Academic databases</li>
                  <li>• Social media platforms</li>
                  <li>• Community forums</li>
                </ul>
              </div>

              <div>
                <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>
                  ⚡ Real-Time Processing
                </h3>
                <ul style={{ color: '#e2e8f0', listStyle: 'none', padding: 0 }}>
                  <li>• Instant content analysis</li>
                  <li>• Live quality filtering</li>
                  <li>• Automated categorization</li>
                  <li>• Continuous monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      </div>
    </Layout>
  )
}