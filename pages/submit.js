import { useState } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../lib/auth';
import { createNotebook } from '../lib/notebooks';

export default function Submit() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    author: '',
    institution: '',
    notebook_url: '',
    audio_overview_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    let user;
    try {
      user = await getCurrentUser();
      if (!user) {
        setSubmitStatus('auth_required');
        return;
      }
    } catch (error) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Convert tags string to array
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      const notebookData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: tagsArray,
        author: formData.author,
        institution: formData.institution || null,
        notebook_url: formData.notebook_url,
        audio_overview_url: formData.audio_overview_url || null,
        featured: false, // New submissions are not featured by default
        user_id: user.id
      };
      
      await createNotebook(notebookData);
      
      setSubmitStatus('success');
      setFormData({
        title: '',
        description: '',
        category: '',
        tags: '',
        author: '',
        institution: '',
        notebook_url: '',
        audio_overview_url: ''
      });
    } catch (error) {
      console.error('Error submitting notebook:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout title="Submit Project - NotebookLM Directory">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 1rem 0',
          color: '#ffffff'
        }}>
          Submit Your Project
        </h1>
        
        <p style={{ 
          color: '#e2e8f0', 
          margin: '0 0 3rem 0',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Share your innovative NotebookLM project with the community. Help others learn from your approach and discover new possibilities for AI-assisted research.
        </p>
        
        {submitStatus === 'success' && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            color: '#00ff88',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid rgba(0, 255, 136, 0.3)'
          }}>
            Thank you for your submission! Your project has been added to the directory.
          </div>
        )}
        
        {submitStatus === 'auth_required' && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.1)',
            color: '#ffc107',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 193, 7, 0.3)'
          }}>
            Please sign in to submit a notebook. You can sign in using the button in the top right corner.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            color: '#dc3545',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid rgba(220, 53, 69, 0.3)'
          }}>
            There was an error submitting your project. Please try again.
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
              placeholder="Enter a descriptive title for your project"
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
              placeholder="Describe what your project does, what sources you used, and what insights you gained"
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              >
                <option value="" style={{ background: '#1a1a2e', color: '#ffffff' }}>Select a category</option>
                <option value="Academic" style={{ background: '#1a1a2e', color: '#ffffff' }}>Academic</option>
                <option value="Business" style={{ background: '#1a1a2e', color: '#ffffff' }}>Business</option>
                <option value="Creative" style={{ background: '#1a1a2e', color: '#ffffff' }}>Creative</option>
                <option value="Research" style={{ background: '#1a1a2e', color: '#ffffff' }}>Research</option>
                <option value="Education" style={{ background: '#1a1a2e', color: '#ffffff' }}>Education</option>
                <option value="Personal" style={{ background: '#1a1a2e', color: '#ffffff' }}>Personal</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
                placeholder="e.g., Machine Learning, Climate Science"
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
                placeholder="Your name"
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                Institution/Organization
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff'
                }}
                placeholder="University, Company, or 'Independent'"
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              NotebookLM Share URL *
            </label>
            <input
              type="url"
              name="notebook_url"
              value={formData.notebook_url}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
              placeholder="https://notebooklm.google.com/notebook/..."
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Audio Overview URL (Optional)
            </label>
            <input
              type="url"
              name="audio_overview_url"
              value={formData.audio_overview_url}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff'
              }}
              placeholder="https://example.com/audio.mp3 or /audio/filename.mp3"
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
            <p style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '0.5rem',
              fontStyle: 'italic'
            }}>
              Link to an audio overview of your notebook (MP3, WAV, OGG supported)
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? 
                'rgba(255, 255, 255, 0.1)' : 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: isSubmitting ? '#ffffff' : '#0a0a0a',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              transition: 'all 0.2s ease',
              boxShadow: isSubmitting ? 
                'none' : 
                '0 8px 24px rgba(0, 255, 136, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.3)';
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </form>
      </div>
    </Layout>
  );
}