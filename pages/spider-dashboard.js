import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../lib/supabase';
import { getUserSubscription } from '../lib/subscriptions';
import { spiderScrapers, runMassiveDiscovery } from '../lib/spider-scrapers';

export default function SpiderDashboard() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('GITHUB');
  const [stats, setStats] = useState({
    totalOperations: 0,
    runningOperations: 0,
    completedOperations: 0,
    totalItemsFound: 0,
    lastOperation: null
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Get current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login?redirect=/spider-dashboard';
          return;
        }
        setUser(currentUser);
        
        // Check subscription
        const userSubscription = await getUserSubscription(currentUser.id);
        setSubscription(userSubscription);
        
        // Check if user has premium access
        const hasPremiumAccess = userSubscription?.subscription_plans?.limits?.premiumContent === true;
        if (!hasPremiumAccess) {
          window.location.href = '/pricing?redirect=/spider-dashboard';
          return;
        }
        
        // Load recent operations
        await loadRecentOperations();
        
        // Load stats
        await loadStats();
      } catch (err) {
        console.error('Error loading spider dashboard:', err);
        setError('Failed to load spider dashboard data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  const loadRecentOperations = async () => {
    try {
      // Simulate loading recent operations
      // In a real implementation, this would fetch from the database
      setOperations([
        {
          id: 'op-' + Math.random().toString(36).substring(2, 10),
          source: 'GITHUB',
          query: 'notebooklm research',
          status: 'completed',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3540000).toISOString(),
          itemsFound: 12
        },
        {
          id: 'op-' + Math.random().toString(36).substring(2, 10),
          source: 'REDDIT',
          query: 'notebooklm tutorial',
          status: 'completed',
          startedAt: new Date(Date.now() - 7200000).toISOString(),
          completedAt: new Date(Date.now() - 7140000).toISOString(),
          itemsFound: 8
        },
        {
          id: 'op-' + Math.random().toString(36).substring(2, 10),
          source: 'TWITTER',
          query: 'notebooklm',
          status: 'running',
          startedAt: new Date().toISOString(),
          completedAt: null,
          itemsFound: null
        }
      ]);
    } catch (error) {
      console.error('Error loading recent operations:', error);
    }
  };
  
  const loadStats = async () => {
    try {
      // Simulate loading stats
      // In a real implementation, this would fetch from the database
      setStats({
        totalOperations: 24,
        runningOperations: 1,
        completedOperations: 23,
        totalItemsFound: 187,
        lastOperation: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const handleSingleScrape = async () => {
    if (!query.trim()) return;
    
    setActionLoading(true);
    try {
      // Simulate starting a scrape operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newOperation = {
        id: 'op-' + Math.random().toString(36).substring(2, 10),
        source: selectedSource,
        query: query,
        status: 'running',
        startedAt: new Date().toISOString(),
        completedAt: null,
        itemsFound: null
      };
      
      setOperations(prev => [newOperation, ...prev]);
      setQuery('');
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        runningOperations: prev.runningOperations + 1,
        lastOperation: new Date().toISOString()
      }));
      
      // Simulate operation completion after delay
      setTimeout(() => {
        const itemsFound = Math.floor(Math.random() * 20) + 1;
        
        setOperations(prev => 
          prev.map(op => 
            op.id === newOperation.id 
              ? {
                  ...op,
                  status: 'completed',
                  completedAt: new Date().toISOString(),
                  itemsFound
                }
              : op
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          runningOperations: prev.runningOperations - 1,
          completedOperations: prev.completedOperations + 1,
          totalItemsFound: prev.totalItemsFound + itemsFound
        }));
      }, 5000);
    } catch (error) {
      console.error('Error starting scrape:', error);
      setError(`Failed to start scrape: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleMassiveScrape = async () => {
    setActionLoading(true);
    try {
      // Simulate starting multiple scrape operations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sources = ['GITHUB', 'REDDIT', 'TWITTER', 'ACADEMIC', 'YOUTUBE'];
      const queries = ['notebooklm', 'ai research', 'data analysis', 'machine learning'];
      
      const newOperations = [];
      
      for (const source of sources) {
        for (const query of queries) {
          if (Math.random() > 0.7) { // Randomly skip some combinations
            continue;
          }
          
          const newOperation = {
            id: 'op-' + Math.random().toString(36).substring(2, 10),
            source,
            query,
            status: 'running',
            startedAt: new Date().toISOString(),
            completedAt: null,
            itemsFound: null
          };
          
          newOperations.push(newOperation);
        }
      }
      
      setOperations(prev => [...newOperations, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalOperations: prev.totalOperations + newOperations.length,
        runningOperations: prev.runningOperations + newOperations.length,
        lastOperation: new Date().toISOString()
      }));
      
      // Simulate operations completing over time
      newOperations.forEach((op, index) => {
        setTimeout(() => {
          const itemsFound = Math.floor(Math.random() * 20) + 1;
          
          setOperations(prev => 
            prev.map(operation => 
              operation.id === op.id 
                ? {
                    ...operation,
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    itemsFound
                  }
                : operation
            )
          );
          
          // Update stats
          setStats(prev => ({
            ...prev,
            runningOperations: prev.runningOperations - 1,
            completedOperations: prev.completedOperations + 1,
            totalItemsFound: prev.totalItemsFound + itemsFound
          }));
        }, 3000 + (index * 1500)); // Stagger completions
      });
    } catch (error) {
      console.error('Error starting massive scrape:', error);
      setError(`Failed to start massive scrape: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Spider Dashboard - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 2rem 0',
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Spider <span style={{ color: '#00ff88' }}>Dashboard</span>
          </h1>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px' 
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
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Spider Dashboard - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 2rem 0',
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Spider <span style={{ color: '#00ff88' }}>Dashboard</span>
          </h1>
          
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            color: '#ff6b6b',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                marginTop: '1rem',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Spider Dashboard - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          Spider <span style={{ color: '#00ff88' }}>Dashboard</span>
        </h1>
        
        {/* Stats */}
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
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#00ff88',
              marginBottom: '0.5rem'
            }}>
              {stats.totalOperations}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              Total Operations
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#00ff88',
              marginBottom: '0.5rem'
            }}>
              {stats.totalItemsFound}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              Notebooks Found
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#00ff88',
              marginBottom: '0.5rem'
            }}>
              {stats.runningOperations}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              Running Now
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#00ff88',
              marginBottom: '0.5rem'
            }}>
              {stats.completedOperations}
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              Completed
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            color: '#ffffff', 
            marginTop: 0,
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            Launch Discovery Operations
          </h2>
          
          {/* Single Scrape */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#00ff88', 
              marginTop: 0,
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              Single Source Scrape
            </h3>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap',
              alignItems: 'flex-end'
            }}>
              <div style={{ flex: '0 0 200px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff'
                  }}
                >
                  <option value="GITHUB" style={{ background: '#1a1a2e' }}>GitHub</option>
                  <option value="REDDIT" style={{ background: '#1a1a2e' }}>Reddit</option>
                  <option value="TWITTER" style={{ background: '#1a1a2e' }}>Twitter</option>
                  <option value="ACADEMIC" style={{ background: '#1a1a2e' }}>Academic</option>
                  <option value="YOUTUBE" style={{ background: '#1a1a2e' }}>YouTube</option>
                </select>
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Search Query
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter search query..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff'
                  }}
                />
              </div>
              
              <button
                onClick={handleSingleScrape}
                disabled={actionLoading || !query.trim()}
                style={{
                  background: actionLoading || !query.trim() ? 
                    'rgba(255, 255, 255, 0.1)' : 
                    'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: actionLoading || !query.trim() ? '#ffffff' : '#0a0a0a',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: actionLoading || !query.trim() ? 'not-allowed' : 'pointer',
                  opacity: actionLoading || !query.trim() ? 0.7 : 1
                }}
              >
                {actionLoading ? 'Starting...' : 'Start Scrape'}
              </button>
            </div>
          </div>
          
          {/* Massive Scrape */}
          <div>
            <h3 style={{ 
              color: '#00ff88', 
              marginTop: 0,
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              Massive Discovery
            </h3>
            <p style={{ 
              color: '#e2e8f0', 
              marginTop: 0,
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              Launch comprehensive discovery across all platforms with predefined high-value queries
            </p>
            <button
              onClick={handleMassiveScrape}
              disabled={actionLoading}
              style={{
                background: actionLoading ? 
                  'rgba(255, 255, 255, 0.1)' : 
                  'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: actionLoading ? 0.7 : 1
              }}
            >
              {actionLoading ? '🚀 Launching...' : '🚀 Launch Massive Discovery'}
            </button>
          </div>
        </div>
        
        {/* Operations List */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <h2 style={{ 
            color: '#ffffff', 
            marginTop: 0,
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            Recent Operations
          </h2>
          
          {operations.length === 0 ? (
            <p style={{ 
              color: '#e2e8f0', 
              textAlign: 'center', 
              padding: '2rem',
              margin: 0
            }}>
              No operations yet. Start your first discovery above!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {operations.map((op) => (
                <div
                  key={op.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ 
                        color: '#ffffff', 
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          background: 'rgba(0, 255, 136, 0.1)',
                          color: '#00ff88',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {op.source}
                        </span>
                        {op.query}
                      </div>
                      <div style={{ 
                        color: '#e2e8f0', 
                        fontSize: '0.8rem',
                        marginTop: '0.25rem'
                      }}>
                        Started: {new Date(op.startedAt).toLocaleString()}
                        {op.completedAt && ` • Completed: ${new Date(op.completedAt).toLocaleString()}`}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      {op.itemsFound !== null && (
                        <div style={{ 
                          color: '#00ff88', 
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {op.itemsFound} items found
                        </div>
                      )}
                      <div style={{
                        background: op.status === 'completed' ? 
                          'rgba(0, 255, 136, 0.1)' : 
                          op.status === 'running' ? 
                            'rgba(255, 193, 7, 0.1)' : 
                            'rgba(255, 107, 107, 0.1)',
                        color: op.status === 'completed' ? 
                          '#00ff88' : 
                          op.status === 'running' ? 
                            '#ffc107' : 
                            '#ff6b6b',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {op.status === 'running' && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#ffc107',
                            animation: 'pulse 1s infinite'
                          }} />
                        )}
                        {op.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </Layout>
  );
}