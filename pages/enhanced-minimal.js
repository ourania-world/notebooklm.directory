import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function EnhancedMinimal() {
  console.log('🚀 MINIMAL ENHANCED DASHBOARD LOADING');
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔧 USE EFFECT TRIGGERED');
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      console.log('📊 INITIALIZING DASHBOARD...');
      
      // Test database connection
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .limit(3);

      if (error) {
        console.warn('Database error:', error);
        setError(`Database: ${error.message}`);
      } else {
        console.log('✅ Database connected, data:', data);
        setSearchResults(data || []);
      }
      
      // Add some mock recommendations
      setSearchResults(prev => [
        ...prev,
        {
          id: 'mock-1',
          title: 'AI-Powered Content Discovery',
          description: 'Advanced content discovery using semantic search and vector embeddings',
          created_at: new Date().toISOString(),
          source_type: 'tutorial'
        },
        {
          id: 'mock-2', 
          title: 'Building Scalable Search Systems',
          description: 'Learn how to build enterprise-scale search with hybrid algorithms',
          created_at: new Date().toISOString(),
          source_type: 'guide'
        }
      ]);
      
    } catch (err) {
      console.error('❌ Initialization error:', err);
      setError(`Init: ${err.message}`);
    } finally {
      console.log('🏁 SETTING LOADING TO FALSE');
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    console.log('🔍 SEARCHING:', query);
    
    if (!query.trim()) {
      initializeDashboard();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      if (error) {
        setError(`Search: ${error.message}`);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      setError(`Search error: ${err.message}`);
    }
  };

  console.log('🎨 RENDERING - loading:', loading, 'results:', searchResults.length);

  if (loading) {
    return (
      <div style={{
        background: '#0a0a0a',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" />
          <p>Loading Enhanced Dashboard...</p>
          <style jsx>{`
            .loading-spinner {
              width: 50px;
              height: 50px;
              border: 3px solid rgba(0, 255, 136, 0.3);
              border-top: 3px solid #00ff88;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#00ff88',
            marginBottom: '0.5rem'
          }}>
            Enhanced AI Discovery Platform
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
            Minimal version - testing core functionality
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#ff6b6b'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Search Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            color: '#ffffff', 
            marginBottom: '1.5rem',
            fontSize: '1.3rem'
          }}>
            🔍 Semantic Search
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search for AI content, tutorials, or topics..."
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              style={{
                padding: '1rem 2rem',
                background: '#00ff88',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {[
            { label: 'Total Content', value: searchResults.length, icon: '📚' },
            { label: 'AI Models', value: '3', icon: '🤖' },
            { label: 'Sources', value: '8', icon: '🌐' },
            { label: 'Quality Score', value: '94%', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#00ff88',
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#ffffff',
            marginBottom: '1.5rem'
          }}>
            🎯 Discovered Content ({searchResults.length})
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {searchResults.map((item, index) => (
              <div key={item.id || index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {item.title || `Content ${index + 1}`}
                  </h3>
                  <div style={{
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {item.source_type || 'unknown'}
                  </div>
                </div>
                
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  {item.description || 'Advanced content discovery and analysis using AI-powered semantic search technologies.'}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  <span>
                    📅 {new Date(item.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <span style={{ color: '#00ff88' }}>
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}