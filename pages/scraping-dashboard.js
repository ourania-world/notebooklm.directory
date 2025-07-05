import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { spiderScrapers, runMassiveDiscovery, getScrapingStats } from '../lib/spider-scrapers'

export default function ScrapingDashboard() {
  const [operations, setOperations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('GITHUB')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const scrapingStats = await getScrapingStats()
      setStats(scrapingStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSingleScrape = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const operation = await spiderScrapers.startScraping(selectedSource, query, 20)
      setOperations(prev => [operation, ...prev])
      setQuery('')
      
      // Monitor operation progress
      monitorOperation(operation.operationId)
    } catch (error) {
      console.error('Error starting scrape:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMassiveScrape = async () => {
    setLoading(true)
    try {
      const allOperations = await runMassiveDiscovery()
      
      // Flatten operations for display
      const flatOperations = allOperations.flatMap(({ query, operations }) =>
        operations.map(op => ({ ...op, searchQuery: query }))
      )
      
      setOperations(prev => [...flatOperations, ...prev])
      
      // Monitor all operations
      flatOperations.forEach(op => {
        if (op.operation?.operationId) {
          monitorOperation(op.operation.operationId)
        }
      })
    } catch (error) {
      console.error('Error starting massive scrape:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const monitorOperation = async (operationId) => {
    try {
      const { status, results } = await spiderScrapers.waitForCompletion(operationId)
      
      // Update operation in state
      setOperations(prev => prev.map(op => 
        op.operation?.operationId === operationId 
          ? { ...op, status, results }
          : op
      ))
      
      // Refresh stats
      loadStats()
    } catch (error) {
      console.error(`Error monitoring operation ${operationId}:`, error)
    }
  }

  return (
    <Layout title="Scraping Dashboard - NotebookLM Directory">
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
            🕷️ Spider-Scrapers <span style={{ color: '#00ff88' }}>Dashboard</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#e2e8f0',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Massive NotebookLM discovery across GitHub, Reddit, Twitter, Academic sources, and YouTube
          </p>

          {/* Stats Section */}
          {stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  {stats.total_operations || 0}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Operations</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  {stats.total_items_found || 0}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Items Discovered</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  {stats.avg_quality_score || '0.0'}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Avg Quality Score</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ff88' }}>
                  {stats.running_operations || 0}
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Running Now</div>
              </div>
            </div>
          )}

          {/* Control Panel */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '3rem'
          }}>
            <h2 style={{ color: '#ffffff', marginBottom: '1.5rem' }}>
              Launch Discovery Operations
            </h2>

            {/* Single Scrape */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Single Source Scrape</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    minWidth: '120px'
                  }}
                >
                  <option value="GITHUB">GitHub</option>
                  <option value="REDDIT">Reddit</option>
                  <option value="TWITTER">Twitter</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="YOUTUBE">YouTube</option>
                </select>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter search query..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    minWidth: '200px'
                  }}
                />

                <button
                  onClick={handleSingleScrape}
                  disabled={loading || !query.trim()}
                  style={{
                    background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    color: loading ? '#ffffff' : '#0a0a0a',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Starting...' : 'Start Scrape'}
                </button>
              </div>
            </div>

            {/* Massive Scrape */}
            <div>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Massive Discovery</h3>
              <p style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Launch comprehensive discovery across all platforms with predefined high-value queries
              </p>
              <button
                onClick={handleMassiveScrape}
                disabled={loading}
                style={{
                  background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {loading ? '🚀 Launching...' : '🚀 Launch Massive Discovery'}
              </button>
            </div>
          </div>

          {/* Operations List */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h2 style={{ color: '#ffffff', marginBottom: '1.5rem' }}>
              Recent Operations
            </h2>

            {operations.length === 0 ? (
              <p style={{ color: '#e2e8f0', textAlign: 'center', padding: '2rem' }}>
                No operations yet. Start your first discovery above!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {operations.slice(0, 10).map((op, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: '600' }}>
                          {op.source} • {op.searchQuery || 'Custom Query'}
                        </div>
                        <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                          Operation ID: {op.operation?.operationId || 'N/A'}
                        </div>
                      </div>
                      <div style={{
                        background: op.status?.status === 'completed' ? '#00ff88' :
                                   op.status?.status === 'failed' ? '#ff6b6b' :
                                   op.status?.status === 'running' ? '#ffc107' : '#6c757d',
                        color: '#0a0a0a',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {op.status?.status || op.operation?.status || 'Started'}
                      </div>
                    </div>
                    
                    {op.results && (
                      <div style={{ marginTop: '0.5rem', color: '#00ff88', fontSize: '0.9rem' }}>
                        Found {op.results.items?.length || 0} items
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}