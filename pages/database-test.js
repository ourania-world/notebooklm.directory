import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

export default function DatabaseTest() {
  const [loading, setLoading] = useState(true);
  const [notebooks, setNotebooks] = useState([]);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('notebooks').select('count');
        
        if (error) {
          console.error('Database connection error:', error);
          setConnectionStatus('error');
          setError(error.message);
          return;
        }
        
        setConnectionStatus('connected');
        
        // Try to fetch notebooks
        const { data: notebooksData, error: notebooksError } = await supabase
          .from('notebooks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (notebooksError) {
          console.error('Error fetching notebooks:', notebooksError);
          setError(notebooksError.message);
          return;
        }
        
        setNotebooks(notebooksData || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setConnectionStatus('error');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    testConnection();
  }, []);

  return (
    <Layout title="Database Test - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          Database Connection Test
        </h1>
        
        {/* Connection Status */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: '#ffffff', 
            margin: '0 0 1rem 0',
            fontWeight: '600'
          }}>
            Connection Status
          </h2>
          
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 255, 136, 0.3)',
                borderTopColor: '#00ff88',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#e2e8f0' }}>Testing connection...</span>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: connectionStatus === 'connected' ? '#00ff88' : '#ff6b6b'
              }}></div>
              <span style={{ 
                color: connectionStatus === 'connected' ? '#00ff88' : '#ff6b6b',
                fontWeight: '600'
              }}>
                {connectionStatus === 'connected' ? 'Connected to database' : 'Connection error'}
              </span>
            </div>
          )}
          
          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              color: '#ff6b6b',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap'
            }}>
              {error}
            </div>
          )}
        </div>
        
        {/* Notebooks Display */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: '#ffffff', 
            margin: '0 0 1rem 0',
            fontWeight: '600'
          }}>
            Notebooks ({notebooks.length})
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid rgba(0, 255, 136, 0.3)',
                borderTopColor: '#00ff88',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem auto'
              }}></div>
              <span style={{ color: '#e2e8f0' }}>Loading notebooks...</span>
            </div>
          ) : notebooks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notebooks.map(notebook => (
                <div 
                  key={notebook.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.2rem', 
                        color: '#ffffff', 
                        margin: '0 0 0.5rem 0',
                        fontWeight: '600'
                      }}>
                        {notebook.title}
                      </h3>
                      <p style={{ 
                        color: '#e2e8f0', 
                        margin: '0 0 0.5rem 0',
                        fontSize: '0.9rem'
                      }}>
                        {notebook.description.substring(0, 150)}
                        {notebook.description.length > 150 ? '...' : ''}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          background: 'rgba(0, 255, 136, 0.1)',
                          color: '#00ff88',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {notebook.category}
                        </span>
                        {notebook.featured && (
                          <span style={{
                            background: 'rgba(0, 255, 136, 0.2)',
                            color: '#00ff88',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      color: '#e2e8f0', 
                      fontSize: '0.9rem',
                      textAlign: 'right'
                    }}>
                      <div>{notebook.author}</div>
                      {notebook.institution && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {notebook.institution}
                        </div>
                      )}
                      <div style={{ 
                        marginTop: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#00ff88'
                      }}>
                        {new Date(notebook.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: '#e2e8f0'
            }}>
              <p>No notebooks found in the database.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                This could mean the database migration hasn't been applied or there's an issue with the connection.
              </p>
            </div>
          )}
        </div>
        
        {/* Environment Variables */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: '#ffffff', 
            margin: '0 0 1rem 0',
            fontWeight: '600'
          }}>
            Environment Variables
          </h2>
          
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#00ff88' }}>NEXT_PUBLIC_SUPABASE_URL:</span>{' '}
              <span style={{ color: '#e2e8f0' }}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? 
                  process.env.NEXT_PUBLIC_SUPABASE_URL : 
                  'Not set'}
              </span>
            </div>
            <div>
              <span style={{ color: '#00ff88' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{' '}
              <span style={{ color: '#e2e8f0' }}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                  '✓ Set (hidden)' : 
                  'Not set'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Troubleshooting Steps */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: '#ffffff', 
            margin: '0 0 1rem 0',
            fontWeight: '600'
          }}>
            Troubleshooting Steps
          </h2>
          
          <ol style={{ 
            color: '#e2e8f0',
            paddingLeft: '1.5rem',
            margin: 0
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Verify that the database migrations have been applied in Supabase SQL Editor
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Check that environment variables are correctly set
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Ensure the Supabase project is active and accessible
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Verify that the notebooks table exists in the database
            </li>
            <li>
              Check for any errors in the browser console
            </li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}