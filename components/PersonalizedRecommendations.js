import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/auth';
import { getNotebooks } from '../lib/notebooks';
import ProjectCard from './ProjectCard';

export default function PersonalizedRecommendations({ limit = 6 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // For now, we'll just get featured notebooks as recommendations
        // In a real implementation, this would call a personalization API
        const recommendedNotebooks = await getNotebooks({ 
          featured: true,
          limit: limit
        });
        
        setRecommendations(recommendedNotebooks || []);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadRecommendations();
  }, [limit]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#e2e8f0' }}>Loading recommendations...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: '2.5rem', 
        textAlign: 'center', 
        margin: '0 0 1rem 0',
        color: '#ffffff',
        fontWeight: '700'
      }}>
        Recommended for <span style={{ color: '#00ff88' }}>You</span>
      </h2>
      
      <p style={{ 
        color: '#e2e8f0', 
        textAlign: 'center',
        fontSize: '1.1rem',
        maxWidth: '700px',
        margin: '0 auto 3rem auto'
      }}>
        {user ? 
          'Personalized recommendations based on your interests and activity' : 
          'Sign in to get personalized recommendations tailored to your interests'}
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {recommendations.map(notebook => (
          <ProjectCard key={notebook.id} notebook={notebook} />
        ))}
      </div>
    </div>
  );
}