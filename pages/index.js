import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import NotebookModal from '../components/NotebookModal';
import AudioPlayer from '../components/AudioPlayer';
import { getCurrentUser } from '../lib/auth';
import { getNotebooks } from '../lib/notebooks';

export default function Notebooks() {
  const [user, setUser] = useState(null);
  const [featuredNotebooks, setFeaturedNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Get current user
    getCurrentUser().then(setUser);
    
    async function fetchFeaturedNotebooks() {
      try {
        setLoading(true);
        const notebooks = await getNotebooks({ featured: true });
        setFeaturedNotebooks(notebooks);
      } catch (err) {
        console.error('Error fetching featured notebooks:', err);
        setError('Failed to load featured notebooks');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedNotebooks();
  }, []);

  const handleNotebookCreated = (newNotebook) => {
    // If the new notebook is featured, add it to the featured list
    if (newNotebook.featured) {
      setFeaturedNotebooks(prev => [newNotebook, ...prev]);
    }
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a2332 0%, #0a0e1a 100%)',
        color: 'white',
        padding: '6rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.08) 0%, transparent 50%)
          `,
          zIndex: 1
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            margin: '0 0 1rem 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 2
          }}>
            <span style={{ color: '#00ff88' }}>NotebookLM</span> Directory
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            margin: '0 0 2rem 0',
            opacity: 0.8,
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            position: 'relative',
            zIndex: 2,
            color: '#a0aec0'
          }}>
            Discover <span style={{ color: '#00ff88' }}>innovative NotebookLM projects</span> across domains. Get inspired, learn techniques, and share your own AI-powered research.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2
          }}>
            <button 
              onClick={() => window.location.href = '/browse'}
              style={{
              background: '#00ff88',
              color: '#0a0e1a',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}>
              Browse Projects
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid #2a3441',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}>
              Connect a New Notebook
            </button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section style={{ 
        background: '#0f1419',
        padding: '4rem 0',
        borderTop: '1px solid #2a3441',
        borderBottom: '1px solid #2a3441'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff'
            }}>
              Trusted by <span style={{ color: '#00ff88' }}>AI Researchers</span> & <span style={{ color: '#00ff88' }}>Innovators</span>
            </h2>
            <p style={{ 
              color: '#a0aec0', 
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Join the community of forward-thinking researchers using NotebookLM to accelerate discovery
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: '#1a2332',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #2a3441'
            }}>
              <p style={{ 
                color: '#ffffff', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                margin: '0 0 1.5rem 0',
                fontStyle: 'italic'
              }}>
                "NotebookLM Directory has become our go-to resource for discovering innovative research methodologies. The quality of projects here is exceptional."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a0e1a',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  SC
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: '600' }}>Dr. Sarah Chen</div>
                  <div style={{ color: '#00ff88', fontSize: '0.9rem' }}>Stanford AI Research</div>
                </div>
              </div>
            </div>
            
            <div style={{
              background: '#1a2332',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #2a3441'
            }}>
              <p style={{ 
                color: '#ffffff', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                margin: '0 0 1.5rem 0',
                fontStyle: 'italic'
              }}>
                "This platform has revolutionized how we approach literature reviews. The AI-powered insights from shared notebooks are game-changing."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a0e1a',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  MR
                </div>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: '600' }}>Prof. Michael Rodriguez</div>
                  <div style={{ color: '#00ff88', fontSize: '0.9rem' }}>MIT Research Lab</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sponsor Logos */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#a0aec0', 
              fontSize: '0.9rem',
              marginBottom: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Supported by leading institutions
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              opacity: 0.6
            }}>
              <div style={{ color: '#a0aec0', fontWeight: '600', fontSize: '1.1rem' }}>Stanford</div>
              <div style={{ color: '#a0aec0', fontWeight: '600', fontSize: '1.1rem' }}>MIT</div>
              <div style={{ color: '#a0aec0', fontWeight: '600', fontSize: '1.1rem' }}>Harvard</div>
              <div style={{ color: '#a0aec0', fontWeight: '600', fontSize: '1.1rem' }}>OpenAI</div>
              <div style={{ color: '#a0aec0', fontWeight: '600', fontSize: '1.1rem' }}>Google Research</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision Audio Section */}
      <section style={{ 
        background: '#0a0e1a',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            margin: '0 0 1rem 0',
            color: '#ffffff'
          }}>
            🎧 Listen to the <span style={{ color: '#00ff88' }}>Vision</span>
          </h2>
          <p style={{ 
            color: '#a0aec0', 
            margin: '0 0 2rem 0',
            fontSize: '1.1rem'
          }}>
            Hear our AI-generated overview of how NotebookLM is transforming research and creativity
          </p>
          <AudioPlayer 
            audioUrl="overview.mp3"
            title="Listen to the Vision"
          />
        </div>
      </section>
      
      {/* Featured Projects */}
      <section style={{ 
        padding: '4rem 0',
        background: '#0f1419'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            margin: '0 0 3rem 0',
            color: '#ffffff'
          }}>
            Featured <span style={{ color: '#00ff88' }}>Projects</span>
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#a0aec0' }}>Loading featured projects...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#dc3545' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {featuredNotebooks.map(notebook => (
                <ProjectCard key={notebook.id} notebook={notebook} />
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => window.location.href = '/browse'}
              style={{
              background: '#00ff88',
              color: '#0a0e1a',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}>
              View All Projects
            </button>
          </div>
        </div>
      </section>
      
      {/* Categories Preview */}
      <section style={{ 
        background: '#0a0e1a',
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            margin: '0 0 3rem 0',
            color: '#ffffff'
          }}>
            Explore by <span style={{ color: '#00ff88' }}>Category</span>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem'
          }}>
            {['Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal'].map(category => (
              <div key={category} style={{
                background: '#1a2332',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #2a3441',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.borderColor = '#00ff88';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.borderColor = '#2a3441';
              }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: '#ffffff',
                  fontSize: '1.25rem'
                }}>
                  {category}
                </h3>
                <p style={{ 
                  color: '#a0aec0',
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  Explore {category.toLowerCase()} projects
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NotebookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNotebookCreated={handleNotebookCreated}
      />
    </Layout>
  );
}