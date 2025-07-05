import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { getNotebooks, getCategoryCounts } from '../lib/notebooks';

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});

  const categories = [
    { name: "Academic", description: "Research papers, thesis work, academic analysis" },
    { name: "Business", description: "Market research, business strategy, competitive analysis" },
    { name: "Creative", description: "Writing, art analysis, creative projects" },
    { name: "Research", description: "Scientific studies, data analysis, research synthesis" },
    { name: "Education", description: "Curriculum design, learning materials, educational research" },
    { name: "Personal", description: "Personal projects, hobby research, self-improvement" }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [notebooksData, countsData] = await Promise.all([
          getNotebooks({ category: selectedCategory, search: searchTerm }),
          getCategoryCounts()
        ]);
        setNotebooks(notebooksData);
        setCategoryCounts(countsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load notebooks');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCategory, searchTerm]);

  return (
    <Layout title="Browse Projects - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#212529'
        }}>
          Browse Projects
        </h1>
        
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
              </option>
            ))}
          </select>
        </div>
        
        {/* Results Count */}
        <p style={{ 
          color: '#6c757d', 
          margin: '0 0 2rem 0',
          fontSize: '1rem'
        }}>
          Showing {notebooks.length} project{notebooks.length !== 1 ? 's' : ''}
        </p>
        
        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading notebooks...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#dc3545' }}>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '2rem'
          }}>
            {notebooks.map(notebook => (
              <ProjectCard key={notebook.id} notebook={notebook} />
            ))}
          </div>
        )}
        
        {!loading && !error && notebooks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 0',
            color: '#6c757d'
          }}>
            <h3>No projects found</h3>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}