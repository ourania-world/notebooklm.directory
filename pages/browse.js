import { useState } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { sampleProjects, categories } from '../data/sampleProjects';

export default function Browse() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = sampleProjects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.name}
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
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>
        
        {/* Projects Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2rem'
        }}>
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
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