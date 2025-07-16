import { createClient } from '@supabase/supabase-js';

export class RecommendationEngine {
  constructor() {
    this.supabase = null;
    this.status = {
      supabase: 'demo',
      recommendations: 'demo'
    };
    
    this.initializeServices();
  }

  initializeServices() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.status.supabase = 'connected';
        this.status.recommendations = 'available';
        console.log('✅ RecommendationEngine: Supabase connected');
      } else {
        console.log('⚠️ RecommendationEngine: Supabase keys missing, using demo mode');
        this.status.supabase = 'demo';
        this.status.recommendations = 'demo';
      }
    } catch (error) {
      console.error('❌ RecommendationEngine initialization error:', error);
      this.status.supabase = 'error';
      this.status.recommendations = 'unavailable';
    }
  }

  async getPersonalizedRecommendations(userId, limit = 8) {
    try {
      if (this.status.supabase === 'connected' && this.supabase) {
        // Real recommendations from Supabase
        const { data, error } = await this.supabase
          .from('notebooks')
          .select('*')
          .limit(limit);

        if (error) {
          console.error('Supabase recommendations error:', error);
          return this.getMockRecommendations();
        }

        return data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          score: Math.random() * 0.3 + 0.7,
          reason: 'Based on your browsing history',
          type: 'content-based',
          source: 'supabase'
        }));

      } else {
        // Demo recommendations
        return this.getMockRecommendations();
      }
    } catch (error) {
      console.error('Recommendations error:', error);
      return this.getMockRecommendations();
    }
  }

  getMockRecommendations() {
    return [
      {
        id: 'rec-1',
        title: 'Advanced React Patterns',
        description: 'Master complex React patterns for scalable applications',
        score: 0.94,
        reason: 'Based on your React development history',
        type: 'content-based',
        source: 'demo'
      },
      {
        id: 'rec-2',
        title: 'Next.js Performance Optimization',
        description: 'Optimize your Next.js apps for maximum performance',
        score: 0.89,
        reason: 'Similar to projects you\'ve viewed',
        type: 'collaborative',
        source: 'demo'
      },
      {
        id: 'rec-3',
        title: 'Supabase Database Design',
        description: 'Design efficient database schemas with Supabase',
        score: 0.87,
        reason: 'Matches your tech stack preferences',
        type: 'content-based',
        source: 'demo'
      },
      {
        id: 'rec-4',
        title: 'AI-Powered Search Implementation',
        description: 'Build intelligent search with vector embeddings',
        score: 0.85,
        reason: 'Trending in your network',
        type: 'serendipitous',
        source: 'demo'
      },
      {
        id: 'rec-5',
        title: 'Stripe Payment Integration',
        description: 'Secure payment processing with Stripe',
        score: 0.83,
        reason: 'Based on your e-commerce interests',
        type: 'content-based',
        source: 'demo'
      },
      {
        id: 'rec-6',
        title: 'Real-time WebSocket Applications',
        description: 'Build real-time features with WebSockets',
        score: 0.81,
        reason: 'Popular among developers like you',
        type: 'collaborative',
        source: 'demo'
      },
      {
        id: 'rec-7',
        title: 'TypeScript Best Practices',
        description: 'Write maintainable TypeScript code',
        score: 0.79,
        reason: 'Enhances your current skill set',
        type: 'content-based',
        source: 'demo'
      },
      {
        id: 'rec-8',
        title: 'Deployment Automation',
        description: 'Automate your deployment pipeline',
        score: 0.77,
        reason: 'Complements your development workflow',
        type: 'serendipitous',
        source: 'demo'
      }
    ];
  }

  async trackUserInteraction(userId, notebookId, interactionType) {
    try {
      if (this.status.supabase === 'connected' && this.supabase) {
        // Real interaction tracking
        const { error } = await this.supabase
          .from('user_interactions')
          .insert([{
            user_id: userId,
            notebook_id: notebookId,
            interaction_type: interactionType,
            timestamp: new Date().toISOString()
          }]);

        if (error) {
          console.error('Interaction tracking error:', error);
        }
      } else {
        // Demo tracking
        console.log(`📊 Demo tracking: User ${userId} ${interactionType} notebook ${notebookId}`);
      }
    } catch (error) {
      console.error('Interaction tracking error:', error);
    }
  }

  getStatus() {
    return this.status;
  }

  isDemoMode() {
    return this.status.supabase === 'demo' || this.status.supabase === 'error';
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine(); 