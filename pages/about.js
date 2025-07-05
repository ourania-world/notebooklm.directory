import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About - NotebookLM Directory">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#212529'
        }}>
          About NotebookLM Directory
        </h1>
        
        <div style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.7',
          color: '#495057'
        }}>
          <p>
            NotebookLM Directory is a curated collection of innovative projects built with Google's NotebookLM platform. 
            Our mission is to showcase the incredible potential of AI-assisted research and inspire new applications 
            across diverse domains.
          </p>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0',
            color: '#212529'
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
            color: '#212529'
          }}>
            Our Vision
          </h2>
          
          <p>
            We believe that AI-assisted research tools like NotebookLM can democratize access to deep analysis and 
            insight generation. By sharing real-world examples and use cases, we aim to:
          </p>
          
          <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
            <li>Inspire researchers, students, and professionals to explore new applications</li>
            <li>Provide templates and methodologies for effective AI-assisted research</li>
            <li>Build a community of practice around innovative research techniques</li>
            <li>Showcase the breadth of domains where NotebookLM can add value</li>
          </ul>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            margin: '2rem 0 1rem 0',
            color: '#212529'
          }}>
            Get Involved
          </h2>
          
          <p>
            Whether you're a researcher, educator, entrepreneur, or curious learner, we invite you to:
          </p>
          
          <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
            <li>Browse our curated collection of projects for inspiration</li>
            <li>Submit your own NotebookLM projects to share with the community</li>
            <li>Learn from diverse approaches and methodologies</li>
            <li>Connect with other innovators in AI-assisted research</li>
          </ul>
          
          <div style={{ 
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            margin: '2rem 0',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0',
              color: '#212529'
            }}>
              Ready to get started?
            </h3>
            <p style={{ margin: '0 0 1rem 0' }}>
              Explore our featured projects or submit your own innovative NotebookLM application.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Browse Projects
              </button>
              <button style={{
                background: 'transparent',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
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