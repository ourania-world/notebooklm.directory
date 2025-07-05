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
    source_files: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    try {
      const user = await getCurrentUser();
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
        source_files: ''
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
          color: '#212529'
        }}>
          Submit Your Project
        </h1>
        
        <p style={{ 
          color: '#6c757d', 
          margin: '0 0 3rem 0',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Share your innovative NotebookLM project with the community. Help others learn from your approach and discover new possibilities for AI-assisted research.
        </p>
        
        {submitStatus === 'success' && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #c3e6cb'
          }}>
            Thank you for your submission! Your project has been added to the directory.
          </div>
        )}
        
        {submitStatus === 'auth_required' && (
          <div style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #ffeaa7'
          }}>
            Please sign in to submit a notebook. You can sign in using the button in the top right corner.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #f5c6cb'
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
              color: '#212529'
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
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="Enter a descriptive title for your project"
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#212529'
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
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Describe what your project does, what sources you used, and what insights you gained"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#212529'
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
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="">Select a category</option>
                <option value="Academic">Academic</option>
                <option value="Business">Business</option>
                <option value="Creative">Creative</option>
                <option value="Research">Research</option>
                <option value="Education">Education</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#212529'
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
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="e.g., Machine Learning, Climate Science"
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#212529'
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
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#212529'
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
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="University, Company, or 'Independent'"
              />
            </div>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#212529'
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
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="https://notebooklm.google.com/notebook/..."
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#212529'
            }}>
              Source Files Description
            </label>
            <textarea
              name="source_files"
              value={formData.source_files}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Describe the types and sources of documents you uploaded (e.g., '25 research papers from PubMed, 3 industry reports, personal notes')"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? '#6c757d' : '#667eea',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '1rem'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </form>
      </div>
    </Layout>
  );
}