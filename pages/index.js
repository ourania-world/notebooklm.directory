import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { sampleProjects } from '../data/sampleProjects';

export default function Notebooks() {
  const featuredProjects = sampleProjects.filter(project => project.featured);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            margin: '0 0 1rem 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            📘 NotebookLM Directory
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            margin: '0 0 2rem 0',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Discover innovative NotebookLM projects across domains. Get inspired, learn techniques, and share your own AI-powered research.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Browse Projects
            </button>
            <button style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Submit Your Project
            </button>
          </div>
        </div>
      </section>
      
      {/* Vision Audio Section */}
      <section style={{ 
        background: '#f8f9fa',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            margin: '0 0 1rem 0',
            color: '#212529'
          }}>
            🎧 Listen to the Vision
          </h2>
          <p style={{ 
            color: '#6c757d', 
            margin: '0 0 2rem 0',
            fontSize: '1.1rem'
          }}>
            Hear our AI-generated overview of how NotebookLM is transforming research and creativity
          </p>
          <audio controls style={{ width: '100%', maxWidth: '500px' }}>
            <source src="/NLM_D Overview.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            margin: '0 0 3rem 0',
            color: '#212529'
          }}>
            Featured Projects
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              View All Projects
            </button>
          </div>
        </div>
      </section>
      
      {/* Categories Preview */}
      <section style={{ 
        background: '#f8f9fa',
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            textAlign: 'center', 
            margin: '0 0 3rem 0',
            color: '#212529'
          }}>
            Explore by Category
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem'
          }}>
            {['Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal'].map(category => (
              <div key={category} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: '#212529',
                  fontSize: '1.25rem'
                }}>
                  {category}
                </h3>
                <p style={{ 
                  color: '#6c757d',
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
    </Layout>
  );
}