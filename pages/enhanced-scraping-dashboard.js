import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { spiderScrapers, runMassiveDiscovery, getScrapingStats } from '../lib/spider-scrapers'
import { contentDiscovery } from '../lib/content-discovery.js'
import { recommendationEngine } from '../lib/recommendation-engine.js'

export default function EnhancedScrapingDashboard() {
  const [operations, setOperations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('GITHUB')
  const [semanticResults, setSemanticResults] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [vectorSearchQuery, setVectorSearchQuery] = useState('')
  const [indexingProgress, setIndexingProgress] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState({
    contentDiscovery: 'Checking...',
    recommendationEngine: 'Checking...'
  })

  useEffect(() => {
    loadStats()
    loadRecommendations()
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = () => {
    try {
      const contentStatus = contentDiscovery.getStatus()
      const recommendationStatus = recommendationEngine.getStatus()
      
      setConnectionStatus({
        contentDiscovery: contentStatus.supabase === 'connected' ? 'Connected' : 'Demo Mode',
        recommendationEngine: recommendationStatus.supabase === 'connected' ? 'Connected' : 'Demo Mode'
      })
    } catch (error) {
      console.error('Error checking connection status:', error)
    }
  }

  const loadStats = async () => {
    try {
      const scrapingStats = await getScrapingStats()
      setStats(scrapingStats)
    } catch (error) {
      console.error('Error loading stats:', error)
      // Set mock stats for demo mode
      setStats({
        totalOperations: 0,
        activeOperations: 0,
        completedOperations: 0,
        totalResults: 0
      })
    }
  }

  const loadRecommendations = async () => {
    try {
      // Mock user ID - in real app, get from auth context
      const userId = 'mock-user-id'
      const recs = await recommendationEngine.getPersonalizedRecommendations(userId, 10)
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const handleSemanticSearch = async () => {
    if (!vectorSearchQuery.trim()) return

    setLoading(true)
    try {
      const results = await contentDiscovery.searchContent(vectorSearchQuery, {})
      setSemanticResults(results)
      console.log(`🔍 Found ${results.length} semantically similar notebooks`)
    } catch (error) {
      console.error('Error performing semantic search:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleIndexAllNotebooks = async () => {
    setLoading(true)
    setIndexingProgress(0)
    
    try {
      // Get all notebooks that don't have embeddings
      const { data: notebooks } = await fetch('/api/notebooks').then(r => r.json())
      const notebooksToIndex = notebooks.filter(n => !n.embedding)
      
      console.log(`🔄 Indexing ${notebooksToIndex.length} notebooks with embeddings...`)
      
      for (let i = 0; i < notebooksToIndex.length; i++) {
        try {
          await contentDiscovery.indexContent(notebooksToIndex[i])
          setIndexingProgress(((i + 1) / notebooksToIndex.length) * 100)
          console.log(`✅ Indexed: ${notebooksToIndex[i].title}`)
        } catch (error) {
          console.error(`❌ Failed to index ${notebooksToIndex[i].title}:`, error)
        }
      }
      
      alert('✅ All notebooks indexed with embeddings!')
    } catch (error) {
      console.error('Error indexing notebooks:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
      setIndexingProgress(0)
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
    <Layout title="Enhanced Scraping Dashboard - NotebookLM Directory">
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 2rem 0',
            textAlign: 'center'
          }}>
            🚀 Enterprise <span style={{ color: '#00ff88' }}>Discovery Engine</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#e2e8f0',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            AI-powered content discovery with vector embeddings and real-time scraping
          </p>

          {/* Connection Status Banner */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.5rem' }}>
                System Status
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                {connectionStatus.contentDiscovery}
              </div>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.5rem' }}>
                Recommendations
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                {connectionStatus.recommendationEngine}
              </div>
            </div>
            <div style={{
              background: connectionStatus.contentDiscovery === 'Demo Mode' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0, 255, 136, 0.2)',
              color: connectionStatus.contentDiscovery === 'Demo Mode' ? '#ffc107' : '#00ff88',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {connectionStatus.contentDiscovery === 'Demo Mode' ? '🎭 Demo Mode' : '🟢 Live Mode'}
            </div>
          </div>

          {/* Enterprise Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Vector Search */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>🧠 Semantic Search</h3>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={vectorSearchQuery}
                  onChange={(e) => setVectorSearchQuery(e.target.value)}
                  placeholder="Search notebooks semantically..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    marginBottom: '1rem'
                  }}
                />
                <button
                  onClick={handleSemanticSearch}
                  disabled={loading || !vectorSearchQuery.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    color: '#0a0a0a',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {loading ? 'Searching...' : '🔍 Semantic Search'}
                </button>
              </div>
              
              {semanticResults.length > 0 && (
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Results:</h4>
                  {semanticResults.slice(0, 5).map((result, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ color: '#ffffff', fontWeight: '600' }}>{result.title}</div>
                      <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                        Similarity: {(result.similarity * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(255, 193, 7, 0.2)'
            }}>
              <h3 style={{ color: '#ffc107', marginBottom: '1rem' }}>🎯 AI Recommendations</h3>
              <div style={{ marginBottom: '1rem' }}>
                <button
                  onClick={loadRecommendations}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                    color: '#0a0a0a',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {loading ? 'Loading...' : '🔄 Refresh Recommendations'}
                </button>
              </div>
              
              {recommendations.length > 0 && (
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Top Recommendations:</h4>
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ color: '#ffffff', fontWeight: '600' }}>{rec.title}</div>
                      <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                        Score: {(rec.score * 100).toFixed(1)}% • {rec.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Indexing */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <h3 style={{ color: '#9c27b0', marginBottom: '1rem' }}>📚 Content Indexing</h3>
              <div style={{ marginBottom: '1rem' }}>
                <button
                  onClick={handleIndexAllNotebooks}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {loading ? 'Indexing...' : '🔄 Index All Notebooks'}
                </button>
              </div>
              
              {indexingProgress > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Progress:</div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${indexingProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #9c27b0, #e1bee7)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {indexingProgress.toFixed(1)}% Complete
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scraping Operations */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(255, 87, 34, 0.2)'
          }}>
            <h3 style={{ color: '#ff5722', marginBottom: '1rem' }}>🕷️ Content Scraping</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter search query..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    marginBottom: '1rem'
                  }}
                />
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    marginBottom: '1rem'
                  }}
                >
                  <option value="GITHUB">GitHub</option>
                  <option value="REDDIT">Reddit</option>
                  <option value="TWITTER">Twitter</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="YOUTUBE">YouTube</option>
                </select>
                <button
                  onClick={handleSingleScrape}
                  disabled={loading || !query.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {loading ? 'Scraping...' : '🔍 Start Scraping'}
                </button>
              </div>
              
              <div>
                <button
                  onClick={handleMassiveScrape}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {loading ? 'Starting...' : '🚀 Massive Discovery'}
                </button>
              </div>
            </div>

            {/* Operations List */}
            {operations.length > 0 && (
              <div>
                <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Recent Operations:</h4>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  {operations.slice(0, 10).map((op, index) => {
                    // Safely extract values from the operation object
                    const operation = op.operation || op;
                    const query = operation.search_query || operation.query || op.searchQuery || 'Unknown Query';
                    const source = operation.source || operation.source_platform || 'Unknown';
                    const status = operation.status || 'pending';
                    const itemsFound = operation.items_found || operation.items_discovered || 0;
                    const startedAt = operation.started_at || operation.start_time || operation.created_at || 'N/A';
                    const operationId = operation.id || op.id || index;
                    
                    return (
                      <div key={operationId} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ color: '#ffffff', fontWeight: '600' }}>
                          Query: {query}
                        </div>
                        <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                          Source: {source}<br/>
                          Status: {status}<br/>
                          Items Found: {itemsFound}<br/>
                          Started: {startedAt}<br/>
                          {/* Debug: */}
                          <pre style={{ color: '#aaa', fontSize: '0.7rem', marginTop: '0.5rem' }}>{JSON.stringify(operation, null, 2)}</pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Stats Display */}
          {stats && (
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 150, 136, 0.2)',
              marginTop: '2rem'
            }}>
              <h3 style={{ color: '#009688', marginBottom: '1rem' }}>📊 System Statistics</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '700' }}>
                    {stats.totalOperations || 0}
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Operations</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '700' }}>
                    {stats.activeOperations || 0}
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Active Operations</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '700' }}>
                    {stats.completedOperations || 0}
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Completed</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '700' }}>
                    {stats.totalResults || 0}
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Results</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
} 