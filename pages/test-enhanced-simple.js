import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

export default function TestEnhancedSimple() {
  console.log('🚀 SIMPLE TEST DASHBOARD LOADING');
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔧 USE EFFECT TRIGGERED - LOADING DATA');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('📊 LOADING SAMPLE DATA...');
      
      // Test Supabase connection
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .limit(5);

      if (error) {
        console.warn('Database error:', error);
        setError(`Database error: ${error.message}`);
      } else {
        console.log('✅ Data loaded successfully:', data);
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    console.log('🔍 EXECUTING SEARCH:', query);
    
    if (!query.trim()) {
      loadData();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.warn('Search error:', error);
        setError(`Search error: ${error.message}`);
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(`Search error: ${err.message}`);
    }
  };

  if (loading) {
    console.log('⏳ RENDERING LOADING STATE');
    return (
      <Layout title="Test Enhanced Dashboard - Simple">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          background: '#0a0a0a',
          color: '#ffffff'
        }}>
          <div>Loading simple test dashboard...</div>
        </div>
      </Layout>
    );
  }

  console.log('🎨 RENDERING MAIN DASHBOARD');

  return (
    <Layout title="Test Enhanced Dashboard - Simple">
      <div style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        padding: '2rem',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#00ff88',
              marginBottom: '1rem'
            }}>
              Simple Test Dashboard
            </h1>
            <p style={{ color: '#e2e8f0' }}>
              Testing basic functionality and search
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#ff6b6b'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Search Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
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
                placeholder="Search for content..."
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '8px',
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
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              Search Results ({searchResults.length})
            </h2>
            
            {searchResults.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{ color: '#e2e8f0' }}>
                  No results found. Try a different search term.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {searchResults.map((item, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      color: '#ffffff',
                      marginBottom: '0.5rem'
                    }}>
                      {item.title || `Item ${index + 1}`}
                    </h3>
                    <p style={{
                      color: '#e2e8f0',
                      fontSize: '0.9rem',
                      marginBottom: '1rem'
                    }}>
                      {item.description || 'No description available'}
                    </p>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#00ff88'
                    }}>
                      Created: {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}