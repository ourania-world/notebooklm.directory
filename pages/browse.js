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
        console.warn('Failed to get user:', error)
        setUser(null)
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
            <option value="All">All Categories</option>
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
          margin: '0 0 2rem 0',
          fontSize: '1rem'
        }}>
          Showing {notebooks.length} project{notebooks.length !== 1 ? 's' : ''}
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '2rem'
          }}>
            {notebooks.map(notebook => (
              <ProjectCard key={notebook.id} notebook={notebook} />
            ))}
          </div> 
        ) : null}

        {!loading && !error && notebooks.length === 0 && (
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