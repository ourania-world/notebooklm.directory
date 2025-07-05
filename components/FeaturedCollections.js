import { useState, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import { getNotebooks } from '../lib/notebooks'

export default function FeaturedCollections() {
  const [collections, setCollections] = useState([])
  const [activeCollection, setActiveCollection] = useState(0)
  const [loading, setLoading] = useState(true)

  const collectionDefinitions = [
    {
      id: 'trending',
      name: 'Trending This Week',
      description: 'Most viewed notebooks in the past 7 days',
      icon: '🔥',
      color: '#ff6b6b'
    },
    {
      id: 'ai-research',
      name: 'AI & Machine Learning',
      description: 'Cutting-edge AI research and applications',
      icon: '🤖',
      color: '#4ecdc4'
    },
    {
      id: 'academic',
      name: 'Academic Excellence',
      description: 'High-quality academic research and analysis',
      icon: '🎓',
      color: '#45b7d1'
    },
    {
      id: 'creative',
      name: 'Creative Projects',
      description: 'Innovative creative applications and storytelling',
      icon: '🎨',
      color: '#f9ca24'
    }
  ]

  useEffect(() => {
    async function loadCollections() {
      try {
        const collectionsData = await Promise.all(
          collectionDefinitions.map(async (collection) => {
            let notebooks = []
            
            switch (collection.id) {
              case 'trending':
                // Get notebooks with highest view counts
                notebooks = await getNotebooks()
                notebooks = notebooks
                  .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                  .slice(0, 6)
                break
                
              case 'ai-research':
                // Get notebooks with AI-related tags
                notebooks = await getNotebooks()
                notebooks = notebooks
                  .filter(n => 
                    n.tags?.some(tag => 
                      tag.toLowerCase().includes('ai') ||
                      tag.toLowerCase().includes('machine learning') ||
                      tag.toLowerCase().includes('ml') ||
                      tag.toLowerCase().includes('artificial intelligence')
                    ) ||
                    n.title.toLowerCase().includes('ai') ||
                    n.description.toLowerCase().includes('machine learning')
                  )
                  .slice(0, 6)
                break
                
              case 'academic':
                // Get academic category notebooks
                notebooks = await getNotebooks({ category: 'Academic' })
                notebooks = notebooks.slice(0, 6)
                break
                
              case 'creative':
                // Get creative category notebooks
                notebooks = await getNotebooks({ category: 'Creative' })
                notebooks = notebooks.slice(0, 6)
                break
            }
            
            return {
              ...collection,
              notebooks
            }
          })
        )
        
        setCollections(collectionsData.filter(c => c.notebooks.length > 0))
      } catch (error) {
        console.error('Error loading collections:', error)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }

    loadCollections()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(0, 255, 136, 0.3)',
          borderTop: '4px solid #00ff88',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <p style={{ color: '#e2e8f0', marginTop: '1rem' }}>
          Loading featured collections...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (collections.length === 0) {
    return null
  }

  const activeCollectionData = collections[activeCollection]

  return (
    <div style={{ marginBottom: '4rem' }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        textAlign: 'center', 
        margin: '0 0 3rem 0',
        color: '#ffffff',
        fontWeight: '700'
      }}>
        Featured <span style={{ color: '#00ff88' }}>Collections</span>
      </h2>

      {/* Collection Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        {collections.map((collection, index) => (
          <button
            key={collection.id}
            onClick={() => setActiveCollection(index)}
            style={{
              background: activeCollection === index ? 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' :
                'rgba(255, 255, 255, 0.05)',
              color: activeCollection === index ? '#0a0a0a' : '#ffffff',
              border: activeCollection === index ? 
                'none' : 
                '1px solid rgba(255, 255, 255, 0.2)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (activeCollection !== index) {
                e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                e.target.style.borderColor = '#00ff88';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCollection !== index) {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{collection.icon}</span>
            {collection.name}
          </button>
        ))}
      </div>

      {/* Active Collection */}
      {activeCollectionData && (
        <div>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 255, 136, 0.1)'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '0.5rem'
            }}>
              {activeCollectionData.icon}
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#ffffff',
              margin: '0 0 0.5rem 0',
              fontWeight: '600'
            }}>
              {activeCollectionData.name}
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1rem',
              margin: 0
            }}>
              {activeCollectionData.description}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem'
          }}>
            {activeCollectionData.notebooks.map(notebook => (
              <ProjectCard key={notebook.id} notebook={notebook} />
            ))}
          </div>

          {activeCollectionData.notebooks.length === 6 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => window.location.href = `/browse?category=${activeCollectionData.id === 'academic' ? 'Academic' : activeCollectionData.id === 'creative' ? 'Creative' : 'All'}`}
                style={{
                  background: 'transparent',
                  color: '#00ff88',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                  e.target.style.borderColor = '#00ff88';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                }}
              >
                View All in {activeCollectionData.name} →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}