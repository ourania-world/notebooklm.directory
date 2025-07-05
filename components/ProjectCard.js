import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import { getCurrentUser } from '../lib/auth';
import { toggleSavedNotebook } from '../lib/profiles';
import { trackNotebookView, trackEvent } from '../lib/analytics';

export default function ProjectCard({ notebook }) {
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track view when card is displayed
  useEffect(() => {
    const trackView = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.id) {
          await trackNotebookView(currentUser.id, notebook.id);
        }
      } catch (error) {
        console.warn('Failed to track view:', error);
      }
    };

    // Track view after a short delay to ensure it's actually viewed
    const timer = setTimeout(trackView, 1000);
    return () => clearTimeout(timer);
  }, [notebook.id]);
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
    
    // For demo purposes, just show an alert
    alert('Save functionality coming soon! Sign up for updates.');
    return;

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

  const handleNotebookClick = async (e) => {
    // Don't track if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }

    // For demo purposes, just log the click
    console.log('Notebook clicked:', notebook.title);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}
    onClick={handleNotebookClick}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-8px) scale(1.01)';
      e.target.style.borderColor = '#00ff88';
      e.target.style.boxShadow = '0 20px 40px rgba(0, 255, 136, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.borderColor = 'rgba(0, 255, 136, 0.2)';
      e.target.style.boxShadow = 'none';
    }}>
      
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }} />
      
      <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <span style={{
          background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
          color: '#0a0a0a',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {notebook.category}
        </span>
      </div>
      
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#ffffff',
        lineHeight: '1.3',
        position: 'relative',
        zIndex: 1
      }}>
        {notebook.title}
      </h3>
      
      <p style={{ 
        color: '#e2e8f0', 
        lineHeight: '1.6',
        margin: '0 0 1.5rem 0',
        flex: 1,
        fontSize: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {notebook.description}
      </p>
      
      {notebook.audio_overview_url && (
        <div style={{ margin: '1.5rem 0', position: 'relative', zIndex: 1 }}>
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
        marginTop: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* View and Save Counts */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          color: '#e2e8f0'
        }}>
          {notebook.view_count > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              👁️ {notebook.view_count} views
            </span>
          )}
          {notebook.save_count > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              💾 {notebook.save_count} saves
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {notebook.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} style={{
              background: 'rgba(0, 255, 136, 0.1)',
              color: '#00ff88',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <button
              onClick={handleSaveToggle}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.5rem',
                padding: '0.5rem',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s ease',
                borderRadius: '8px'
              }}
              title={isSaved ? 'Unsave notebook' : 'Save notebook'}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              {isSaved ? '💾' : '🤍'}
            </button>
          )}
          <a 
            href={notebook.notebook_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#00ff88', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 255, 136, 0.1)';
              e.target.style.borderColor = '#00ff88';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
            }}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}