import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getNotebook } from '../../lib/notebooks';
import { getCurrentUser } from '../../lib/supabase';

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;
    
    // Try to fetch the notebook by ID
    const notebook = await getNotebook(id);
    
    if (!notebook) {
      return {
        notFound: true
      };
    }
    
    return {
      props: {
        notebook
      }
    };
  } catch (error) {
    console.error('Error fetching notebook:', error);
    return {
      notFound: true
    };
  }
}

export default function NotebookDetail({ notebook }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getCurrentUser()
      .then(setUser)
      .catch(error => {
        console.log('No user session (browsing as guest):', error.message);
        setUser(null);
      });
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const handleOpenNotebook = () => {
    // If we have a url field (from scraped content), use that
    if (notebook.url) {
      window.open(notebook.url, '_blank');
    } else if (notebook.notebook_url) {
      window.open(notebook.notebook_url, '_blank');
    } else {
      alert('No URL available for this notebook');
    }
  };

  const handleBack = () => {
    router.push('/browse');
  };

  if (!notebook) {
    return (
      <Layout>
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#fff' 
        }}>
          <h1>Notebook Not Found</h1>
          <button onClick={handleBack}>Back to Browse</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ 
        padding: '2rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          ← Back to Browse
        </button>

        {/* Notebook Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            color: '#00ff88'
          }}>
            {notebook.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              background: '#00ff88', 
              color: '#000', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '12px',
              fontSize: '0.875rem'
            }}>
              {notebook.category}
            </span>
            {notebook.source_platform && (
              <span style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                color: '#fff', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '12px',
                fontSize: '0.875rem'
              }}>
                {notebook.source_platform}
              </span>
            )}
            {notebook.featured && (
              <span style={{ 
                background: '#ffd700', 
                color: '#000', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '12px',
                fontSize: '0.875rem'
              }}>
                Featured
              </span>
            )}
          </div>

          <div style={{ 
            color: '#ccc', 
            fontSize: '1rem',
            marginBottom: '1rem'
          }}>
            {notebook.author && `By ${notebook.author}`}
            {notebook.institution && ` • ${notebook.institution}`}
            {notebook.created_at && ` • ${new Date(notebook.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}`}
          </div>
        </div>

        {/* Description */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            color: '#00ff88', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Description
          </h2>
          <p style={{ 
            lineHeight: '1.6',
            fontSize: '1.1rem',
            color: '#fff'
          }}>
            {notebook.description}
          </p>
        </div>

        {/* Tags */}
        {notebook.tags && notebook.tags.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#00ff88', 
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              Tags
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {notebook.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {notebook.extraction_data && typeof notebook.extraction_data === 'object' && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ 
              color: '#00ff88', 
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              Source Information
            </h3>
            {notebook.extraction_data.qualityScore && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Quality Score:</strong> {Math.round(notebook.extraction_data.qualityScore * 100)}%
              </p>
            )}
            {notebook.extraction_data.originalMetadata && (
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                <strong>Original Metadata:</strong>
                <pre style={{ 
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  overflow: 'auto'
                }}>
                  {typeof notebook.extraction_data.originalMetadata === 'string' 
                    ? notebook.extraction_data.originalMetadata 
                    : JSON.stringify(notebook.extraction_data.originalMetadata, null, 2)
                  }
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={handleOpenNotebook}
            style={{
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              color: '#000',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0, 255, 136, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🚀 Open Original Content
          </button>
          
          <button
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Back to Browse
          </button>
        </div>
      </div>
    </Layout>
  );
}