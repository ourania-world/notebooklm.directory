import { createClient } from '@supabase/supabase-js';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  score: number;
  reason: string;
  type: 'content-based' | 'collaborative' | 'serendipitous';
}

export interface RecommendationStatus {
  supabase: 'connected' | 'error' | 'demo';
  recommendations: 'available' | 'unavailable' | 'demo';
}

export class RecommendationEngine {
  private supabase: any = null;
  private status: RecommendationStatus = {
    supabase: 'demo',
    recommendations: 'demo'
  };

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        this.status.supabase = 'connected';
        this.status.recommendations = 'available';
        console.log('✅ RecommendationEngine: Supabase connected');
      } else {
        console.warn('⚠️ RecommendationEngine: Supabase credentials missing, using demo mode');
        this.status.supabase = 'demo';
        this.status.recommendations = 'demo';
      }
    } catch (error) {
      console.error('❌ RecommendationEngine: Supabase initialization failed:', error);
      this.status.supabase = 'error';
      this.status.recommendations = 'demo';
    }
  }

  getStatus(): RecommendationStatus {
    return { ...this.status };
  }

  private getMockRecommendations(limit: number): Recommendation[] {
    const mockRecommendations: Recommendation[] = [
      {
        id: 'rec-1',
        title: 'Advanced Machine Learning Techniques',
        description: 'Deep dive into cutting-edge ML algorithms and implementations',
        score: 0.95,
        reason: 'Based on your interest in AI research',
        type: 'content-based'
      },
      {
        id: 'rec-2',
        title: 'Data Visualization Masterclass',
        description: 'Comprehensive guide to creating stunning data visualizations',
        score: 0.88,
        reason: 'Popular among similar users',
        type: 'collaborative'
      },
      {
        id: 'rec-3',
        title: 'Natural Language Processing Workshop',
        description: 'Hands-on workshop for NLP and text analysis',
        score: 0.82,
        reason: 'Similar to your recent searches',
        type: 'content-based'
      },
      {
        id: 'rec-4',
        title: 'Business Analytics Framework',
        description: 'Complete framework for business intelligence and analytics',
        score: 0.79,
        reason: 'Trending in your field',
        type: 'serendipitous'
      },
      {
        id: 'rec-5',
        title: 'Creative AI Applications',
        description: 'Innovative applications of AI in creative fields',
        score: 0.76,
        reason: 'Discovering new content for you',
        type: 'serendipitous'
      },
      {
        id: 'rec-6',
        title: 'Research Methodology Guide',
        description: 'Comprehensive guide to academic research methods',
        score: 0.73,
        reason: 'Based on your academic interests',
        type: 'content-based'
      },
      {
        id: 'rec-7',
        title: 'Statistical Analysis Techniques',
        description: 'Advanced statistical methods for data analysis',
        score: 0.70,
        reason: 'Popular among researchers',
        type: 'collaborative'
      },
      {
        id: 'rec-8',
        title: 'Interactive Dashboard Design',
        description: 'Best practices for creating interactive data dashboards',
        score: 0.67,
        reason: 'Complementary to your skills',
        type: 'serendipitous'
      }
    ];

    return mockRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(rec => ({
        ...rec,
        score: rec.score * (0.8 + Math.random() * 0.2) // Add some randomness
      }));
  }

  async generateRecommendations(userId: string, limit = 20): Promise<Recommendation[]> {
    console.log(`🎯 Generating recommendations for user ${userId}...`);
    
    try {
      if (this.supabase && this.status.recommendations === 'available') {
        // Get all recommendation types
        const contentBased = await this.getContentBasedRecommendations(userId, 10);
        const collaborative = await this.getCollaborativeRecommendations(userId, 5);
        const serendipitous = await this.getSerendipitousRecommendations(userId, 5);

        // Combine and sort by score
        const allRecommendations = [...contentBased, ...collaborative, ...serendipitous]
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);

        // Remove duplicates
        const uniqueRecommendations = this.removeDuplicates(allRecommendations);

        console.log(`✅ Generated ${uniqueRecommendations.length} recommendations`);
        return uniqueRecommendations;
      } else {
        console.log('🎭 Using mock recommendations (demo mode)');
        return this.getMockRecommendations(limit);
      }
    } catch (error) {
      console.error('❌ Error generating recommendations, using mock:', error);
      return this.getMockRecommendations(limit);
    }
  }

  private async getContentBasedRecommendations(userId: string, limit: number): Promise<Recommendation[]> {
    try {
      // Get user's interaction history
      const { data: userInteractions } = await this.supabase
        .from('user_interactions')
        .select('notebook_id, interaction_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!userInteractions || userInteractions.length === 0) {
        return [];
      }

      // Get notebooks the user has interacted with
      const notebookIds = userInteractions.map(interaction => interaction.notebook_id);
      
      // Find similar notebooks using vector similarity
      const { data: similarNotebooks } = await this.supabase
        .from('notebooks')
        .select('id, title, description, embedding')
        .in('id', notebookIds);

      if (!similarNotebooks || similarNotebooks.length === 0) {
        return [];
      }

      // Use vector similarity to find related content
      const recommendations: Recommendation[] = [];
      
      for (const notebook of similarNotebooks) {
        if (notebook.embedding) {
          const { data: similar } = await this.supabase.rpc('hybrid_search', {
            search_query: notebook.title,
            query_embedding: notebook.embedding,
            match_threshold: 0.7,
            match_count: 5
          });

          if (similar) {
            for (const item of similar) {
              if (!notebookIds.includes(item.id)) {
                recommendations.push({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  score: item.similarity * 0.8, // Content-based weight
                  reason: `Similar to "${notebook.title}"`,
                  type: 'content-based'
                });
              }
            }
          }
        }
      }

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('❌ Error getting content-based recommendations:', error);
      return [];
    }
  }

  private async getCollaborativeRecommendations(userId: string, limit: number): Promise<Recommendation[]> {
    try {
      // Find users with similar preferences
      const { data: similarUsers } = await this.supabase
        .from('user_interactions')
        .select('user_id, notebook_id')
        .neq('user_id', userId);

      if (!similarUsers || similarUsers.length === 0) {
        return [];
      }

      // Get current user's interactions
      const { data: userInteractions } = await this.supabase
        .from('user_interactions')
        .select('notebook_id')
        .eq('user_id', userId);

      if (!userInteractions) {
        return [];
      }

      const userNotebookIds = userInteractions.map(i => i.notebook_id);

      // Find notebooks that similar users liked but current user hasn't seen
      const recommendations: Recommendation[] = [];
      const notebookScores: { [key: string]: number } = {};

      for (const interaction of similarUsers) {
        if (!userNotebookIds.includes(interaction.notebook_id)) {
          notebookScores[interaction.notebook_id] = (notebookScores[interaction.notebook_id] || 0) + 1;
        }
      }

      // Get top collaborative recommendations
      const topNotebookIds = Object.entries(notebookScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id);

      if (topNotebookIds.length > 0) {
        const { data: notebooks } = await this.supabase
          .from('notebooks')
          .select('id, title, description')
          .in('id', topNotebookIds);

        if (notebooks) {
          for (const notebook of notebooks) {
            recommendations.push({
              id: notebook.id,
              title: notebook.title,
              description: notebook.description,
              score: (notebookScores[notebook.id] || 0) * 0.6, // Collaborative weight
              reason: `Popular among similar users`,
              type: 'collaborative'
            });
          }
        }
      }

      return recommendations;
    } catch (error) {
      console.error('❌ Error getting collaborative recommendations:', error);
      return [];
    }
  }

  private async getSerendipitousRecommendations(userId: string, limit: number): Promise<Recommendation[]> {
    try {
      // Get random high-quality notebooks
      const { data: randomNotebooks } = await this.supabase
        .from('notebooks')
        .select('id, title, description, quality_score, view_count')
        .gte('quality_score', 0.7)
        .gte('view_count', 10)
        .order('RANDOM()')
        .limit(limit * 2);

      if (!randomNotebooks) {
        return [];
      }

      // Get user's seen notebooks
      const { data: userInteractions } = await this.supabase
        .from('user_interactions')
        .select('notebook_id')
        .eq('user_id', userId);

      const seenNotebookIds = userInteractions?.map(i => i.notebook_id) || [];

      // Filter out seen notebooks and calculate serendipity scores
      const recommendations: Recommendation[] = [];

      for (const notebook of randomNotebooks) {
        if (!seenNotebookIds.includes(notebook.id)) {
          const serendipityScore = this.calculateSerendipityScore(notebook);
          
          recommendations.push({
            id: notebook.id,
            title: notebook.title,
            description: notebook.description,
            score: serendipityScore,
            reason: 'Discovering new content for you',
            type: 'serendipitous'
          });
        }
      }

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('❌ Error getting serendipitous recommendations:', error);
      return [];
    }
  }

  private calculateSerendipityScore(notebook: any): number {
    const qualityScore = notebook.quality_score || 0.5;
    const viewCount = notebook.view_count || 0;
    const popularityFactor = Math.min(viewCount / 100, 1); // Normalize to 0-1
    
    // Serendipity favors high quality but not overly popular content
    return qualityScore * (0.7 + 0.3 * (1 - popularityFactor));
  }

  private removeDuplicates(recommendations: Recommendation[]): Recommendation[] {
    const seen = new Set();
    return recommendations.filter(rec => {
      const key = rec.id;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async updateUserPreferences(userId: string, notebookId: string, interactionType: string): Promise<void> {
    try {
      if (this.supabase && this.status.supabase === 'connected') {
        await this.supabase
          .from('user_interactions')
          .insert({
            user_id: userId,
            notebook_id: notebookId,
            interaction_type: interactionType,
            created_at: new Date().toISOString()
          });
      } else {
        console.log('🎭 Mock user preference update (demo mode)');
      }
    } catch (error) {
      console.error('❌ Error updating user preferences:', error);
    }
  }

  // Demo mode utilities
  isDemoMode(): boolean {
    return this.status.recommendations === 'demo';
  }

  getConnectionStatus(): string {
    if (this.status.recommendations === 'available') {
      return '🟢 Recommendations available';
    } else {
      return '🔴 Demo mode - check Supabase connection';
    }
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine(); 