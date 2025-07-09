import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import FeaturedCollections from '../components/FeaturedCollections';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import SearchBar from '../components/SearchBar';
import AudioPlayer from '../components/AudioPlayer';
import { getNotebooks } from '../lib/notebooks';

export async function getServerSideProps() {
  try {
    // Fetch featured notebooks on server side
    const featuredNotebooks = await getNotebooks({ featured: true, limit: 6 });
    
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
  const [featuredNotebooks, setFeaturedNotebooks] = useState(initialFeaturedNotebooks);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real implementation, this would navigate to search results
    window.location.href = `/browse?search=${encodeURIComponent(query)}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        backgroundSize: '200% 200%',
        className: 'morphing-bg subtle-pattern',
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
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}></div>
        <div style={{ 
          maxWidth: '1200px',  
          margin: '0 auto', 
          padding: '0 2rem',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: '800',  
            margin: '0 0 1rem 0', 
            lineHeight: '1',
            color: '#ffffff'
          }}>
            The Premier NotebookLM<br />
            <span className="neon-text">Directory</span>
          </h1>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 1.5rem 0', 
            color: '#ffffff', 
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}> 
            <span className="float-animation">Discover. Build. <span style={{ color: '#00ff88' }}>Accelerate.</span></span>
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
            Discover innovative NotebookLM projects, share your own work, and connect with a community of researchers and creators. The premier platform for NotebookLM exploration.
          </p>
          
          {/* Search Bar */}
          <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',  
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <Link href="/browse" style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: '#0a0a0a',
              border: 'none', 
              padding: '1.25rem 2.5rem', 
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0, 255, 136, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px', 
              textDecoration: 'none', 
              display: 'inline-block',
              className: 'button-glow'
            }}>
              BROWSE PROJECTS
            </Link>
            
            <Link href="/submit" style={{
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer', 
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              SUBMIT PROJECT
            </Link>
          </div>
        </div>
      </section>
      
      {/* Audio Overview Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', 
        padding: '2rem 0 4rem 0'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              color: '#ffffff', 
              margin: '0 0 1rem 0',
              fontWeight: '700'
            }}>
              <span style={{ color: '#00ff88' }}>Vision</span> Overview
            </h2>
            <p style={{ color: '#e2e8f0' }}>
              Listen to our audio overview of the NotebookLM Directory vision
            </p>
          </div>
          
          <AudioPlayer 
            audioUrl="overview.mp3"
            title="NotebookLM Directory Vision"
            showWaveform={true}
          />
        </div>
      </section>
      
      {/* Featured Collections */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', 
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <FeaturedCollections />
        </div>
      </section>
      
      {/* Personalized Recommendations */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', 
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <PersonalizedRecommendations />
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
          
          <div style={{ 
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#e2e8f0',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <span style={{ color: '#00ff88', fontWeight: '600' }}>Subscribe & Support Our Growth!</span> We're creating the world's most comprehensive AI research discovery platform
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem', 
            marginBottom: '4rem'
          }}>
            {/* Feature 1 */}
            <div className="card-hover glass-card" style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2.5rem 2rem', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                <span className="float-animation" style={{ display: 'inline-block' }}>🔍</span>
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
                Hand-picked collection of innovative NotebookLM projects across domains. Only the highest quality research makes it to the directory. <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Learn more</a>
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card-hover glass-card" style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2.5rem 2rem', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                <span className="float-animation" style={{ display: 'inline-block' }}>🧠</span>
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
                AI-powered recommendations based on your interests and research history. Find exactly what you need for your next project. <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Learn more</a>
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card-hover glass-card" style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2.5rem 2rem', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}> 
                <span className="float-animation" style={{ display: 'inline-block' }}>🌍</span>
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
                Discover, share, and collaborate with researchers worldwide. Build on existing work instead of starting from scratch. <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Learn more</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}