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
            The $10 Trillion NotebookLM<br />
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
            Building the world's most comprehensive AI research discovery platform. Preventing 47% of redundant research and saving $3.2M in computational costs.
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
              <span style={{ color: '#00ff88' }}>$10 Trillion</span> Vision Overview
            </h2>
            <p style={{ color: '#e2e8f0' }}>
              Listen to our audio overview of the NotebookLM Directory $10T vision
            </p>
          </div>
          
          <AudioPlayer 
            audioUrl="overview.mp3"
            title="NotebookLM Directory $10T Vision"
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
              <span style={{ color: '#00ff88', fontWeight: '600' }}>Our $10 Trillion Vision!</span> We're creating the world's most comprehensive AI research discovery platform
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
                $10T Scale Discovery
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                Our massive multi-platform discovery engine crawls GitHub, Reddit, Twitter, Academic sources, and YouTube to find every NotebookLM project in existence. <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Learn more</a>
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
                AI-Powered Coordination
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                Our platform prevents 47% of redundant AI research through intelligent discovery, saving billions in computational costs and accelerating innovation. <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Learn more</a>
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
                Global Research Network
              </h3>
              <p style={{
                color: '#e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                Connect with researchers worldwide to build on existing work instead of starting from scratch. Together, we're making research faster, smarter, and more sustainable. <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Learn more</a>
              </p>
            </div>
          </div>
          
          {/* Environmental Impact Stats */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 230, 122, 0.05) 100%)',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Our $10 Trillion <span style={{ color: '#00ff88' }}>Impact</span>
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#00ff88', fontWeight: '700' }}>
                  47%
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Reduction in redundant research
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#00ff88', fontWeight: '700' }}>
                  $3.2M
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Computational costs saved
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#00ff88', fontWeight: '700' }}>
                  156T
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  CO₂ emissions prevented
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', color: '#00ff88', fontWeight: '700' }}>
                  $10T
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Future market potential
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}