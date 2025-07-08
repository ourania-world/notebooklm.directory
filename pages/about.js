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
          About <span style={{ 
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: '700'
          }}>
            notebooklm.
            <span style={{ color: '#00ff88' }}>directory</span>
          </span>
        </h1>
        
        <div style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.7', 
          color: '#e2e8f0'
        }}>
          <p>
            <strong style={{ 
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: '700'
            }}>
              notebooklm.directory
            </strong> launched in July 2025 with a revolutionary $10 trillion vision: to become the operating system for human knowledge discovery. We're not just building a directory - we're creating the infrastructure that will prevent billions in wasted AI computational resources while accelerating global research progress.
          </p>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0', 
            color: '#ffffff',
            fontWeight: '600'
          }}>
            The $10 Trillion Vision
          </h2>
          
          <p>
            By 2030, when someone starts any AI research project, their first step will be opening NotebookLM Directory. We're building a platform as essential to research as Google is to search, as fundamental as the internet itself.
          </p>
          
          <p>
            Our core positioning bridges technical credibility with environmental responsibility. We don't ask researchers to sacrifice performance for sustainability - our resource-efficient architecture IS why we deliver superior results.
          </p>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0', 
            color: '#ffffff',
            fontWeight: '600'
          }}>
            The Psychology of Sustainable Professional Values
          </h2>
          
          <p>
            Modern tech professionals are seeking to align their work with their values. For our audience - highly skilled data scientists and researchers - sustainability isn't a "feel-good" add-on; it's a marker of forward-thinking, well-managed, and ethically sound practice. We appeal to three key drivers: altruism (doing good), self-interest (better performance), and identity (using responsible tools).
          </p>
          
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)', 
            borderRadius: '12px',
            padding: '1.5rem',
            margin: '2rem 0'
          }}>
            <h4 style={{ color: '#00ff88', margin: '0 0 1rem 0' }}>
              🌱 The $10 Trillion Endgame
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#e2e8f0' }}>
              <li><strong>Universal Standard:</strong> Every AI researcher uses our platform daily</li>
              <li><strong>Knowledge Infrastructure:</strong> We become the foundational layer for all AI research</li>
              <li><strong>Global Coordination:</strong> Prevent duplicate work across all research institutions worldwide</li>
              <li><strong>Environmental Leadership:</strong> Measurably reduce global AI computational waste</li>
            </ul>
          </div>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0', 
            color: '#ffffff',
            fontWeight: '600'
          }}>
            The Network Effect Flywheel
          </h2>
          
          <p>
            Our growth strategy is built on a powerful network effect:
          </p>
          
          <ol style={{ 
            margin: '1rem 0', 
            paddingLeft: '2rem',
            color: '#e2e8f0'
          }}>
            <li><strong>More Notebooks</strong> → Better Discovery → More Users</li>
            <li><strong>More Users</strong> → More Content → Better Quality</li>
            <li><strong>Better Quality</strong> → Higher Value → Premium Pricing</li>
            <li><strong>Premium Revenue</strong> → Better Tools → More Attraction</li>
            <li><strong>Global Scale</strong> → Environmental Impact → Mission Fulfillment</li>
          </ol>
          
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
              🚀 Ready to join the $10 trillion future?
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