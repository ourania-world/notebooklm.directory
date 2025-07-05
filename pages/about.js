import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About - NotebookLM Directory">
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          margin: '0 0 2rem 0',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          About <span style={{ color: '#00ff88' }}>NotebookLM Directory</span>
        </h1>
        
        <div style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.7',
          color: '#e2e8f0'
        }}>
          <p>
            NotebookLM Directory launched on Independence Day 2025 🇺🇸 as a curated collection of innovative projects built with Google's NotebookLM platform. 
            Our mission is to democratize access to AI-assisted research and inspire new applications across diverse domains.
          </p>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0',
            color: '#ffffff',
            fontWeight: '600'
          }}>
            What is NotebookLM?
          </h2>
          
          <p>
            NotebookLM is Google's experimental AI-powered research assistant that helps you understand complex topics 
            by analyzing your uploaded documents. It can generate summaries, answer questions, create study guides, 
            and even produce audio overviews of your research materials.
          </p>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0',
            color: '#ffffff',
            fontWeight: '600'
          }}>
            Our Independence Day Vision
          </h2>
          
          <p>
            Launched on July 4th, 2025, we believe that AI-assisted research tools like NotebookLM should be free and accessible to all. 
            By building the world's most comprehensive directory, we aim to:
          </p>
          
          <ul style={{ 
            margin: '1rem 0', 
            paddingLeft: '2rem',
            color: '#e2e8f0'
          }}>
            <li>Inspire researchers, students, and professionals to explore new applications</li>
            <li>Democratize access to advanced research methodologies</li>
            <li>Build the world's largest community of AI-assisted researchers</li>
            <li>Celebrate the independence of knowledge from traditional barriers</li>
          </ul>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0',
            color: '#ffffff',
            fontWeight: '600'
          }}>
            Get Involved
          </h2>
          
          <p>
            Whether you're a researcher, educator, entrepreneur, or curious learner, we invite you to:
          </p>
          
          <ul style={{ 
            margin: '1rem 0', 
            paddingLeft: '2rem',
            color: '#e2e8f0'
          }}>
            <li>Browse our curated collection of projects for inspiration</li>
            <li>Submit your own NotebookLM projects to share with the community</li>
            <li>Learn from diverse approaches and methodologies</li>
            <li>Connect with other innovators in AI-assisted research</li>
          </ul>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '2rem',
            borderRadius: '16px',
            margin: '2rem 0',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0',
              color: '#ffffff',
              fontWeight: '600'
            }}>
              🚀 Ready to get started?
            </h3>
            <p style={{ margin: '0 0 1rem 0' }}>
              Explore our featured projects or submit your own innovative NotebookLM application.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: '#0a0a0a',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)'
              }}>
                Browse Projects
              </button>
              <button style={{
                background: 'transparent',
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}>
                Submit Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}