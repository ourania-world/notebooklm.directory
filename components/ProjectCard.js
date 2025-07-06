import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/supabase';
import { toggleSavedNotebook } from '../lib/profiles';

export default function ProjectCard({ notebook }) {
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkSavedStatus() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Check if this notebook is saved by the user
          // This would typically be done via a database query
          // For now, we'll just use localStorage as a simple example
          const savedNotebooks = JSON.parse(localStorage.getItem('savedNotebooks') || '[]');
          setIsSaved(savedNotebooks.includes(notebook.id));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    }
    
    checkSavedStatus();
  }, [notebook.id]);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }
    
    try {
      setSaving(true);
      
      // Toggle saved status in the database
      const newSavedStatus = await toggleSavedNotebook(user.id, notebook.id);
      setIsSaved(newSavedStatus);
      
      // Update localStorage for our simple example
      const savedNotebooks = JSON.parse(localStorage.getItem('savedNotebooks') || '[]');
      if (newSavedStatus) {
        if (!savedNotebooks.includes(notebook.id)) {
          savedNotebooks.push(notebook.id);
        }
      } else {
        const index = savedNotebooks.indexOf(notebook.id);
        if (index > -1) {
          savedNotebooks.splice(index, 1);
        }
      }
      localStorage.setItem('savedNotebooks', JSON.stringify(savedNotebooks));
      
    } catch (error) {
      console.error('Error toggling saved status:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to notebook detail page
    window.location.href = `/notebook/${notebook.id}`;
  };

  return (
    <div 
      className="card-hover premium-card"
      style={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        flexDirection: 'column'
      }}
      onClick={handleCardClick}
    >
      {/* Category Badge */}
      <div style={{
        position: 'absolute',
        top: '1.2rem',
        left: '1.2rem',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.7rem',
        color: '#00ff88',
        fontWeight: '600',
        zIndex: 1
      }}>
        {notebook.category}
      </div>
      
      {/* Save Button */}
      <button
        onClick={handleSaveToggle}
        disabled={saving} 
        style={{ 
          position: 'absolute', 
          top: '1rem',
          right: '1rem',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: saving ? 'wait' : 'pointer', 
          zIndex: 1,
          color: isSaved ? '#00ff88' : '#ffffff',
          fontSize: '1.1rem',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (!saving) {
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          if (!saving) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {saving ? '⏳' : isSaved ? '❤️' : '🤍'}
      </button>
      
      {/* Header Image or Gradient */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 230, 122, 0.05) 100%)', 
        backgroundSize: '200% 200%',
        position: 'relative'
      }}>
        {notebook.featured && (
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
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
          </div>
        )}
        
        {notebook.premium && (
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '0.5rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', 
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
            color: '#0a0a0a',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Premium
          </div>
        )}
      </div>
      
      {/* Content */}
      <div style={{ 
        padding: '1.75rem 1.5rem',
        flex: 1, 
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ 
          fontSize: '1.3rem', 
          fontWeight: '700',
          color: '#ffffff', 
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          margin: '0 0 0.75rem 0', 
          lineHeight: '1.3'
        }}>
          {notebook.title}
        </h3>
        
        <p style={{ 
          color: 'rgba(226, 232, 240, 0.9)', 
          fontSize: '0.9rem',
          lineHeight: '1.5',
          margin: '0 0 1rem 0', 
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {notebook.description}
        </p>
        
        {/* Tags */}
        {notebook.tags && notebook.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          marginBottom: '1rem', 
          marginTop: '0.5rem'
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
        
        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto', 
          paddingTop: '1.25rem',
          paddingTop: '1rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.9rem' }}>
              {notebook.author}
            </div>
            {notebook.institution && ( 
              <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                {notebook.institution}
              </div>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
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
      
      {/* Audio Indicator */}
      {notebook.audio_overview_url && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '3.5rem', 
          zIndex: 1,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          width: '32px',
          height: '32px', 
          borderRadius: '50%', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '1rem',
          zIndex: 1
        }}>
          🎧
        </div>
      )}
    </div>
  );
}