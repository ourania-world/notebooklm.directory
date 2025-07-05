import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { getCurrentUser } from '../lib/auth';
import { getUserNotebooks } from '../lib/profiles';

export default function MyNotebooks() {
  const [user, setUser] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          window.location.href = '/';
          return;
        }

        setUser(currentUser);
        const userNotebooks = await getUserNotebooks(currentUser.id);
        setNotebooks(userNotebooks);
      } catch (err) {
        console.error('Error loading notebooks:', err);
        setError('Failed to load your notebooks');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout title="My Notebooks - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p>Loading your notebooks...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="My Notebooks - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p>Please sign in to view your notebooks.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Notebooks - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: 0,
            color: '#212529'
          }}>
            My Notebooks
          </h1>
          
          <button
            onClick={() => window.location.href = '/submit'}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            + Submit New Notebook
          </button>
        </div>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {notebooks.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#212529' }}>
              No notebooks yet
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
              You haven't submitted any notebooks yet. Share your first NotebookLM project with the community!
            </p>
            <button
              onClick={() => window.location.href = '/submit'}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Submit Your First Notebook
            </button>
          </div>
        ) : (
          <>
            <p style={{ 
              color: '#6c757d', 
              margin: '0 0 2rem 0',
              fontSize: '1rem'
            }}>
              You have submitted {notebooks.length} notebook{notebooks.length !== 1 ? 's' : ''}
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '2rem'
            }}>
              {notebooks.map(notebook => (
                <ProjectCard key={notebook.id} notebook={notebook} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}