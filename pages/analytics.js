import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getCurrentUser } from '../lib/auth'
import { getUserSubscription } from '../lib/subscriptions'
import { getUserEngagementMetrics, getPopularNotebooks, getTrendingSearches, getUserActivitySummary } from '../lib/analytics'
import { getUserNotebooks, getSavedNotebooks } from '../lib/profiles'
import UpgradePrompt from '../components/UpgradePrompt'

export default function Analytics() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [popularNotebooks, setPopularNotebooks] = useState([])
  const [trendingSearches, setTrendingSearches] = useState([])
  const [userNotebooks, setUserNotebooks] = useState([])
  const [savedNotebooks, setSavedNotebooks] = useState([])
  const [activitySummary, setActivitySummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          window.location.href = '/'
          return
        }

        setUser(currentUser)
        
        const userSubscription = await getUserSubscription(currentUser.id)
        setSubscription(userSubscription)

        // Check if user has access to analytics
        if (!userSubscription || userSubscription.subscription_plans?.id === 'free') {
          setShowUpgrade(true)
          setLoading(false)
          return
        }

        // Load analytics data
        const [
          userMetrics,
          activityData,
          popular,
          trending,
          notebooks,
          saved
        ] = await Promise.all([
          getUserEngagementMetrics(currentUser.id),
          getUserActivitySummary(currentUser.id),
          getPopularNotebooks(10),
          getTrendingSearches(10),
          getUserNotebooks(currentUser.id),
          getSavedNotebooks(currentUser.id)
        ])

        setMetrics(userMetrics)
        setActivitySummary(activityData)
        setPopularNotebooks(popular)
        setTrendingSearches(trending)
        setUserNotebooks(notebooks)
        setSavedNotebooks(saved)
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <Layout title="Analytics - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#e2e8f0' }}>Loading analytics...</p>
        </div>
      </Layout>
    )
  }

  if (showUpgrade) {
    return (
      <>
        <Layout title="Analytics - NotebookLM Directory">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 2rem 0',
              color: '#ffffff'
            }}>
              Analytics Dashboard
            </h1>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>
                Premium Analytics Dashboard
              </h2>
              <p style={{ color: '#e2e8f0', marginBottom: '2rem' }}>
                Get detailed insights into your notebook performance, user engagement, and trending content.
              </p>
              <button
                onClick={() => setShowUpgrade(true)}
                style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </Layout>
        
        <UpgradePrompt
          feature="analytics"
          currentPlan={subscription?.subscription_plans?.id || 'free'}
          requiredPlan="premium"
          onClose={() => setShowUpgrade(false)}
        />
      </>
    )
  }

  return (
    <Layout title="Analytics - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#ffffff'
        }}>
          Analytics Dashboard
        </h1>

        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Your Notebooks
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {activitySummary?.notebooksSubmitted || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Total submissions
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Saved Notebooks
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {activitySummary?.notebooksSaved || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              In your collection
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Total Views
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {activitySummary?.totalViews || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Across all notebooks
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Engagement Score
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {activitySummary?.engagementScore || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Overall score
            </p>
        {/* Additional Analytics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Total Saves Received
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {activitySummary?.totalSaves || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Across all notebooks
            </p>
          </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Audio Plays
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {metrics?.audioPlays || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Last 30 days
            </p>
          </div>
        </div>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ color: '#00ff88', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
              Search Queries
            </h3>
            <div style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '700' }}>
              {metrics?.searches || 0}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
              Last 30 days
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Popular Notebooks */}
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
              🔥 Most Popular Notebooks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {popularNotebooks.slice(0, 5).map((notebook, index) => (
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

          {/* Trending Searches */}
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
              📈 Trending Searches
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {trendingSearches.slice(0, 8).map((search, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#ffffff', fontWeight: '500' }}>
                    {search.query}
                  </div>
                  <div style={{ 
                    color: '#00ff88', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {search.count} searches
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}