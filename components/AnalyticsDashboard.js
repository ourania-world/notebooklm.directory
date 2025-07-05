import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/auth'
import { getUserSubscription } from '../lib/subscriptions'

export default function AnalyticsDashboard({ reportType = 'overview', timeframe = '30d' }) {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          setError('Authentication required')
          setLoading(false)
          return
        }

        setUser(currentUser)
        
        const userSubscription = await getUserSubscription(currentUser.id)
        setSubscription(userSubscription)

        // Check if user has access to analytics
        if (reportType !== 'overview' && (!userSubscription || userSubscription.subscription_plans?.id === 'free')) {
          setError('Premium subscription required for detailed analytics')
          setLoading(false)
          return
        }

        // Fetch analytics report
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const response = await fetch(
          `${supabaseUrl}/functions/v1/generate-analytics-report?type=${reportType}&timeframe=${timeframe}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch analytics report')
        }

        const data = await response.json()
        setReportData(data)
      } catch (err) {
        console.error('Error loading analytics:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [reportType, timeframe])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 255, 136, 0.2)'
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
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(220, 53, 69, 0.1)',
        color: '#dc3545',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid rgba(220, 53, 69, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ margin: '0 0 1rem 0' }}>Analytics Error</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    )
  }

  if (reportType === 'overview' && reportData?.overview) {
    return (
      <div>
        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.overview.totalNotebooks}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Notebooks</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.overview.totalViews.toLocaleString()}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Views</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.overview.totalSaves.toLocaleString()}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Saves</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.overview.saveRate}%
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Save Rate</div>
          </div>
        </div>

        {/* Trending Notebooks */}
        {reportData.trending && reportData.trending.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              color: '#ffffff', 
              fontSize: '1.3rem', 
              margin: '0 0 1.5rem 0',
              fontWeight: '600'
            }}>
              🔥 Trending Notebooks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportData.trending.slice(0, 5).map((notebook, index) => (
                <div key={notebook.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#ffffff', fontWeight: '500', marginBottom: '0.25rem' }}>
                      {notebook.title}
                    </div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                      by {notebook.author}
                    </div>
                  </div>
                  <div style={{ 
                    color: '#00ff88', 
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    {notebook.view_count || 0} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {reportData.categories && reportData.categories.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ 
              color: '#ffffff', 
              fontSize: '1.3rem', 
              margin: '0 0 1.5rem 0',
              fontWeight: '600'
            }}>
              📊 Category Distribution
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {reportData.categories.map((category, index) => (
                <div key={category.name} style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#00ff88', fontSize: '1.5rem', fontWeight: '700' }}>
                    {category.count}
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                    {category.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (reportType === 'user' && reportData) {
    return (
      <div>
        {/* User Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.notebooks?.length || 0}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Your Notebooks</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.totalViews || 0}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Views</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.totalSaves || 0}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Saves</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: '700' }}>
              {reportData.totalActivity || 0}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Total Activity</div>
          </div>
        </div>

        {/* User's Top Notebooks */}
        {reportData.notebooks && reportData.notebooks.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ 
              color: '#ffffff', 
              fontSize: '1.3rem', 
              margin: '0 0 1.5rem 0',
              fontWeight: '600'
            }}>
              📚 Your Top Performing Notebooks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportData.notebooks.slice(0, 5).map((notebook, index) => (
                <div key={notebook.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#ffffff', fontWeight: '500', marginBottom: '0.25rem' }}>
                      {notebook.title}
                    </div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                      Created {new Date(notebook.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex',
                    gap: '1rem',
                    color: '#00ff88',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    <span>{notebook.view_count || 0} views</span>
                    <span>{notebook.save_count || 0} saves</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '3rem',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
      <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>
        Analytics Report
      </h3>
      <p style={{ color: '#e2e8f0' }}>
        Report type: {reportType} | Timeframe: {timeframe}
      </p>
    </div>
  )
}