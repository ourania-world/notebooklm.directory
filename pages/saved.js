import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { getCurrentUser } from '../lib/supabase';
import { getSavedNotebooks } from '../lib/profiles';

export default function SavedNotebooks() {
  const [user, setUser] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Redirect to home if no user, but don't throw error
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return;
        }

        setUser(currentUser);
        const savedNotebooks = await getSavedNotebooks(currentUser.id);
        setNotebooks(savedNotebooks);
      } catch (err) {
        console.error('Error loading saved notebooks:', err);
        setError('Failed to load your saved notebooks');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout title="Saved Notebooks - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p>Loading your saved notebooks...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Saved Notebooks - NotebookLM Directory">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p>Please sign in to view your saved notebooks.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Saved Notebooks - NotebookLM Directory">
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
            Saved Notebooks
          </h1>
          
          <button
            onClick={() => window.location.href = '/browse'}
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
            Browse More Notebooks
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💾</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#212529' }}>
              No saved notebooks yet
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
              Start saving notebooks that interest you to build your personal collection.
            </p>
            <button
              onClick={() => window.location.href = '/browse'}
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
              Browse Notebooks
            </button>
          </div>
        ) : (
          <>
            <p style={{ 
              color: '#6c757d', 
              margin: '0 0 2rem 0',
              fontSize: '1rem'
            }}>
              You have saved {notebooks.length} notebook{notebooks.length !== 1 ? 's' : ''}
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