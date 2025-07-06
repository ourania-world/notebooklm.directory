import { useState, useEffect } from 'react';
import { getNotebooks } from '../lib/notebooks';

export default function FeaturedCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        // Get notebooks for each collection
        const [academicNotebooks, businessNotebooks, researchNotebooks] = await Promise.all([
          getNotebooks({ category: 'Academic', limit: 3 }),
          getNotebooks({ category: 'Business', limit: 3 }),
          getNotebooks({ category: 'Research', limit: 3 })
        ]);
        
        setCollections([
          {
            id: 'academic',
            title: 'Academic Excellence',
            description: 'Cutting-edge academic research and analysis',
            notebooks: academicNotebooks || [],
            color: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)'
          },
          {
            id: 'business',
            title: 'Business Intelligence',
            description: 'Strategic insights for business leaders',
            notebooks: businessNotebooks || [],
            color: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
          },
          {
            id: 'research',
            title: 'Scientific Research',
            description: 'Breakthrough scientific discoveries and methodologies',
            notebooks: researchNotebooks || [],
            color: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)'
          }
        ]);
      } catch (error) {
        console.error('Error loading collections:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCollections();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#e2e8f0' }}>Loading collections...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: '2.5rem', 
        textAlign: 'center', 
        margin: '0 0 3rem 0',
        color: '#ffffff',
        fontWeight: '700'
      }}>
        Featured <span style={{ color: '#00ff88' }}>Collections</span>
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {collections.map(collection => (
          <div key={collection.id}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '700'
                }}>
                  {collection.title}
                </h3>
                <p style={{ color: '#e2e8f0', margin: 0 }}>
                  {collection.description}
                </p>
              </div>
              
              <button
                onClick={() => window.location.href = `/browse?category=${collection.id}`}
                style={{
                  background: 'transparent',
                  color: '#00ff88',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
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
                View All
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {collection.notebooks.map(notebook => (
                <div 
                  key={notebook.id}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.location.href = `/notebook/${notebook.id}`}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
                    e.target.style.borderColor = '#00ff88';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = 'rgba(0, 255, 136, 0.2)';
                  }}
                >
                  <div style={{
                    height: '8px',
                    background: collection.color
                  }} />
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h4 style={{ 
                      fontSize: '1.2rem', 
                      color: '#ffffff',
                      margin: '0 0 0.5rem 0',
                      fontWeight: '600'
                    }}>
                      {notebook.title}
                    </h4>
                    
                    <p style={{ 
                      color: '#e2e8f0', 
                      fontSize: '0.9rem',
                      margin: '0 0 1rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {notebook.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ color: '#00ff88', fontSize: '0.8rem' }}>
                        {notebook.author}
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#e2e8f0',
                        fontSize: '0.8rem'
                      }}>
                        <span>{notebook.view_count || 0} views</span>
                        <span>•</span>
                        <span>{notebook.save_count || 0} saves</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}