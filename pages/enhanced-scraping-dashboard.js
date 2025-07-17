import { useState, useEffect, useRef } from 'react';
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
  const [activeScrapeJobs, setActiveScrapeJobs] = useState([]);
  const [scrapeProgress, setScrapeProgress] = useState({});
  const [selectedSources, setSelectedSources] = useState(['notebooklm', 'reddit', 'github']);
  const [scrapeConfig, setScrapeConfig] = useState({
    maxConcurrency: 5,
    respectRateLimit: true,
    enableDeepScraping: false,
    qualityFilter: 'medium'
  });
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const wsRef = useRef(null);
  
  useEffect(() => {
    console.log('🔧 USE EFFECT TRIGGERED - CHECKING AUTH AND LOADING DATA');
    
    // Set a maximum loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ LOADING TIMEOUT - Force completing after 10 seconds');
      setLoading(false);
    }, 10000);
    
    const initialize = async () => {
      try {
        await checkAuth();
        
        // Set loading to false first, then load data in background
        setLoading(false);
        
        // Load data in background (don't block UI)
        Promise.all([
          loadInitialData(),
          loadActiveScrapeJobs()
        ]).catch(error => {
          console.error('❌ Background data loading error:', error);
        });
        
        // Initialize WebSocket for real-time updates
        if (realTimeUpdates) {
          initializeWebSocket();
        }
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setLoading(false);
      }
    };
    
    initialize();
    
    // Cleanup on unmount
    return () => {
      clearTimeout(loadingTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // Empty dependency array - run only once on mount
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  const [filters, setFilters] = useState({
    dateRange: 'all',
    source: 'all',
    contentType: 'all'
  });

  // Content sources for multi-source scraping
  const scrapingSources = [
    { id: 'notebooklm', name: 'NotebookLM', icon: '📓', color: '#00ff88', status: 'active', lastRun: '2 min ago' },
    { id: 'reddit', name: 'Reddit', icon: '🔴', color: '#ff6b6b', status: 'active', lastRun: '5 min ago' },
    { id: 'github', name: 'GitHub', icon: '⚫', color: '#4ecdc4', status: 'active', lastRun: '1 min ago' },
    { id: 'arxiv', name: 'ArXiv', icon: '📚', color: '#45b7d1', status: 'idle', lastRun: '1 hour ago' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: '#96ceb4', status: 'error', lastRun: '3 hours ago' },
    { id: 'hackernews', name: 'Hacker News', icon: '🧡', color: '#feca57', status: 'active', lastRun: '30 sec ago' },
    { id: 'medium', name: 'Medium', icon: '✍️', color: '#ff9ff3', status: 'idle', lastRun: '45 min ago' },
    { id: 'devto', name: 'Dev.to', icon: '💻', color: '#54a0ff', status: 'active', lastRun: '1 min ago' }
  ];

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


  const checkAuth = async () => {
    console.log('🔐 CHECKING AUTHENTICATION...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 USER CHECK RESULT:', user ? 'User found' : 'No user');
      if (!user) {
        console.log('⚠️ NO USER FOUND - CONTINUING FOR TESTING (AUTH DISABLED)');
        setUser(null);
        return;
      }
      console.log('✅ USER AUTHENTICATED:', user.email);
      setUser(user);
    } catch (error) {
      console.error('❌ AUTH ERROR:', error);
      console.log('⚠️ AUTH ERROR - CONTINUING FOR TESTING');
      setUser(null);
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
      // Enhanced AI-powered recommendations with enterprise features
      const mockRecommendations = [
        {
          id: 1,
          title: "Advanced React Patterns for 2024",
          description: "Discover cutting-edge React patterns and best practices for building scalable applications with modern hooks and state management",
          category: "webdev",
          source: "Medium",
          sourceUrl: "https://medium.com/example",
          readTime: "8 min",
          popularity: 95,
          qualityScore: 0.92,
          embeddingScore: 0.87,
          tags: ["React", "JavaScript", "Frontend", "Hooks", "Performance"],
          discoveredAt: new Date().toISOString(),
          contentType: "article",
          sentiment: "positive",
          expertise: "advanced"
        },
        {
          id: 2,
          title: "Building AI-Powered Search with Vector Embeddings",
          description: "Learn how to implement semantic search using vector databases, embeddings, and hybrid search techniques for enterprise applications",
          category: "ai",
          source: "Dev.to",
          sourceUrl: "https://dev.to/example",
          readTime: "12 min",
          popularity: 92,
          qualityScore: 0.89,
          embeddingScore: 0.91,
          tags: ["AI", "Vector Search", "Machine Learning", "Embeddings", "Supabase"],
          discoveredAt: new Date(Date.now() - 1800000).toISOString(),
          contentType: "tutorial",
          sentiment: "neutral",
          expertise: "intermediate"
        },
        {
          id: 3,
          title: "The Future of Content Discovery: Serendipitous AI",
          description: "Exploring next-generation content recommendation systems that balance relevance with serendipitous discovery",
          category: "ai",
          source: "TechCrunch",
          sourceUrl: "https://techcrunch.com/example",
          readTime: "6 min",
          popularity: 88,
          qualityScore: 0.85,
          embeddingScore: 0.83,
          tags: ["AI", "Recommendations", "Discovery", "Algorithms"],
          discoveredAt: new Date(Date.now() - 3600000).toISOString(),
          contentType: "analysis",
          sentiment: "positive",
          expertise: "beginner"
        },
        {
          id: 4,
          title: "Distributed Systems: Optimizing Database Performance at Web Scale",
          description: "Advanced techniques for database optimization, sharding, and performance tuning in high-traffic applications",
          category: "data",
          source: "Engineering Blog",
          sourceUrl: "https://engineering.example.com",
          readTime: "15 min",
          popularity: 85,
          qualityScore: 0.94,
          embeddingScore: 0.79,
          tags: ["Database", "Performance", "Scalability", "Distributed Systems", "PostgreSQL"],
          discoveredAt: new Date(Date.now() - 7200000).toISOString(),
          contentType: "technical",
          sentiment: "neutral",
          expertise: "advanced"
        },
        {
          id: 5,
          title: "Real-time Data Processing with Apache Kafka and Node.js",
          description: "Building robust real-time data pipelines using Kafka, microservices, and event-driven architectures",
          category: "data",
          source: "GitHub",
          sourceUrl: "https://github.com/example/kafka-tutorial",
          readTime: "20 min",
          popularity: 78,
          qualityScore: 0.88,
          embeddingScore: 0.85,
          tags: ["Kafka", "Node.js", "Real-time", "Microservices", "Event Streaming"],
          discoveredAt: new Date(Date.now() - 10800000).toISOString(),
          contentType: "repository",
          sentiment: "positive",
          expertise: "intermediate"
        },
        {
          id: 6,
          title: "Multi-modal AI: Combining Text, Images, and Audio Processing",
          description: "Comprehensive guide to building multi-modal AI systems that process diverse data types for enhanced understanding",
          category: "ai",
          source: "ArXiv",
          sourceUrl: "https://arxiv.org/abs/example",
          readTime: "25 min",
          popularity: 91,
          qualityScore: 0.96,
          embeddingScore: 0.93,
          tags: ["Multi-modal AI", "Computer Vision", "NLP", "Deep Learning", "Neural Networks"],
          discoveredAt: new Date(Date.now() - 14400000).toISOString(),
          contentType: "paper",
          sentiment: "neutral",
          expertise: "advanced"
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
    console.log('🔍 EXECUTING ENHANCED SEARCH:', query);
    
    if (!query.trim()) {
      loadRecentContent();
      return;
    }

    try {
      // Use the new enhanced search API
      const response = await fetch('/api/enhanced-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          limit: 20,
          category: selectedCategory === 'all' ? null : selectedCategory
        })
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Combine API results with AI recommendations for enhanced display
        const searchTerm = query.toLowerCase();
        const semanticResults = recommendations.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        ).map(item => ({
          ...item,
          id: `rec-${item.id}`,
          title: item.title,
          description: item.description,
          created_at: item.discoveredAt,
          source_type: item.source.toLowerCase(),
          quality_score: item.qualityScore,
          embedding_score: item.embeddingScore,
          content_type: item.contentType,
          tags: item.tags,
          expertise_level: item.expertise
        }));
        
        // Combine results
        const combinedResults = [
          ...semanticResults,
          ...data.results
        ].sort((a, b) => {
          const scoreA = (a.quality_score || 0.5) * (a.embedding_score || 0.5);
          const scoreB = (b.quality_score || 0.5) * (b.embedding_score || 0.5);
          return scoreB - scoreA;
        });
        
        setSearchResults(combinedResults);
        console.log(`✅ Found ${combinedResults.length} results for "${query}"`);
      } else {
        throw new Error(data.error || 'Search failed');
      }
      
    } catch (error) {
      console.error('❌ Enhanced search error:', error);
      // Fallback to basic database search
      try {
        const { data: dbResults, error: dbError } = await supabase
          .from('notebooks')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (dbError) {
          console.warn('Fallback search error:', dbError);
          setSearchResults([]);
        } else {
          setSearchResults(dbResults || []);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback search failed:', fallbackError);
        setSearchResults([]);
      }
    }
  };

  // Initialize WebSocket for real-time updates
  const initializeWebSocket = () => {
    console.log('🔌 WEBSOCKET DISABLED FOR TESTING');
    // WebSocket disabled to prevent connection issues during testing
    // TODO: Re-enable when WebSocket server is available
  };
  
  // Handle real-time updates from WebSocket
  const handleRealTimeUpdate = (data) => {
    console.log('📡 REAL-TIME UPDATE:', data);
    
    switch (data.type) {
      case 'scrape_started':
        setActiveScrapeJobs(prev => [...prev, data.job]);
        break;
      case 'scrape_progress':
        setScrapeProgress(prev => ({...prev, [data.jobId]: data.progress}));
        break;
      case 'scrape_completed':
        setActiveScrapeJobs(prev => prev.filter(job => job.id !== data.jobId));
        loadScrapingStats();
        loadRecentContent();
        break;
      case 'new_content':
        // Add new content to search results if it matches current filters
        if (data.content && (!selectedCategory || selectedCategory === 'all' || data.content.category === selectedCategory)) {
          setSearchResults(prev => [data.content, ...prev.slice(0, 19)]);
        }
        break;
      default:
        console.log('Unknown update type:', data.type);
    }
  };
  
  // Load active scraping jobs
  const loadActiveScrapeJobs = async () => {
    try {
      // Simulate API call to get active jobs
      const mockJobs = [
        { id: 'job-1', source: 'reddit', status: 'running', progress: 65, startTime: Date.now() - 120000 },
        { id: 'job-2', source: 'github', status: 'running', progress: 23, startTime: Date.now() - 45000 }
      ];
      setActiveScrapeJobs(mockJobs);
    } catch (error) {
      console.error('Error loading active jobs:', error);
    }
  };
  
  // Start comprehensive multi-source scraping
  const startAdvancedScraping = async () => {
    console.log('🚀 STARTING ADVANCED MULTI-SOURCE SCRAPING');
    setScrapingStatus('running');
    
    try {
      // Start scraping for each selected source
      for (const sourceId of selectedSources) {
        const source = scrapingSources.find(s => s.id === sourceId);
        if (source) {
          await startSourceScraping(source);
        }
      }
    } catch (error) {
      console.error('Error starting scraping:', error);
      setScrapingStatus('error');
    }
  };
  
  // Start scraping for a specific source
  const startSourceScraping = async (source) => {
    console.log(`🌐 Starting ${source.name} scraping...`);
    
    try {
      const response = await fetch('/api/start-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: source.id,
          config: scrapeConfig
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to start ${source.name} scraping`);
      }
      
      const result = await response.json();
      console.log(`✅ ${source.name} scraping started:`, result);
      
    } catch (error) {
      console.error(`❌ Error starting ${source.name} scraping:`, error);
      // Continue with other sources even if one fails
    }
  };
  
  // Stop all active scraping
  const stopAllScraping = async () => {
    console.log('⏹️ STOPPING ALL SCRAPING');
    setScrapingStatus('idle');
    
    try {
      await fetch('/api/stop-scraping', { method: 'POST' });
      setActiveScrapeJobs([]);
      setScrapeProgress({});
    } catch (error) {
      console.error('Error stopping scraping:', error);
    }
  };
  
  // Legacy function for backward compatibility
  const startScraping = startAdvancedScraping;

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
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'system-ui'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(0, 255, 136, 0.3)',
          borderTop: '4px solid #00ff88',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Loading Enhanced Scraping Dashboard...
        </div>
        <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
          Debug: Loading state active
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  console.log('🎨 RENDERING MAIN DASHBOARD COMPONENT');
  console.log('📊 CURRENT STATE:', { user, loading, searchResults: searchResults.length, recommendations: recommendations.length });

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .enhanced-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 255, 136, 0.2);
        }
        
        .source-card:hover {
          transform: scale(1.02);
          border-color: rgba(0, 255, 136, 0.5);
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          background: #00ff88;
        }
        
        input[type="range"]::-moz-range-thumb {
          background: #00ff88;
          border: none;
        }
      `}</style>
      
      <Layout title="Enhanced Scraping Dashboard - AI Discovery Platform">
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh',
        padding: '2rem 0'
      }}>
        {/* Header Section */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          
          {/* Real-time Control Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: realTimeUpdates ? '#00ff88' : '#e2e8f0',
                animation: realTimeUpdates ? 'pulse 2s infinite' : 'none'
              }} />
              <span style={{ color: '#ffffff', fontWeight: '500' }}>
                Real-time Updates: {realTimeUpdates ? 'ON' : 'OFF'}
              </span>
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Toggle
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                Active Jobs: {activeScrapeJobs.length}
              </span>
              {activeScrapeJobs.length > 0 && (
                <button
                  onClick={stopAllScraping}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Stop All
                </button>
              )}
            </div>
          </div>
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
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={startAdvancedScraping}
                disabled={scrapingStatus === 'running' || selectedSources.length === 0}
                style={{
                  padding: '1rem 2rem',
                  background: scrapingStatus === 'running' 
                    ? 'rgba(0, 255, 136, 0.3)' 
                    : selectedSources.length === 0
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: scrapingStatus === 'running' || selectedSources.length === 0 ? '#e2e8f0' : '#000',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: (scrapingStatus === 'running' || selectedSources.length === 0) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {getStatusIcon(scrapingStatus)} 
                {scrapingStatus === 'running' 
                  ? `Scraping ${selectedSources.length} sources...` 
                  : selectedSources.length === 0
                  ? 'Select Sources to Start'
                  : `Start Multi-Source Scraping (${selectedSources.length})`}
              </button>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Quality:</label>
                <select
                  value={scrapeConfig.qualityFilter}
                  onChange={(e) => setScrapeConfig({...scrapeConfig, qualityFilter: e.target.value})}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Concurrency:</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scrapeConfig.maxConcurrency}
                  onChange={(e) => setScrapeConfig({...scrapeConfig, maxConcurrency: parseInt(e.target.value)})}
                  style={{
                    accentColor: '#00ff88'
                  }}
                />
                <span style={{ color: '#00ff88', fontSize: '0.9rem', minWidth: '20px' }}>
                  {scrapeConfig.maxConcurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Source Scraping Sources */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              🌐 Content Sources
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {scrapingSources.map((source) => {
                const isSelected = selectedSources.includes(source.id);
                const isActive = activeScrapeJobs.some(job => job.source === source.id);
                const progress = scrapeProgress[source.id] || 0;
                
                return (
                  <div key={source.id} style={{
                    background: isSelected ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: `1px solid ${isSelected ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  className="source-card"
                  >
                    {/* Progress bar for active sources */}
                    {isActive && progress > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '4px',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #00ff88 0%, #00e67a 100%)',
                        borderRadius: '0 0 12px 12px',
                        transition: 'width 0.3s ease'
                      }} />
                    )}
                    
                    <div onClick={() => {
                      if (isSelected) {
                        setSelectedSources(prev => prev.filter(id => id !== source.id));
                      } else {
                        setSelectedSources(prev => [...prev, source.id]);
                      }
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{source.icon}</span>
                          <h3 style={{
                            fontSize: '1.1rem',
                            color: '#ffffff',
                            margin: 0
                          }}>
                            {source.name}
                          </h3>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {isActive && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#00ff88',
                              animation: 'pulse 1s infinite'
                            }} />
                          )}
                          <div style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            background: {
                              'active': 'rgba(0, 255, 136, 0.2)',
                              'idle': 'rgba(226, 232, 240, 0.2)',
                              'error': 'rgba(255, 107, 107, 0.2)'
                            }[source.status],
                            color: {
                              'active': '#00ff88',
                              'idle': '#e2e8f0',
                              'error': '#ff6b6b'
                            }[source.status]
                          }}>
                            {source.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                        color: '#e2e8f0'
                      }}>
                        <span>Last run: {source.lastRun}</span>
                        {isActive && progress > 0 && (
                          <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                            {progress}% complete
                          </span>
                        )}
                        {isSelected && (
                          <span style={{ color: '#00ff88' }}>✓ Selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Active Jobs Monitor */}
          {activeScrapeJobs.length > 0 && (
            <div style={{
              background: 'rgba(0, 255, 136, 0.05)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '3rem',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#ffffff',
                marginBottom: '1.5rem'
              }}>
                🔄 Active Scraping Jobs
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                {activeScrapeJobs.map((job) => {
                  const source = scrapingSources.find(s => s.id === job.source);
                  const progress = scrapeProgress[job.id] || job.progress || 0;
                  const elapsed = Math.floor((Date.now() - job.startTime) / 1000);
                  
                  return (
                    <div key={job.id} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{source?.icon || '🌐'}</span>
                          <span style={{ color: '#ffffff', fontWeight: '500' }}>
                            {source?.name || job.source}
                          </span>
                        </div>
                        <div style={{
                          background: 'rgba(0, 255, 136, 0.2)',
                          color: '#00ff88',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {progress}%
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        height: '8px',
                        marginBottom: '1rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, #00ff88 0%, #00e67a 100%)',
                          borderRadius: '8px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        color: '#e2e8f0'
                      }}>
                        <span>Elapsed: {elapsed}s</span>
                        <span>Status: {job.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
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
              {recommendations.map((item, index) => {
                const expertiseColor = {
                  'beginner': '#96ceb4',
                  'intermediate': '#45b7d1', 
                  'advanced': '#ff6b6b'
                }[item.expertise];
                
                const sentimentColor = {
                  'positive': '#00ff88',
                  'neutral': '#e2e8f0',
                  'negative': '#ff6b6b'
                }[item.sentiment];
                
                return (
                <div key={item.id} className="enhanced-card" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                }}>
                  {/* Quality indicators */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      background: 'rgba(0, 255, 136, 0.2)',
                      color: '#00ff88',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      Q: {Math.round(item.qualityScore * 100)}%
                    </div>
                    <div style={{
                      background: `rgba(${expertiseColor.slice(1, 3) === 'ff' ? '255' : '0'}, ${expertiseColor.slice(3, 5) === 'ff' ? '255' : '0'}, ${expertiseColor.slice(5, 7) === 'ff' ? '255' : '0'}, 0.2)`,
                      color: expertiseColor,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {item.expertise.toUpperCase()}
                    </div>
                  </div>
                  
                  <div style={{
                    marginBottom: '1rem',
                    paddingRight: '6rem' // Space for indicators
                  }}>
                    <h3 style={{
                      fontSize: '1.2rem',
                      color: '#ffffff',
                      margin: '0 0 0.5rem 0',
                      lineHeight: '1.3'
                    }}>
                      {item.title}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.75rem'
                    }}>
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
                      
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#e2e8f0',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem'
                      }}>
                        {item.contentType}
                      </div>
                      
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: sentimentColor
                      }} />
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
                    alignItems: 'flex-end'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      flex: 1
                    }}>
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#e2e8f0',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(0, 255, 136, 0.2)';
                          e.target.style.color = '#00ff88';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#e2e8f0';
                        }}
                        onClick={() => setSearchQuery(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span style={{
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          opacity: 0.7
                        }}>
                          +{item.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      color: '#e2e8f0',
                      fontSize: '0.85rem',
                      marginLeft: '1rem'
                    }}>
                      <span>⏱️ {item.readTime}</span>
                      <span>📰 {item.source}</span>
                      <span style={{ color: '#00ff88' }}>
                        🔗 View
                      </span>
                    </div>
                  </div>
                  
                  {/* Embedding similarity indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: `${item.embeddingScore * 100}%`,
                    background: 'linear-gradient(90deg, #00ff88 0%, #00e67a 100%)',
                    borderRadius: '0 0 16px 16px'
                  }} />
                </div>
              );})}
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
                <div 
                  key={index} 
                  onClick={() => {
                    if (item.url) {
                      window.open(item.url, '_blank');
                    } else if (item.id) {
                      window.open(`/notebook/${item.id}`, '_blank');
                    } else {
                      console.log('📋 Item details:', item);
                    }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'translateY(0)';
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
    </>
  );
}