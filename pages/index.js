import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import NotebookModal from '../components/NotebookModal';
import AudioPlayer from '../components/AudioPlayer';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { getNotebooks } from '../lib/notebooks';
import { trackEvent } from '../lib/analytics';

export async function getServerSideProps() {
  try {
    // Fetch featured notebooks on server side
    const featuredNotebooks = await getNotebooks({ featured: true });
    
    return {
      props: {
        initialFeaturedNotebooks: featuredNotebooks || []
      }
    };
  } catch (error) {
    console.error('Error fetching featured notebooks:', error);
    return {
      props: {
        initialFeaturedNotebooks: []
      }
    };
  }
}

export default function Home({ initialFeaturedNotebooks }) {
  const { user } = useAuth();
  const [featuredNotebooks, setFeaturedNotebooks] = useState(initialFeaturedNotebooks);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotebookCreated = (newNotebook) => {
    // Add new notebook to the list and refresh
    setFeaturedNotebooks(prev => [newNotebook, ...prev]);
    
    // Track notebook submission
    if (user) {
      trackEvent(user.id, 'notebook_submit', {
        notebook_id: newNotebook.id,
        category: newNotebook.category
      });
    }
    
    // Optionally refresh the page to get updated data
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleSearch = (query) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/browse?search=${encodeURIComponent(query)}`;
    }
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', 
        color: 'white', 
        padding: '8rem 0', 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden' 
      }}> 
        {/* Animated Background Pattern */}
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
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            alignItems: 'center', 
            gap: '0.5rem',
            background: 'rgba(0, 0, 0, 0.4)', 
            border: '1px solid rgba(0, 255, 136, 0.3)', 
            borderRadius: '50px', 
            padding: '0.5rem 1.5rem', 
            marginBottom: '2rem', 
            fontSize: '0.9rem', 
            color: '#00ff88', 
            backdropFilter: 'blur(10px)'
          }}> 
            ⭐ Trusted by Researchers Worldwide • Join Our Community
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: '700', 
            margin: '0 0 1.5rem 0', 
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            The Premier NotebookLM<br />
            <span style={{ color: '#00ff88' }}>Directory</span>
          </h1>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 1.5rem 0',
            color: '#ffffff',
            fontWeight: '500'
          }}>
            Discover. Build. Accelerate.
          </h2>
          
          <p style={{ 
            fontSize: '1.3rem', 
            margin: '0 0 1rem 0',
            opacity: 0.9, 
            maxWidth: '700px',
            margin: '0 auto 1rem auto', 
            color: '#e2e8f0',
            lineHeight: '1.6'
          }}>
            Help us build a network of researchers. By curating and sharing 
            notebooks, we can prevent redundant work and reduce the massive 
            computational footprint of AI research. <a href="#" style={{ 
              color: '#00ff88', 
              textDecoration: 'none',
              borderBottom: '1px dotted #00ff88'
            }}>Contribute your work</a> and 
            <a href="#" style={{ 
              color: '#00ff88', 
              textDecoration: 'none',
              borderBottom: '1px dotted #00ff88'
            }}> discover what's possible</a>.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap', 
            marginBottom: '3rem',
            marginTop: '2rem'
          }}>
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search notebooks, topics, or authors..."
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            marginBottom: '2rem'
          }}>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: '#0a0a0a',
                border: 'none', 
                padding: '1rem 2.5rem', 
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => { 
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(0, 255, 136, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(0, 255, 136, 0.3)';
              }}
            >
              GET STARTED
            </button>
          </div>
          
          {/* Stats Dashboard Preview */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '20px',  
            padding: '2rem', 
            maxWidth: '800px', 
            margin: '0 auto', 
            position: 'relative' 
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: '#00ff88',
                  fontFamily: 'monospace'
                }}>
                  The Premier NotebookLM Directory
                </div>
                <div style={{ color: '#00ff88', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Discover, share, and collaborate with researchers worldwide
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700', 
            margin: '0 0 1.5rem 0', 
            color: '#ffffff',
            textAlign: 'center'
          }}>
            Building the Future of <span style={{ color: '#00ff88' }}>AI Research</span>
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#e2e8f0',
            textAlign: 'center', 
            maxWidth: '800px',
            margin: '0 auto 4rem auto'
          }}>
            We're creating the world's most comprehensive AI research discovery platform
          </p>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem', 
            marginBottom: '4rem' 
          }}>
            {/* Feature 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
              borderRadius: '16px',
              padding: '2rem', 
              border: '1px solid rgba(0, 255, 136, 0.2)' 
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                🔍
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#00ff88',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                Curated Selection
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}> 
                Hand-picked collection of innovative NotebookLM projects across domains. Only the highest quality research makes it to the directory.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid rgba(0, 255, 136, 0.2)' 
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                🧠
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#00ff88',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                Personalized Discovery
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}> 
                AI-powered recommendations based on your interests and research history. Find exactly what you need for your next project.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px', 
              padding: '2rem', 
              border: '1px solid rgba(0, 255, 136, 0.2)' 
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                🌍
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#00ff88',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                Community Driven
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}> 
                Discover, share, and collaborate with researchers worldwide. Build on existing work instead of starting from scratch.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={{ 
        background: '#0a0a0a',
        padding: '6rem 0', 
        textAlign: 'center'
      }}> 
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1.5rem',
            color: '#ffffff'
          }}> 
            ✨
          </div>
          <h2 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 1.5rem 0',
            color: '#ffffff',
            fontWeight: '700'
          }}> 
            Help Us Build Something Amazing
          </h2>
          <p style={{ 
            fontSize: '1.1rem',
            color: '#e2e8f0',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}> 
            Share your NotebookLM projects, discover innovative approaches, and help build a community for the future of AI research.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem' 
            }}>
              SUBMIT YOUR NOTEBOOK
            </button>
            
            <button style={{
              background: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.9rem' 
            }}>
              EXPLORE FIRST
            </button>
          </div>
        </div>
      </section>
      
      {/* Sustainable Research Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0', 
        textAlign: 'center'
      }}> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '1.5rem'
          }}> 
            Building the Future of <span style={{ color: '#00ff88' }}>Sustainable</span><br />
            AI Research Discovery<br />
            <span style={{ color: '#00ff88', fontSize: '1.8rem' }}>One Notebook at a Time</span>
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#e2e8f0',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 4rem auto'
          }}> 
            Every shared notebook prevents redundant research, reduces computational footprint, and accelerates discovery for the entire AI community.
          </p>
        </div>
      </section>
      
      {/* Help Build Section */}
      <section style={{ 
        background: '#0a0a0a', 
        padding: '6rem 0' 
      }}> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '1.5rem'
          }}> 
            Help Build the Future of <span style={{ color: '#00ff88' }}>AI Research</span><br />
            <span style={{ color: '#00ff88', fontSize: '1.8rem' }}>Discovery</span>
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#e2e8f0',
            lineHeight: '1.6',
            maxWidth: '800px',
            marginBottom: '3rem' 
          }}>
            Join our community of researchers building the definitive discovery platform for NotebookLM projects
          </p>
          
          <div style={{
            display: 'flex',
            gap: '2rem'
          }}>  
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              flex: 2
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem' 
              }}> 
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00ff88',
                    fontSize: '0.8rem'
                  }}> 
                    1 
                  </div>
                  <div style={{ color: '#e2e8f0' }}>
                    Discover cutting-edge notebooks for AI projects
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00ff88',
                    fontSize: '0.8rem'
                  }}> 
                    2 
                  </div>
                  <div style={{ color: '#e2e8f0' }}>
                    Share your own work and accelerate discovery
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00ff88',
                    fontSize: '0.8rem'
                  }}> 
                    3 
                  </div>
                  <div style={{ color: '#e2e8f0' }}>
                    Build on existing knowledge, don't reinvent
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center', 
              justifyContent: 'center'  
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🚀
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision Audio Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '4rem 0', 
        textAlign: 'center'
      }}> 
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            margin: '0 0 1rem 0',
            color: '#ffffff', 
            fontWeight: '700'
          }}> 
            🎧 Listen to the <span style={{ color: '#00ff88' }}>Vision</span>
          </h2>
          <p style={{ 
            color: '#e2e8f0', 
            margin: '0 0 2rem 0',
            fontSize: '1.1rem'
          }}>
            Hear our overview of how NotebookLM is transforming research and creativity
          </p>
          <AudioPlayer 
            audioUrl="/overview.mp3"
            title="Listen to the Vision"
          />
        </div>
      </section>
      
      {/* Featured Collections */}
      <section style={{ 
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' 
      }}> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            margin: '0 0 3rem 0',
            color: '#ffffff',
            fontWeight: '700' 
          }}>
            Featured <span style={{ color: '#00ff88' }}>Collections</span>
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap'  
          }}>
            <button style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.8rem' 
            }}>
              Popular This Week
            </button>
            
            <button style={{
              background: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.8rem' 
            }}>
              Academic Research
            </button>
            
            <button style={{
              background: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.8rem' 
            }}>
              Creative Projects
            </button>
          </div>
          
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#ffffff',
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}>
            Trending This Week
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '3rem'  
          }}>
            {featuredNotebooks.slice(0, 6).map(notebook => (
              <ProjectCard key={notebook.id} notebook={notebook} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ 
        padding: '6rem 0',
        background: '#0a0a0a' 
      }}> 
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            margin: '0 0 3rem 0',
            color: '#ffffff',
            fontWeight: '700'  
          }}>
            Popular <span style={{ color: '#00ff88' }}>Notebooks</span>
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#e2e8f0' }}>Loading notebooks...</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '2rem'
            }}>
              {featuredNotebooks.slice(0, 6).map(notebook => (
                <ProjectCard key={notebook.id || notebook.title} notebook={notebook} />
              ))}
            </div> 
          )}
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => window.location.href = '/browse'}
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: '#0a0a0a',
                border: 'none',
                padding: '1rem 2rem', 
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px' 
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(0, 255, 136, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(0, 255, 136, 0.3)';
              }}
            >
              View All Projects
            </button>
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