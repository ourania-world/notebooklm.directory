import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/auth';
import { toggleSavedNotebook } from '../lib/profiles';

export default function ProjectCard({ notebook }) {
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Could trigger auth modal here
      return;
    }

    setLoading(true);
    try {
      const saved = await toggleSavedNotebook(user.id, notebook.id);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    'Academic': '#e3f2fd',
    'Business': '#f3e5f5',
    'Creative': '#fff3e0',
    'Research': '#e8f5e8',
    'Education': '#fce4ec',
    'Personal': '#f1f8e9'
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e9ecef',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-4px)';
      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
    }}>
      
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          background: categoryColors[notebook.category] || '#f8f9fa',
          color: '#495057',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {notebook.category}
        </span>
      </div>
      
      <h3 style={{ 
        margin: '0 0 0.75rem 0', 
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#212529'
      }}>
        {notebook.title}
      </h3>
      
      <p style={{ 
        color: '#6c757d', 
        lineHeight: '1.5',
        margin: '0 0 1rem 0',
        flex: 1
      }}>
        {notebook.description}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {notebook.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} style={{
              background: '#f8f9fa',
              color: '#6c757d',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user && (
            <button
              onClick={handleSaveToggle}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem',
                opacity: loading ? 0.5 : 1
              }}
              title={isSaved ? 'Unsave notebook' : 'Save notebook'}
            >
              {isSaved ? '💾' : '🤍'}
            </button>
          )}
          <div style={{ 
            color: '#28a745', 
            fontWeight: '500',
            fontSize: '0.875rem'
          }}>
            <a 
              href={notebook.notebook_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              View Notebook →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}