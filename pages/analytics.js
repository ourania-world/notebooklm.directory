import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getCurrentUser } from '../lib/auth'
import { getUserSubscription } from '../lib/subscriptions'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import UpgradePrompt from '../components/UpgradePrompt'

export default function Analytics() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [selectedReport, setSelectedReport] = useState('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
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

      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const hasPremiumAccess = subscription?.subscription_plans?.limits?.premiumContent === true

  if (loading) {
    return (
      <Layout title="Analytics - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#e2e8f0' }}>Loading analytics...</p>
        </div>
      </Layout>
    )
  }

  if (selectedReport !== 'overview' && !hasPremiumAccess) {
    return (
      <>
        <Layout title="Analytics - NotebookLM Directory">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 2rem 0',
              color: '#ffffff'
            }}>
              Analytics <span style={{ color: '#00ff88' }}>Dashboard</span>
            </h1>

            {/* Report Type Selector */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'user', name: 'My Performance', icon: '👤', premium: true },
                { id: 'search', name: 'Search Analytics', icon: '🔍', premium: true },
                { id: 'engagement', name: 'Engagement', icon: '💬', premium: true }
              ].map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  disabled={report.premium && !hasPremiumAccess}
                  style={{
                    background: selectedReport === report.id ? 
                      'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' :
                      'rgba(255, 255, 255, 0.05)',
                    color: selectedReport === report.id ? '#0a0a0a' : 
                           (report.premium && !hasPremiumAccess) ? '#666' : '#ffffff',
                    border: selectedReport === report.id ? 
                      'none' : 
                      '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: (report.premium && !hasPremiumAccess) ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: (report.premium && !hasPremiumAccess) ? 0.5 : 1
                  }}
                >
                  <span>{report.icon}</span>
                  {report.name}
                  {report.premium && !hasPremiumAccess && (
                    <span style={{ fontSize: '0.7rem', marginLeft: '0.25rem' }}>🔒</span>
                  )}
                </button>
              ))}
            </div>

            {/* Timeframe Selector */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem'
            }}>
              {[
                { id: '7d', name: '7 days' },
                { id: '30d', name: '30 days' },
                { id: '90d', name: '90 days' },
                { id: '365d', name: '1 year' }
              ].map((timeframe) => (
                <button
                  key={timeframe.id}
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  style={{
                    background: selectedTimeframe === timeframe.id ? 
                      'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: selectedTimeframe === timeframe.id ? '#00ff88' : '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {timeframe.name}
                </button>
              ))}
            </div>

            <AnalyticsDashboard 
              reportType={selectedReport}
              timeframe={selectedTimeframe}
            />
          </div>
        </Layout>
        
        {selectedReport !== 'overview' && !hasPremiumAccess && (
          <UpgradePrompt
            feature="analytics"
            currentPlan={subscription?.subscription_plans?.id || 'free'}
            requiredPlan="professional"
            onClose={() => setSelectedReport('overview')}
          />
        )}
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
          Analytics <span style={{ color: '#00ff88' }}>Dashboard</span>
        </h1>

        {/* Report Type Selector */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'user', name: 'My Performance', icon: '👤', premium: true },
            { id: 'search', name: 'Search Analytics', icon: '🔍', premium: true },
            { id: 'engagement', name: 'Engagement', icon: '💬', premium: true }
          ].map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              disabled={report.premium && !hasPremiumAccess}
              style={{
                background: selectedReport === report.id ? 
                  'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' :
                  'rgba(255, 255, 255, 0.05)',
                color: selectedReport === report.id ? '#0a0a0a' : 
                       (report.premium && !hasPremiumAccess) ? '#666' : '#ffffff',
                border: selectedReport === report.id ? 
                  'none' : 
                  '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: (report.premium && !hasPremiumAccess) ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: (report.premium && !hasPremiumAccess) ? 0.5 : 1
              }}
            >
              <span>{report.icon}</span>
              {report.name}
              {report.premium && !hasPremiumAccess && (
                <span style={{ fontSize: '0.7rem', marginLeft: '0.25rem' }}>🔒</span>
              )}
            </button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { id: '7d', name: '7 days' },
            { id: '30d', name: '30 days' },
            { id: '90d', name: '90 days' },
            { id: '365d', name: '1 year' }
          ].map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              style={{
                background: selectedTimeframe === timeframe.id ? 
                  'rgba(0, 255, 136, 0.2)' : 'transparent',
                color: selectedTimeframe === timeframe.id ? '#00ff88' : '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {timeframe.name}
            </button>
          ))}
        </div>

        <AnalyticsDashboard 
          reportType={selectedReport}
          timeframe={selectedTimeframe}
        />
      </div>
    </Layout>
  )
}