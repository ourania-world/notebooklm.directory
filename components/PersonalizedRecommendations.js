import { useState, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import { getCurrentUser } from '../lib/auth'

export default function PersonalizedRecommendations({ limit = 6 }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [recommendationType, setRecommendationType] = useState('popular')

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // For now, use the regular notebooks API to get popular content
        // This avoids the Edge Function dependency until it's deployed
        const { getNotebooks } = await import('../lib/notebooks')
        
        // For demo, just show popular notebooks
        const popularNotebooks = await getNotebooks()
        setRecommendations(popularNotebooks.slice(0, limit))
        setRecommendationType('popular')
      } catch (error) {
        console.error('Error loading recommendations:', error)
        // Fallback to basic notebooks
        try {
          const { getNotebooks } = await import('../lib/notebooks')
          const fallbackNotebooks = await getNotebooks()
          setRecommendations(fallbackNotebooks.slice(0, limit))
          setRecommendationType('popular')
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          setRecommendations([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [limit])

  if (loading) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem'
      }}>
        {[...Array(limit)].map((_, index) => (
          <div
            key={index}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 255, 136, 0.3)',
              borderTop: '3px solid #00ff88',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        ))}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '3rem',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>
          No Recommendations Yet
        </h3>
        <p style={{ color: '#e2e8f0' }}>
          Start exploring notebooks to get personalized recommendations!
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          color: '#ffffff',
          fontWeight: '700',
          margin: 0
        }}>
          {recommendationType === 'personalized' ? (
            <>Recommended <span style={{ color: '#00ff88' }}>For You</span></>
          ) : (
            <>Popular <span style={{ color: '#00ff88' }}>Notebooks</span></>
          )}
        </h2>
        
        {recommendationType === 'personalized' && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '20px',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            color: '#00ff88',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ✨ Personalized
          </div>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem'
      }}>
        {recommendations.map(notebook => (
          <ProjectCard key={notebook.id} notebook={notebook} />
        ))}
      </div>

      {recommendationType === 'personalized' && (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(0, 255, 136, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 255, 136, 0.1)'
        }}>
          <p style={{ 
            color: '#e2e8f0', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            💡 These recommendations are based on your saved notebooks and browsing history
          </p>
        </div>
      )}
    </div>
  )
}