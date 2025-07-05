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
              ⭐ Est. July 2025 • Global Launch • Growing Community
            </div>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: '700', 
            margin: '0 0 1.5rem 0',
            lineHeight: '1.1',
            color: '#ffffff'
          }}>
            The Premier NotebookLM<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 50%, #00d96b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))',
              position: 'relative',
              display: 'inline-block',
              animation: 'directoryShimmer 4s ease-in-out infinite alternate'
            }}>
              Directory
            </span>
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
            Help us build a smarter AI ecosystem. By curating and sharing notebooks, we can prevent redundant work and reduce the massive computational footprint of AI research. <strong style={{ color: '#00ff88' }}>Contribute your work and discover what's possible.</strong>
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
              JOIN THE MOVEMENT
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
                Help us build a smarter AI ecosystem. By curating and sharing notebooks, we can prevent redundant work and reduce the massive computational footprint of AI research. Contribute your work and discover what's possible.
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
      
      {/* Unlock the Power of a Notebook Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Unlock the Power of a <span style={{ color: '#00ff88' }}>Notebook</span>
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover what makes NotebookLM revolutionary. These aren't just static files - 
              they're interactive knowledge bases that transform how you work with information.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Component 1: Interactive Chat */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Chat Interface */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📄
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#e2e8f0',
                    textAlign: 'left'
                  }}>
                    "What were the key findings from the 2024 report?"
                  </div>
                </div>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    "Based on the 2024 Climate Research Report (page 23), the key findings include..."
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#00ff88',
                    fontWeight: '600'
                  }}>
                    ✓ Cited from source documents
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Ask It Anything.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Go beyond simple reading. Chat directly with the source materials in any notebook. 
                Get instant, cited answers to your questions without ever leaving the page.
              </p>
            </div>

            {/* Component 2: Audio Overviews */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Audio Player */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)'
                  }}>
                    ▶️
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: `${Math.random() * 30 + 10}px`,
                          background: '#00ff88',
                          borderRadius: '2px',
                          animation: `waveform ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  🎧 Multi-host Discussion • 12:34
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Listen to Your Research.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Transform any notebook into an engaging, multi-host audio discussion with a single click. 
                Perfect for understanding complex topics on your commute, at the gym, or on the go.
              </p>
            </div>

            {/* Component 3: Learning Tools */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Study Guide */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '60px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '2px solid rgba(0, 255, 136, 0.4)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem'
                    }}>📚</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#00ff88',
                      fontWeight: '600'
                    }}>
                      STUDY GUIDE
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📝 FAQs
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📅 Timeline
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📋 Brief
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    🎯 Quiz
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                From Sources to Study Guide. Instantly.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Don't just read—understand. Instantly generate FAQs, timelines, briefing docs, 
                and study guides from any notebook's content. Master complex topics faster than ever before.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}>
              Ready to Experience the Future of Research?
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Join thousands of researchers who are already transforming how they work with information. 
              No guesswork, just powerful tools that make research faster and more insightful.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                🚀 Explore Notebooks
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
                📚 Share Your Work
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Unlock the Power of a Notebook Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Unlock the Power of a <span style={{ color: '#00ff88' }}>Notebook</span>
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover what makes NotebookLM revolutionary. These aren't just static files - 
              they're interactive knowledge bases that transform how you work with information.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Component 1: Interactive Chat */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Chat Interface */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📄
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#e2e8f0',
                    textAlign: 'left'
                  }}>
                    "What were the key findings from the 2024 report?"
                  </div>
                </div>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    "Based on the 2024 Climate Research Report (page 23), the key findings include..."
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#00ff88',
                    fontWeight: '600'
                  }}>
                    ✓ Cited from source documents
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Ask It Anything.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Go beyond simple reading. Chat directly with the source materials in any notebook. 
                Get instant, cited answers to your questions without ever leaving the page.
              </p>
            </div>

            {/* Component 2: Audio Overviews */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Audio Player */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)'
                  }}>
                    ▶️
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: `${Math.random() * 30 + 10}px`,
                          background: '#00ff88',
                          borderRadius: '2px',
                          animation: `waveform ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  🎧 Multi-host Discussion • 12:34
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Listen to Your Research.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Transform any notebook into an engaging, multi-host audio discussion with a single click. 
                Perfect for understanding complex topics on your commute, at the gym, or on the go.
              </p>
            </div>

            {/* Component 3: Learning Tools */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Study Guide */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '60px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '2px solid rgba(0, 255, 136, 0.4)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem'
                    }}>📚</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#00ff88',
                      fontWeight: '600'
                    }}>
                      STUDY GUIDE
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📝 FAQs
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📅 Timeline
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📋 Brief
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    🎯 Quiz
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                From Sources to Study Guide. Instantly.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Don't just read—understand. Instantly generate FAQs, timelines, briefing docs, 
                and study guides from any notebook's content. Master complex topics faster than ever before.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}>
              Ready to Experience the Future of Research?
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Join thousands of researchers who are already transforming how they work with information. 
              No guesswork, just powerful tools that make research faster and more insightful.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                🚀 Explore Notebooks
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
                📚 Share Your Work
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Unlock the Power of a Notebook Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Unlock the Power of a <span style={{ color: '#00ff88' }}>Notebook</span>
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover what makes NotebookLM revolutionary. These aren't just static files - 
              they're interactive knowledge bases that transform how you work with information.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Component 1: Interactive Chat */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Chat Interface */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📄
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#e2e8f0',
                    textAlign: 'left'
                  }}>
                    "What were the key findings from the 2024 report?"
                  </div>
                </div>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    "Based on the 2024 Climate Research Report (page 23), the key findings include..."
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#00ff88',
                    fontWeight: '600'
                  }}>
                    ✓ Cited from source documents
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Ask It Anything.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Go beyond simple reading. Chat directly with the source materials in any notebook. 
                Get instant, cited answers to your questions without ever leaving the page.
              </p>
            </div>

            {/* Component 2: Audio Overviews */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Audio Player */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)'
                  }}>
                    ▶️
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: `${Math.random() * 30 + 10}px`,
                          background: '#00ff88',
                          borderRadius: '2px',
                          animation: `waveform ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  🎧 Multi-host Discussion • 12:34
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Listen to Your Research.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Transform any notebook into an engaging, multi-host audio discussion with a single click. 
                Perfect for understanding complex topics on your commute, at the gym, or on the go.
              </p>
            </div>

            {/* Component 3: Learning Tools */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Study Guide */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '60px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '2px solid rgba(0, 255, 136, 0.4)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem'
                    }}>📚</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#00ff88',
                      fontWeight: '600'
                    }}>
                      STUDY GUIDE
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📝 FAQs
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📅 Timeline
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📋 Brief
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    🎯 Quiz
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                From Sources to Study Guide. Instantly.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Don't just read—understand. Instantly generate FAQs, timelines, briefing docs, 
                and study guides from any notebook's content. Master complex topics faster than ever before.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}>
              Ready to Experience the Future of Research?
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Join thousands of researchers who are already transforming how they work with information. 
              No guesswork, just powerful tools that make research faster and more insightful.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                🚀 Explore Notebooks
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
                📚 Share Your Work
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Unlock the Power of a Notebook Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Unlock the Power of a <span style={{ color: '#00ff88' }}>Notebook</span>
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover what makes NotebookLM revolutionary. These aren't just static files - 
              they're interactive knowledge bases that transform how you work with information.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Component 1: Interactive Chat */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Chat Interface */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📄
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#e2e8f0',
                    textAlign: 'left'
                  }}>
                    "What were the key findings from the 2024 report?"
                  </div>
                </div>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    "Based on the 2024 Climate Research Report (page 23), the key findings include..."
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#00ff88',
                    fontWeight: '600'
                  }}>
                    ✓ Cited from source documents
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Ask It Anything.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Go beyond simple reading. Chat directly with the source materials in any notebook. 
                Get instant, cited answers to your questions without ever leaving the page.
              </p>
            </div>

            {/* Component 2: Audio Overviews */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Audio Player */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)'
                  }}>
                    ▶️
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: `${Math.random() * 30 + 10}px`,
                          background: '#00ff88',
                          borderRadius: '2px',
                          animation: `waveform ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  🎧 Multi-host Discussion • 12:34
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Listen to Your Research.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Transform any notebook into an engaging, multi-host audio discussion with a single click. 
                Perfect for understanding complex topics on your commute, at the gym, or on the go.
              </p>
            </div>

            {/* Component 3: Learning Tools */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Study Guide */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '60px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '2px solid rgba(0, 255, 136, 0.4)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem'
                    }}>📚</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#00ff88',
                      fontWeight: '600'
                    }}>
                      STUDY GUIDE
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📝 FAQs
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📅 Timeline
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📋 Brief
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    🎯 Quiz
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                From Sources to Study Guide. Instantly.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Don't just read—understand. Instantly generate FAQs, timelines, briefing docs, 
                and study guides from any notebook's content. Master complex topics faster than ever before.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}>
              Ready to Experience the Future of Research?
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Join thousands of researchers who are already transforming how they work with information. 
              No guesswork, just powerful tools that make research faster and more insightful.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                🚀 Explore Notebooks
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
                📚 Share Your Work
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Unlock the Power of a Notebook Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        padding: '6rem 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Unlock the Power of a <span style={{ color: '#00ff88' }}>Notebook</span>
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover what makes NotebookLM revolutionary. These aren't just static files - 
              they're interactive knowledge bases that transform how you work with information.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Component 1: Interactive Chat */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Chat Interface */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    📄
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#e2e8f0',
                    textAlign: 'left'
                  }}>
                    "What were the key findings from the 2024 report?"
                  </div>
                </div>
                <div style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    "Based on the 2024 Climate Research Report (page 23), the key findings include..."
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#00ff88',
                    fontWeight: '600'
                  }}>
                    ✓ Cited from source documents
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Ask It Anything.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Go beyond simple reading. Chat directly with the source materials in any notebook. 
                Get instant, cited answers to your questions without ever leaving the page.
              </p>
            </div>

            {/* Component 2: Audio Overviews */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Audio Player */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#0a0a0a',
                    fontWeight: '700',
                    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)'
                  }}>
                    ▶️
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '4px',
                          height: `${Math.random() * 30 + 10}px`,
                          background: '#00ff88',
                          borderRadius: '2px',
                          animation: `waveform ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  🎧 Multi-host Discussion • 12:34
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                Listen to Your Research.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Transform any notebook into an engaging, multi-host audio discussion with a single click. 
                Perfect for understanding complex topics on your commute, at the gym, or on the go.
              </p>
            </div>

            {/* Component 3: Learning Tools */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Visual: Study Guide */}
              <div style={{
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '80px',
                    height: '60px',
                    background: 'rgba(0, 255, 136, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '2px solid rgba(0, 255, 136, 0.4)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem'
                    }}>📚</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#00ff88',
                      fontWeight: '600'
                    }}>
                      STUDY GUIDE
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📝 FAQs
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📅 Timeline
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📋 Brief
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    🎯 Quiz
                  </div>
                </div>
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 1rem 0'
              }}>
                From Sources to Study Guide. Instantly.
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Don't just read—understand. Instantly generate FAQs, timelines, briefing docs, 
                and study guides from any notebook's content. Master complex topics faster than ever before.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}>
              Ready to Experience the Future of Research?
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              margin: '0 0 2rem 0',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
              Join thousands of researchers who are already transforming how they work with information. 
              No guesswork, just powerful tools that make research faster and more insightful.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                🚀 Explore Notebooks
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
                📚 Share Your Work
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="support" style={{ 
              </p>
            </div>
            
            <div style={{
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💡</div>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Self-Interest</h3>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                Resource efficiency translates to faster results, lower costs, and better reliability. 
                Sustainable systems are inherently more robust and performant.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Identity</h3>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                Using responsible tools that reflect your expertise and values. 
                Professional identity aligned with environmental consciousness and technical excellence.
        background: '#0a0a0a',
        padding: '6rem 0',
        borderTop: '1px solid rgba(0, 255, 136, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1.5rem 0',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Building the Future of <span style={{ color: '#00ff88' }}>AI Research</span> Community
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
                Build a smarter AI ecosystem where shared knowledge prevents redundant work. Every notebook shared saves computational resources and accelerates discovery for the entire community.
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
                Every shared notebook prevents duplicate experiments, reducing the computational footprint of AI research. Smart sharing means less waste and faster progress for everyone.
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
                Join researchers worldwide who are building the future of AI through collaboration. Together, we're creating a comprehensive directory that makes innovation faster and more accessible.
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
              Help us build the definitive NotebookLM directory. Your support enables us to create better discovery tools, prevent redundant research, and accelerate innovation for the entire AI community.
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
              Building the Future of <span style={{ color: '#00ff88' }}>Sustainable</span><br />
              AI Research Discovery<br />
              <span style={{ color: '#00ff88' }}>One Notebook at a Time</span>
            </h2>
            
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              margin: '0 0 2rem 0',
              textAlign: 'center'
            }}>
              Every shared notebook prevents redundant research, saves computational resources, 
              and accelerates discovery for the entire AI community.
            </p>
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
              <span style={{ 
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '700'
              }}>
                notebooklm.directory
              </span> requires <span style={{ color: '#00ff88' }}>zero change</span><br />
              to your research workflow
            </h2>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem',
              textAlign: 'center',
              margin: '0 0 3rem 0'
            }}>
              Est. July 2025 - Building smarter research through community collaboration
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
                  You discover relevant research faster.<br />
                  Your computational costs decrease.<br />
                  Your environmental impact improves.<br />
                  Your professional values align.
                  color: '#ffffff',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  🔍 Discover cutting-edge NotebookLM projects<br />
                  🤝 Connect with researchers worldwide<br />
                  🚀 Share your work and accelerate discovery<br />
                  💡 Build on existing knowledge, don't reinvent
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
                  🌱<br />
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
            🎧 Listen to the <span style={{ color: '#00ff88' }}>Vision</span>
          </h2>
          <p style={{ 
            color: '#e2e8f0', 
            margin: '0 0 2rem 0',
            fontSize: '1.1rem'
          }}>
            Hear our AI-generated overview of how sustainable AI research is transforming the future
          </p>
          <AudioPlayer 
            audioUrl="/overview.mp3"
            title="Listen to the Vision"
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
          50% { opacity: 0.7; }
        }
        @keyframes directoryGlow {
          0% { 
            filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.4));
            textShadow: 0 0 20px rgba(0, 255, 136, 0.3);
            transform: scale(1);
          }
          100% { 
            filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.6));
            textShadow: 0 0 30px rgba(0, 255, 136, 0.5);
            transform: scale(1.01);
          }
        }
        @keyframes directoryShimmer {
          0% { 
            filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.4));
            textShadow: 0 0 20px rgba(0, 255, 136, 0.3);
            transform: scale(1);
          }
          100% { 
            filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.6));
            textShadow: 0 0 30px rgba(0, 255, 136, 0.5);
            transform: scale(1.01);
          }
        }
        @keyframes waveform {
          0% { height: 10px; }
          100% { height: 30px; }
        }
      `}</style>
    </Layout>
  );
}