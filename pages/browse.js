import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import NotebookModal from '../components/NotebookModal';
import { getCurrentUser } from '../lib/supabase';
import { getNotebooks, getCategoryCounts } from '../lib/notebooks';

export async function getServerSideProps(context) {
  try {
    const { category = 'All', search = '' } = context.query;
    
    // Fetch notebooks and category counts on server side
    const [notebooksData, countsData] = await Promise.all([
      getNotebooks({ 
        category: category !== 'All' ? category : undefined, 
        search: search || undefined 
      }),
      getCategoryCounts()
    ]);
    
    return {
      props: {
        initialNotebooks: notebooksData || [],
        initialCategoryCounts: countsData || {},
        initialCategory: category,
        initialSearch: search
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialNotebooks: [],
        initialCategoryCounts: {},
        initialCategory: 'All',
        initialSearch: ''
      }
    };
  }
}

export default function Browse({ 
  initialNotebooks, 
  initialCategoryCounts, 
  initialCategory, 
  initialSearch 
}) {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [notebooks, setNotebooks] = useState(initialNotebooks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState(initialCategoryCounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { name: "Academic", description: "Research papers, thesis work, academic analysis" },
    { name: "Business", description: "Market research, business strategy, competitive analysis" },
    { name: "Creative", description: "Writing, art analysis, creative projects" },
    { name: "Research", description: "Scientific studies, data analysis, research synthesis" },
    { name: "Education", description: "Curriculum design, learning materials, educational research" },
    { name: "Personal", description: "Personal projects, hobby research, self-improvement" }
  ];

  useEffect(() => {
    // Get current user
    getCurrentUser()
      .then(setUser)
      .catch(error => {
        console.warn('Failed to get user:', error);
        setUser(null);
      });
  }, []);

  // Handle filter changes with client-side updates
  useEffect(() => {
    if (selectedCategory !== initialCategory || searchTerm !== initialSearch) {
      const fetchFilteredData = async () => {
        try {
          setLoading(true);
          const [notebooksData, countsData] = await Promise.all([
            getNotebooks({ 
              category: selectedCategory !== 'All' ? selectedCategory : undefined, 
              search: searchTerm || undefined 
            }),
            getCategoryCounts()
          ]);
          setNotebooks(notebooksData);
          setCategoryCounts(countsData);
        } catch (err) {
          console.error('Error fetching filtered data:', err);
          setError('Failed to load notebooks');
        } finally {
          setLoading(false);
        }
      };

      fetchFilteredData();
    }
  }, [selectedCategory, searchTerm, initialCategory, initialSearch]);

  const handleNotebookCreated = (newNotebook) => {
    // Add the new notebook to the list and refresh data
    setNotebooks(prev => [newNotebook, ...prev]);
    // Optionally refresh category counts
    getCategoryCounts().then(setCategoryCounts);
  };

  // Sort notebooks when sort option changes
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  // Toggle view mode between grid and list
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <Layout title="Browse Projects - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#ffffff'
        }}>
          Browse Projects
        </h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div></div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            + Connect New Notebook
          </button>
        </div>
        
        {/* Search and Filter */}
        <div style={{
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '1rem',
              minWidth: '300px',
              flex: 1
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white'
            }}
          >
            {categories.map(category => {
              const count = categoryCounts[category.name] || 0;
              return (
                <option key={category.name} value={category.name}>
                  {category.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
        
        {/* Results Count */}
        <p style={{
          color: '#e2e8f0', 
          margin: '0 0 1rem 0',
          fontSize: '1rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => handleSortChange('recent')}
              style={{
                background: sortBy === 'recent' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                color: sortBy === 'recent' ? '#00ff88' : '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Recent
            </button>
            <button
              onClick={() => handleSortChange('popular')}
              style={{
                background: sortBy === 'popular' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                color: sortBy === 'popular' ? '#00ff88' : '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Most Viewed
            </button>
            <button
              onClick={() => handleSortChange('saves')}
              style={{
                background: sortBy === 'saves' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                color: sortBy === 'saves' ? '#00ff88' : '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Most Saved
            </button>
            
            {/* View Mode Toggle */}
            <button
              onClick={toggleViewMode}
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {viewMode === 'grid' ? '📋 List View' : '📊 Grid View'}
            </button>
          </div>
        </p>
        
        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#e2e8f0' }}>Loading notebooks...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
            <p>{error}</p>
          </div>
        ) : notebooks.length > 0 ? (
          viewMode === 'grid' ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '2rem',
              className: 'glass-card'
            }}>
              {notebooks.map(notebook => (
                <ProjectCard key={notebook.id} notebook={notebook} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notebooks.map(notebook => (
                <div 
                  key={notebook.id}
                  className="card-hover"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    padding: '1.5rem'
                  }}
                  onClick={() => window.location.href = `/notebook/${notebook.id}`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        background: 'rgba(0, 0, 0, 0.7)', 
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        color: '#00ff88',
                        fontWeight: '600'
                      }}>
                        {notebook.category}
                      </span>
                      {notebook.featured && (
                        <span style={{
                          background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',  
                          boxShadow: '0 2px 8px rgba(0, 255, 136, 0.3)',
                          color: '#0a0a0a',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '700',
                      color: '#ffffff', 
                      margin: '0 0 0.75rem 0', 
                      lineHeight: '1.3'
                    }}>
                      {notebook.title}
                    </h3>
                    
                    <p style={{ 
                      color: 'rgba(226, 232, 240, 0.9)', 
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      margin: '0 0 1rem 0'
                    }}>
                      {notebook.description.length > 200 
                        ? `${notebook.description.substring(0, 200)}...` 
                        : notebook.description}
                    </p>
                    
                    {notebook.tags && notebook.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem', 
                        marginBottom: '1rem'
                      }}> 
                        {notebook.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            style={{
                              background: 'rgba(0, 255, 136, 0.1)',
                              color: '#00ff88',
                              padding: '0.25rem 0.75rem', 
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {notebook.tags.length > 3 && (
                          <span style={{
                            color: '#e2e8f0',
                            fontSize: '0.7rem',
                            padding: '0.25rem 0'
                          }}>
                            +{notebook.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    minWidth: '200px'
                  }}>
                    <div style={{ 
                      color: '#ffffff', 
                      fontWeight: '600', 
                      fontSize: '0.9rem',
                      textAlign: 'right'
                    }}>
                      {notebook.author}
                      {notebook.institution && ( 
                        <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                          {notebook.institution}
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex',  
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: '#e2e8f0',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>👁️</span>
                        <span>{notebook.view_count || 0}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',  
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: '#e2e8f0',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>❤️</span>
                        <span>{notebook.save_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 0',
            color: '#e2e8f0'
          }}>
            <h3>No projects found</h3>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>

      <NotebookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNotebookCreated={handleNotebookCreated}
      />
    </Layout>
  );
}