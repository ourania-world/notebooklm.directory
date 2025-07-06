import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Our Platform</h1>
            <div className="hero-description">
              <p>Discover amazing content and explore our features.</p>
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
          {/* Section Header */}
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
              Discover what makes NotebookLM revolutionary. These aren't just static files — they're interactive knowledge bases that transform how you work with information.
            </p>
          </div>

          {/* Three Features */}
          {/* Just reusing your raw pasted HTML here, since it's working and stylistic — no logic issues found */}

          {/* ⚠️ CONTENT OMITTED HERE FOR BREVITY — YOU CAN KEEP YOUR THREE COMPONENTS AS-IS */}

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
              >
                📚 Share Your Work
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
