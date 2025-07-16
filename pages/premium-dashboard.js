import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../lib/supabase';
import { getUserSubscription } from '../lib/subscriptions';
import { getNotebooks } from '../lib/notebooks';
import Link from 'next/link';

export default function PremiumDashboard() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('view_count');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = [
    'All', 'Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal'
  ];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login?redirect=/premium-dashboard';
          return;
        }
        setUser(currentUser);
        
        // Check subscription
        const userSubscription = await getUserSubscription(currentUser.id);
        setSubscription(userSubscription);
        
        // Check if user has premium access
        const hasPremiumAccess = userSubscription?.subscription_plans?.limits?.premiumContent === true;
        if (!hasPremiumAccess) {
          window.location.href = '/pricing?redirect=/premium-dashboard';
          return;
        }
        
        // Load notebooks
        const allNotebooks = await getNotebooks();
        setNotebooks(allNotebooks || []);
      } catch (err) {
        console.error('Error loading premium dashboard:', err);
        setError('Failed to load premium dashboard data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Filter and sort notebooks
  const filteredNotebooks = notebooks.filter(notebook => {
    // Category filter
    if (selectedCategory !== 'All' && notebook.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notebook.title.toLowerCase().includes(searchLower) ||
        notebook.description.toLowerCase().includes(searchLower) ||
        notebook.author.toLowerCase().includes(searchLower) ||
        (notebook.tags && notebook.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected field
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredNotebooks.length / itemsPerPage);
  const paginatedNotebooks = filteredNotebooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Title', 'Author', 'Category', 'Views', 'Saves', 'Institution', 'Tags'];
    const csvData = filteredNotebooks.map(notebook => [
      notebook.title,
      notebook.author,
      notebook.category,
      notebook.view_count || 0,
      notebook.save_count || 0,
      notebook.institution || '',
      (notebook.tags || []).join(', ')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'notebooks_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Layout title="Premium Dashboard - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 2rem 0',
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Premium <span style={{ color: '#00ff88' }}>Dashboard</span>
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
      <Layout title="Premium Dashboard - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 2rem 0',
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Premium <span style={{ color: '#00ff88' }}>Dashboard</span>
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
    <Layout title="Premium Dashboard - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: 0,
            color: '#ffffff',
            fontWeight: '700'
          }}>
            Premium <span style={{ color: '#00ff88' }}>Dashboard</span>
          </h1>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={exportToCSV}
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}
            >
              📊 Export to CSV
            </button>
            
            <Link href="/submit" style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              + Submit Notebook
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notebooks..."
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
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category} style={{ background: '#1a1a2e' }}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                <option value="view_count" style={{ background: '#1a1a2e' }}>Views</option>
                <option value="save_count" style={{ background: '#1a1a2e' }}>Saves</option>
                <option value="created_at" style={{ background: '#1a1a2e' }}>Date Added</option>
                <option value="title" style={{ background: '#1a1a2e' }}>Title</option>
                <option value="author" style={{ background: '#1a1a2e' }}>Author</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                <option value="desc" style={{ background: '#1a1a2e' }}>Descending</option>
                <option value="asc" style={{ background: '#1a1a2e' }}>Ascending</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Items Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
              >
                <option value={10} style={{ background: '#1a1a2e' }}>10</option>
                <option value={25} style={{ background: '#1a1a2e' }}>25</option>
                <option value={50} style={{ background: '#1a1a2e' }}>50</option>
                <option value={100} style={{ background: '#1a1a2e' }}>100</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          color: '#e2e8f0'
        }}>
          <div>
            Showing {paginatedNotebooks.length} of {filteredNotebooks.length} notebooks
          </div>
          <div>
            Page {currentPage} of {totalPages || 1}
          </div>
        </div>
        
        {/* Notebooks Table */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          overflowX: 'auto'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            color: '#ffffff'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Title
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Author
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Category
                </th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Views
                </th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Saves
                </th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotebooks.length > 0 ? (
                paginatedNotebooks.map(notebook => (
                  <tr key={notebook.id} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{notebook.title}</div>
                      <div style={{ 
                        color: '#e2e8f0', 
                        fontSize: '0.8rem',
                        marginTop: '0.25rem',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {notebook.tags && notebook.tags.map(tag => (
                          <span key={tag} style={{
                            background: 'rgba(0, 255, 136, 0.1)',
                            color: '#00ff88',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{notebook.author}</div>
                      {notebook.institution && (
                        <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                          {notebook.institution}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {notebook.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ color: '#00ff88', fontWeight: '600' }}>
                        {notebook.view_count || 0}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ color: '#00ff88', fontWeight: '600' }}>
                        {notebook.save_count || 0}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <Link href={`/notebook/${notebook.id}`} style={{
                          background: 'rgba(0, 255, 136, 0.1)',
                          color: '#00ff88',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          textDecoration: 'none'
                        }}>
                          👁️
                        </Link>
                        <a href={notebook.notebook_url} target="_blank" rel="noopener noreferrer" style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          textDecoration: 'none'
                        }}>
                          🔗
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#e2e8f0' }}>
                    No notebooks found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.5rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              ⟪
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              ⟨
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show current page, first, last, and pages around current
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      background: currentPage === pageNum ? 
                        'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' : 
                        'rgba(255, 255, 255, 0.1)',
                      color: currentPage === pageNum ? '#0a0a0a' : '#ffffff',
                      border: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      minWidth: '32px'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && currentPage > 4) ||
                (pageNum === totalPages - 1 && currentPage < totalPages - 3)
              ) {
                // Show ellipsis
                return (
                  <span key={pageNum} style={{
                    padding: '0.5rem 0.25rem',
                    color: '#e2e8f0'
                  }}>
                    ...
                  </span>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              ⟩
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              ⟫
            </button>
          </div>
        )}
        
        {/* Premium Features */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)',
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
            Premium Features
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '0.5rem' }}>
                Advanced Filtering
              </h3>
              <p style={{ color: '#e2e8f0', margin: 0 }}>
                Filter by multiple criteria, search across all fields, and save your custom filters.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '0.5rem' }}>
                Data Export
              </h3>
              <p style={{ color: '#e2e8f0', margin: 0 }}>
                Export your filtered results to CSV for further analysis and reporting.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔄</div>
              <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '0.5rem' }}>
                Bulk Actions
              </h3>
              <p style={{ color: '#e2e8f0', margin: 0 }}>
                Save multiple notebooks at once, share collections, and manage your library efficiently.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧠</div>
              <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '0.5rem' }}>
                AI Recommendations
              </h3>
              <p style={{ color: '#e2e8f0', margin: 0 }}>
                Get personalized notebook recommendations based on your interests and activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}