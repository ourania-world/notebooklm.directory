import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout>
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Our Platform</h1>
            <div className="hero-description">
              <p>
                Discover amazing content and explore our features.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
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
      
  );
}