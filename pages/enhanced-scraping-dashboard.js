import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

export default function EnhancedScrapingDashboard() {
  console.log('🚀 DASHBOARD COMPONENT LOADING - ENHANCED SCRAPING DASHBOARD');
  
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [scrapingStatus, setScrapingStatus] = useState('idle');
  const [scrapingStats, setScrapingStats] = useState({
    totalScraped: 0,
    todayScraped: 0,
    activeSources: 0,
    successRate: 0
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  const [filters, setFilters] = useState({
    dateRange: 'all',
    source: 'all',
    contentType: 'all'
  });

  // Categories for content discovery
  const categories = [
    { id: 'all', name: 'All Content', icon: '📚', color: '#00ff88' },
    { id: 'ai', name: 'AI & ML', icon: '🤖', color: '#ff6b6b' },
    { id: 'webdev', name: 'Web Development', icon: '💻', color: '#4ecdc4' },
    { id: 'data', name: 'Data Science', icon: '📊', color: '#45b7d1' },
    { id: 'productivity', name: 'Productivity', icon: '⚡', color: '#96ceb4' },
    { id: 'design', name: 'Design', icon: '🎨', color: '#feca57' },
    { id: 'business', name: 'Business', icon: '💼', color: '#ff9ff3' },
    { id: 'tutorials', name: 'Tutorials', icon: '📖', color: '#54a0ff' }
  ];

  useEffect(() => {
    console.log('🔧 USE EFFECT TRIGGERED - CHECKING AUTH AND LOADING DATA');
    checkAuth();
    loadInitialData();
  }, []);

  const checkAuth = async () => {
    console.log('🔐 CHECKING AUTHENTICATION...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 USER CHECK RESULT:', user ? 'User found' : 'No user');
      if (!user) {
        console.log('⚠️ NO USER FOUND - CONTINUING FOR TESTING (AUTH DISABLED)');
        // router.push('/login?redirect=/enhanced-scraping-dashboard'); // DISABLED FOR TESTING
        setUser(null);
        setLoading(false); // ADDED: Set loading to false immediately
        return;
      }
      console.log('✅ USER AUTHENTICATED:', user.email);
      setUser(user);
    } catch (error) {
      console.error('❌ AUTH ERROR:', error);
      // router.push('/login'); // DISABLED FOR TESTING
      console.log('⚠️ AUTH ERROR - CONTINUING FOR TESTING');
      setUser(null);
    } finally {
      console.log('🏁 AUTH CHECK COMPLETE - SETTING LOADING TO FALSE');
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    console.log('📊 LOADING INITIAL DATA...');
    try {
      await Promise.all([
        loadScrapingStats(),
        loadRecommendations(),
        loadRecentContent()
      ]);
      console.log('✅ INITIAL DATA LOADED SUCCESSFULLY');
    } catch (error) {
      console.error('❌ ERROR LOADING INITIAL DATA:', error);
    }
  };

  const loadScrapingStats = async () => {
    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*');

      if (error) throw error;

      const total = data?.length || 0;
      const today = new Date().toISOString().split('T')[0];
      const todayCount = data?.filter(item => 
        item.created_at?.startsWith(today)
      ).length || 0;

      setScrapingStats({
        totalScraped: total,
        todayScraped: todayCount,
        activeSources: Math.floor(Math.random() * 10) + 5, // Mock data
        successRate: Math.floor(Math.random() * 20) + 80 // Mock data
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      // Simulate AI-powered recommendations
      const mockRecommendations = [
        {
          id: 1,
          title: "Advanced React Patterns for 2024",
          description: "Discover cutting-edge React patterns and best practices for building scalable applications",
          category: "webdev",
          source: "Medium",
          readTime: "8 min",
          popularity: 95,
          tags: ["React", "JavaScript", "Frontend"]
        },
        {
          id: 2,
          title: "Building AI-Powered Search with Vector Embeddings",
          description: "Learn how to implement semantic search using vector databases and embeddings",
          category: "ai",
          source: "Dev.to",
          readTime: "12 min",
          popularity: 92,
          tags: ["AI", "Vector Search", "Machine Learning"]
        },
        {
          id: 3,
          title: "The Future of Content Discovery",
          description: "Exploring next-generation content recommendation systems",
          category: "ai",
          source: "TechCrunch",
          readTime: "6 min",
          popularity: 88,
          tags: ["AI", "Recommendations", "Discovery"]
        },
        {
          id: 4,
          title: "Optimizing Database Performance at Scale",
          description: "Advanced techniques for database optimization in high-traffic applications",
          category: "data",
          source: "Engineering Blog",
          readTime: "15 min",
          popularity: 85,
          tags: ["Database", "Performance", "Scalability"]
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const loadRecentContent = async () => {
    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error loading recent content:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadRecentContent();
      return;
    }

    try {
      // Simulate semantic search
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const startScraping = async () => {
    setScrapingStatus('running');
    
    // Simulate scraping process
    setTimeout(() => {
      setScrapingStatus('completed');
      loadScrapingStats();
      loadRecentContent();
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return '#00ff88';
      case 'completed': return '#4ecdc4';
      case 'error': return '#ff6b6b';
      default: return '#e2e8f0';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏸️';
    }
  };

  if (loading) {
    console.log('⏳ RENDERING LOADING STATE');
    return (
      <Layout title="Enhanced Scraping Dashboard">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          color: '#ffffff'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 255, 136, 0.3)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>
            Loading Enhanced Scraping Dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  console.log('🎨 RENDERING MAIN DASHBOARD COMPONENT');
  console.log('📊 CURRENT STATE:', { user, loading, searchResults: searchResults.length, recommendations: recommendations.length });

  return (
    <Layout title="Enhanced Scraping Dashboard - AI Discovery Platform">
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh',
        padding: '2rem 0'
      }}>
        {/* Header Section */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                AI Discovery Platform
              </h1>
              <p style={{ color: '#e2e8f0', fontSize: '1.2rem' }}>
                Advanced content scraping and semantic discovery
              </p>
            </div>
            
            <button
              onClick={startScraping}
              disabled={scrapingStatus === 'running'}
              style={{
                padding: '1rem 2rem',
                background: scrapingStatus === 'running' 
                  ? 'rgba(0, 255, 136, 0.3)' 
                  : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: scrapingStatus === 'running' ? '#e2e8f0' : '#000',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: scrapingStatus === 'running' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {getStatusIcon(scrapingStatus)} 
              {scrapingStatus === 'running' ? 'Scraping...' : 'Start Scraping'}
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {[
              { label: 'Total Scraped', value: scrapingStats.totalScraped, icon: '📊', color: '#00ff88' },
              { label: 'Today', value: scrapingStats.todayScraped, icon: '📅', color: '#4ecdc4' },
              { label: 'Active Sources', value: scrapingStats.activeSources, icon: '🔗', color: '#45b7d1' },
              { label: 'Success Rate', value: `${scrapingStats.successRate}%`, icon: '✅', color: '#96ceb4' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '0.25rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#e2e8f0' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Search for content, topics, or keywords..."
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '1.1rem'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#e2e8f0',
                  fontSize: '1.2rem'
                }}>
                  🔍
                </div>
              </div>
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

          {/* Categories */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              Discover by Category
            </h2>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: selectedCategory === category.id 
                      ? category.color 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: selectedCategory === category.id ? '#000' : '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              🤖 AI-Powered Recommendations
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {recommendations.map((item) => (
                <div key={item.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.2rem',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      {item.title}
                    </h3>
                    <div style={{
                      background: 'rgba(0, 255, 136, 0.2)',
                      color: '#00ff88',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {item.popularity}% match
                    </div>
                  </div>
                  <p style={{
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#e2e8f0',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#e2e8f0',
                      fontSize: '0.9rem'
                    }}>
                      <span>⏱️ {item.readTime}</span>
                      <span>📰 {item.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Results */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#ffffff'
              }}>
                📚 Discovered Content ({searchResults.length})
              </h2>
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                {['grid', 'list', 'timeline'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: viewMode === mode 
                        ? '#00ff88' 
                        : 'rgba(255, 255, 255, 0.05)',
                      color: viewMode === mode ? '#000' : '#e2e8f0',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'block',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
              gap: '1.5rem'
            }}>
              {searchResults.map((item, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
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
                      New
                    </div>
                  </div>
                  <p style={{
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {item.description || 'Discover amazing content and insights from across the web.'}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#e2e8f0'
                  }}>
                    <span>📅 {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                    <span>🔗 Source</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}