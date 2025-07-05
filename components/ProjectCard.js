import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import { getCurrentUser } from '../lib/auth';
import { toggleSavedNotebook } from '../lib/profiles';

export default function ProjectCard({ notebook }) {
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(error => {
        console.warn('Failed to get user:', error)
        setUser(null)
      });
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
      background: '#1a2332',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #2a3441',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-4px)';
      e.target.style.borderColor = '#00ff88';
      e.target.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.borderColor = '#2a3441';
      e.target.style.boxShadow = 'none';
    }}>
      
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          background: '#00ff88',
          color: '#0a0e1a',
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
        color: '#ffffff'
      }}>
        {notebook.title}
      </h3>
      
      <p style={{ 
        color: '#a0aec0', 
        lineHeight: '1.5',
        margin: '0 0 1rem 0',
        flex: 1
      }}>
        {notebook.description}
      </p>
      
      {notebook.audio_overview_url && (
        <div style={{ margin: '1rem 0' }}>
          <AudioPlayer 
            audioUrl={notebook.audio_overview_url}
            title="Audio Overview"
          />
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {notebook.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} style={{
              background: '#2a3441',
              color: '#a0aec0',
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
            color: '#00ff88', 
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