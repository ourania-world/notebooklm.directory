import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import NotebookModal from '../components/NotebookModal';
import AudioPlayer from '../components/AudioPlayer';
import SearchBar from '../components/SearchBar';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import FeaturedCollections from '../components/FeaturedCollections';
import { getCurrentUser } from '../lib/auth';
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

export default function Notebooks({ initialFeaturedNotebooks }) {
  const [user, setUser] = useState(null);
  const [featuredNotebooks, setFeaturedNotebooks] = useState(initialFeaturedNotebooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Get current user
    getCurrentUser()
      .then(setUser)
      .catch(error => {
        console.warn('Failed to get user:', error)
        setUser(null)
      });
    
    // Set loading to false since we have initial data
    setLoading(false);
  }, []);

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
          animation: 'pulse 4s ease-in-out infinite',
          zIndex: 1
        }} />
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 2rem',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '50px',
              padding: '0.5rem 1.5rem',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              color: '#00ff88'
            }}>
              ⭐ Est. July 2025 • Growing Community • Excellent Reviews
            </div>
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
            The Premier NotebookLM <span style={{ color: '#00ff88' }}>Directory</span>
          </h1>
          
          <div style={{ 
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#ffffff',
            margin: '0 0 1.5rem 0',
            textAlign: 'center'
          }}>
            Discover. Build. Accelerate.
          </div>
          
          <p style={{ 
            fontSize: '1.3rem', 
            margin: '0 0 1rem 0',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto 1rem auto',
            color: '#e2e8f0',
            lineHeight: '1.6'
          }}>
            The definitive resource for shared intelligence across all domains. We deliver superior discovery and collaboration through <strong style={{ color: '#00ff88' }}>intelligent curation</strong>, empowering our community to innovate faster.
          </p>
          
          <div style={{ 
            marginBottom: '3rem',
            fontSize: '1rem',
            color: '#00ff88'
          }}>
            <a href="#support" style={{ 
              color: '#00ff88', 
              textDecoration: 'underline',
              textUnderlineOffset: '4px'
            }}>
              SUPPORT OUR GROWTH
            </a>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <SearchBar 
              onSearch={(query) => window.location.href = `/browse?search=${encodeURIComponent(query)}`}
              placeholder="Search notebooks, topics, or authors..."
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '3rem'
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
          
          {/* Launch Support Section */}
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
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ 
                color: '#ffffff', 
                fontSize: '1.5rem', 
                margin: '0 0 1rem 0',
                fontWeight: '600'
              }}>
                Est. July 2025 - Global Launch
              </h3>
              <p style={{ 
                color: '#e2e8f0', 
                fontSize: '1.1rem',
                margin: '0 0 2rem 0',
                lineHeight: '1.6'
              }}>
                We're building the world's most comprehensive, environmentally-conscious NotebookLM directory. 
                Help us democratize AI research while minimizing computational waste through smart curation!
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.location.href = '/pricing'}
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
                  💳 Support Our Growth
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    background: 'transparent',
                    color: '#00ff88',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
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
                  📚 Contribute Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="support" style={{ 
        background: '#0a0a0a',
        padding: '6rem 0',
        borderTop: '1px solid rgba(0, 255, 136, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Building the Future of <span style={{ color: '#00ff88' }}>AI Research</span>
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              margin: '0 0 3rem 0'
            }}>
              Join us in creating the world's most comprehensive NotebookLM directory
            </p>
          </div>
          
          {/* Mission Statement */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Our Mission</h3>
              <p style={{ color: '#e2e8f0' }}>
                Transform AI research through sustainable discovery. Our resource-efficient platform 
                prevents computational waste while accelerating innovation - proving that environmental 
                responsibility drives technical excellence.
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Environmental Impact</h3>
              <p style={{ color: '#e2e8f0' }}>
                Every shared notebook prevents ~10 duplicate experiments, saving massive computational 
                resources. We're not asking researchers to sacrifice performance for sustainability - 
                our efficient-by-design architecture delivers superior results while protecting Earth.
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Community Driven</h3>
              <p style={{ color: '#e2e8f0' }}>
                Join the movement where sustainability equals performance. Our obsessive focus on 
                resource efficiency is why we deliver faster results, lower costs, and better 
                collaboration - making responsible research the easiest choice.
              </p>
            </div>
          </div>
          
          {/* Support CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '3rem',
            borderRadius: '20px',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
            <h3 style={{ 
              color: '#ffffff', 
              fontSize: '2rem', 
              margin: '0 0 1rem 0',
              fontWeight: '700'
            }}>
              Help Us Build Something Amazing
            </h3>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              margin: '0 0 2rem 0',
              lineHeight: '1.6'
            }}>
              Support the platform where environmental consciousness meets engineering excellence. 
              Every subscription helps us build more efficient infrastructure, proving that 
              sustainable technology delivers superior performance.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = '/pricing'}
                style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '1rem 2rem',
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
                💳 Support Our Growth
              </button>
              <button
                onClick={() => window.location.href = '/browse'}
                style={{
                  background: 'transparent',
                  color: '#00ff88',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
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
                🔍 Explore Directory
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Value Proposition */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 2rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              NotebookLM Directory is the <span style={{ color: '#00ff88' }}>HIGHEST level</span><br />
              of AI Research Discovery & AI<br />
              optimization for <span style={{ color: '#00ff88' }}>HIGH LEVEL</span> researchers
            </h2>
            
            <div style={{
              display: 'inline-block',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              color: '#00ff88',
              fontFamily: 'monospace',
              fontWeight: '700'
            }}>
              $3,650,500,150
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#ffffff' }}>
                in Research Value Tracked
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section style={{ 
        background: '#0a0a0a',
        padding: '6rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Join the <span style={{ color: '#00ff88' }}>Sustainable</span> AI Research<br />
              Movement 🌍
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              textAlign: 'center',
              margin: '0 0 3rem 0'
            }}>
              Est. July 2025 - Democratizing AI research while protecting our planet
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  color: '#ffffff',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  🔍 Discover innovative NotebookLM projects<br />
                  🌱 Reduce computational waste through sharing<br />
                  🤝 Connect with eco-conscious researchers<br />
                  🚀 Accelerate discovery while protecting Earth
                </div>
              </div>
              <div style={{
                width: '200px',
                height: '150px',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{ 
                  color: '#00ff88', 
                  fontSize: '3rem',
                  textAlign: 'center'
                }}>
                  🌍<br />
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Sustainable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision Audio Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
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
            🎧 Listen to Our <span style={{ color: '#00ff88' }}>Vision</span>
          </h2>
          <p style={{ 
            color: '#e2e8f0', 
            margin: '0 0 2rem 0',
            fontSize: '1.1rem'
          }}>
            Hear our AI-generated overview of how we're building sustainable, efficient AI research
          </p>
          <AudioPlayer 
            audioUrl="/overview.mp3"
            title="Our Sustainable AI Vision"
          />
        </div>
      </section>
      
      {/* Featured Projects */}
      <section style={{ 
        padding: '6rem 0',
        background: '#0a0a0a'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Personalized Recommendations */}
          <PersonalizedRecommendations limit={6} />
          
          <div style={{ textAlign: 'center', margin: '3rem 0' }}>
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
                textTransform: 'uppercase'
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
      
      {/* Featured Collections */}
      <section style={{ 
        padding: '6rem 0',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <FeaturedCollections />
        </div>
      </section>
      
      {/* Traditional Featured Projects */}
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
            Featured <span style={{ color: '#00ff88' }}>Projects</span>
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#e2e8f0' }}>Loading featured projects...</p>
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
              {featuredNotebooks.slice(0, 3).map(notebook => (
                <ProjectCard key={notebook.id} notebook={notebook} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NotebookModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNotebookCreated={handleNotebookCreated}
      />
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </Layout>
  );
}