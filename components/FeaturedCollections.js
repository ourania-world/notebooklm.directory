import { useState, useEffect } from 'react';
import { getNotebooks } from '../lib/notebooks';
import ProjectCard from './ProjectCard';
import Link from 'next/link';

export default function FeaturedCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('trending');

  useEffect(() => {
    async function loadCollections() {
      try {
          margin: '0 0 2rem 0',
        const [academicNotebooks, businessNotebooks, researchNotebooks] = await Promise.all([
          getNotebooks({ category: 'Academic', limit: 3 }),
          getNotebooks({ category: 'Business', limit: 3 }),
          getNotebooks({ category: 'Research', limit: 3 })
        ]);
        
        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setActiveFilter('trending')}
            style={{
              background: activeFilter === 'trending' ? 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' : 
                'transparent',
              color: activeFilter === 'trending' ? '#0a0a0a' : '#e2e8f0',
              border: activeFilter === 'trending' ? 
                'none' : 
                '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: activeFilter === 'trending' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease'
            }}
          >
            Trending This Week
          </button>
          
          <button
            onClick={() => setActiveFilter('new')}
            style={{
              background: activeFilter === 'new' ? 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' : 
                'transparent',
              color: activeFilter === 'new' ? '#0a0a0a' : '#e2e8f0',
              border: activeFilter === 'new' ? 
                'none' : 
                '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: activeFilter === 'new' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease'
            }}
          >
            Newest Additions
          </button>
          
          <button
            onClick={() => setActiveFilter('popular')}
            style={{
              background: activeFilter === 'popular' ? 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' : 
                'transparent',
              color: activeFilter === 'popular' ? '#0a0a0a' : '#e2e8f0',
              border: activeFilter === 'popular' ? 
                'none' : 
                '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: activeFilter === 'popular' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease'
            }}
          >
            All-Time Popular
          </button>
        </div>
        
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
              
              <Link
                href={`/browse?category=${collection.id}`}
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
              </Link>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {collection.notebooks.map(notebook => (
                <ProjectCard key={notebook.id} notebook={notebook} />
              ))}
            </div> 
          </div>
        ))}
      </div>
    </div>
  );
}