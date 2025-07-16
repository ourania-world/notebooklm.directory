import { supabase } from './supabase';

export interface UserInteraction {
  id: string;
  user_id: string;
  content_id: string;
  interaction_type: 'view' | 'like' | 'share' | 'bookmark' | 'download';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  source: string;
  score: number;
  reason: string;
  tags: string[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  preferences: string[];
  interests: string[];
  activity_level: 'low' | 'medium' | 'high';
  last_active: string;
}

export interface RecommendationOptions {
  limit?: number;
  categories?: string[];
  exclude_viewed?: boolean;
  include_trending?: boolean;
  personalization_weight?: number;
}

class RecommendationEngine {
  private isConnected: boolean = false;

  constructor() {
    this.checkConnection();
  }

  private async checkConnection() {
    try {
      const { data, error } = await supabase.from('notebooks').select('count').limit(1);
      this.isConnected = !error;
    } catch (error) {
      this.isConnected = false;
      console.warn('Recommendation Engine: Running in demo mode');
    }
  }

  public getStatus() {
    return {
      supabase: this.isConnected ? 'connected' : 'demo',
      recommendations: this.isConnected ? 'functional' : 'demo',
      personalization: this.isConnected ? 'active' : 'demo'
    };
  }

  // Get personalized recommendations for a user
  public async getPersonalizedRecommendations(
    userId: string, 
    limit: number = 10, 
    options: RecommendationOptions = {}
  ): Promise<RecommendationItem[]> {
    if (!this.isConnected) {
      return this.demoRecommendations(limit);
    }

    try {
      const { 
        categories = [], 
        exclude_viewed = true, 
        include_trending = true,
        personalization_weight = 0.7 
      } = options;

      // Get user profile and interactions
      const userProfile = await this.getUserProfile(userId);
      const userInteractions = await this.getUserInteractions(userId);
      const viewedContentIds = userInteractions
        .filter(interaction => interaction.interaction_type === 'view')
        .map(interaction => interaction.content_id);

      // Build recommendation query
      let query = supabase
        .from('notebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Get more to filter

      // Apply category filter if specified
      if (categories.length > 0) {
        query = query.in('category', categories);
      }

      // Exclude viewed content if requested
      if (exclude_viewed && viewedContentIds.length > 0) {
        query = query.not('id', 'in', `(${viewedContentIds.join(',')})`);
      }

      const { data: content, error } = await query;

      if (error) throw error;

      // Score and rank recommendations
      const scoredContent = (content || []).map(item => {
        const score = this.calculateRecommendationScore(
          item, 
          userProfile, 
          userInteractions, 
          personalization_weight
        );

        return {
          ...item,
          score,
          reason: this.getRecommendationReason(item, userProfile, userInteractions),
          tags: this.extractTags(item.title + ' ' + (item.description || ''))
        };
      });

      // Sort by score and return top results
      return scoredContent
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Recommendations error:', error);
      return this.demoRecommendations(limit);
    }
  }

  // Track user interaction
  public async trackInteraction(interaction: Omit<UserInteraction, 'id' | 'created_at'>): Promise<boolean> {
    if (!this.isConnected) {
      console.log('Demo mode: Interaction tracking simulated');
      return true;
    }

    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          ...interaction,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Interaction tracking error:', error);
      return false;
    }
  }

  // Get trending content
  public async getTrendingContent(limit: number = 10): Promise<RecommendationItem[]> {
    if (!this.isConnected) {
      return this.demoTrendingContent(limit);
    }

    try {
      // Get content with most interactions in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('notebooks')
        .select(`
          *,
          user_interactions!inner(
            interaction_type,
            created_at
          )
        `)
        .gte('user_interactions.created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        score: this.calculateTrendingScore(item),
        reason: 'Trending content',
        tags: this.extractTags(item.title + ' ' + (item.description || ''))
      }));

    } catch (error) {
      console.error('Trending content error:', error);
      return this.demoTrendingContent(limit);
    }
  }

  // Get similar content based on a reference item
  public async getSimilarContent(
    contentId: string, 
    limit: number = 10
  ): Promise<RecommendationItem[]> {
    if (!this.isConnected) {
      return this.demoSimilarContent(limit);
    }

    try {
      // Get the reference content
      const { data: referenceContent, error: refError } = await supabase
        .from('notebooks')
        .select('*')
        .eq('id', contentId)
        .single();

      if (refError) throw refError;

      // Find similar content based on category and tags
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .neq('id', contentId)
        .eq('category', referenceContent.category)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        score: this.calculateSimilarityScore(item, referenceContent),
        reason: `Similar to "${referenceContent.title}"`,
        tags: this.extractTags(item.title + ' ' + (item.description || ''))
      }));

    } catch (error) {
      console.error('Similar content error:', error);
      return this.demoSimilarContent(limit);
    }
  }

  // Get user profile
  private async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      // Return default profile if not found
      return {
        id: userId,
        preferences: ['ai', 'webdev', 'data'],
        interests: ['Machine Learning', 'React', 'Python'],
        activity_level: 'medium',
        last_active: new Date().toISOString()
      };
    }
  }

  // Get user interactions
  private async getUserInteractions(userId: string): Promise<UserInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user interactions error:', error);
      return [];
    }
  }

  // Calculate recommendation score
  private calculateRecommendationScore(
    content: any,
    userProfile: UserProfile,
    userInteractions: UserInteraction[],
    personalizationWeight: number
  ): number {
    let score = 0.5; // Base score

    // Category preference bonus
    if (userProfile.preferences.includes(content.category)) {
      score += 0.2;
    }

    // Interest matching bonus
    const contentText = (content.title + ' ' + (content.description || '')).toLowerCase();
    const interestMatches = userProfile.interests.filter(interest =>
      contentText.includes(interest.toLowerCase())
    ).length;
    score += interestMatches * 0.1;

    // Recency bonus
    const daysSinceCreation = (Date.now() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation < 7) score += 0.1;
    if (daysSinceCreation < 30) score += 0.05;

    // Interaction-based bonus
    const contentInteractions = userInteractions.filter(
      interaction => interaction.content_id === content.id
    );
    score += contentInteractions.length * 0.05;

    return Math.min(score, 1.0);
  }

  // Calculate trending score
  private calculateTrendingScore(content: any): number {
    let score = 0.5;

    // Recency bonus
    const daysSinceCreation = (Date.now() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation < 3) score += 0.3;
    else if (daysSinceCreation < 7) score += 0.2;
    else if (daysSinceCreation < 30) score += 0.1;

    // Interaction count bonus
    const interactionCount = content.user_interactions?.length || 0;
    score += Math.min(interactionCount * 0.05, 0.3);

    return Math.min(score, 1.0);
  }

  // Calculate similarity score
  private calculateSimilarityScore(content: any, referenceContent: any): number {
    let score = 0.5;

    // Category match
    if (content.category === referenceContent.category) {
      score += 0.3;
    }

    // Tag overlap
    const contentTags = this.extractTags(content.title + ' ' + (content.description || ''));
    const referenceTags = this.extractTags(referenceContent.title + ' ' + (referenceContent.description || ''));
    const tagOverlap = contentTags.filter(tag => referenceTags.includes(tag)).length;
    score += tagOverlap * 0.1;

    return Math.min(score, 1.0);
  }

  // Get recommendation reason
  private getRecommendationReason(
    content: any,
    userProfile: UserProfile,
    userInteractions: UserInteraction[]
  ): string {
    if (userProfile.preferences.includes(content.category)) {
      return `Based on your interest in ${content.category}`;
    }

    const contentText = (content.title + ' ' + (content.description || '')).toLowerCase();
    const matchingInterest = userProfile.interests.find(interest =>
      contentText.includes(interest.toLowerCase())
    );

    if (matchingInterest) {
      return `Matches your interest in ${matchingInterest}`;
    }

    return 'Recommended for you';
  }

  // Extract tags from content
  private extractTags(text: string): string[] {
    const commonTags = [
      'AI', 'Machine Learning', 'React', 'JavaScript', 'Python', 'Data Science',
      'Web Development', 'Design', 'Productivity', 'Business', 'Tutorials',
      'Frontend', 'Backend', 'Database', 'API', 'Cloud', 'DevOps'
    ];

    const foundTags = commonTags.filter(tag => 
      text.toLowerCase().includes(tag.toLowerCase())
    );

    return foundTags.slice(0, 5);
  }

  // Demo recommendations
  private demoRecommendations(limit: number): RecommendationItem[] {
    return [
      {
        id: 'rec1',
        title: 'Advanced React Patterns for 2024',
        description: 'Discover cutting-edge React patterns and best practices for building scalable applications',
        category: 'webdev',
        source: 'Medium',
        score: 0.95,
        reason: 'Based on your interest in webdev',
        tags: ['React', 'JavaScript', 'Frontend'],
        created_at: new Date().toISOString()
      },
      {
        id: 'rec2',
        title: 'Building AI-Powered Search with Vector Embeddings',
        description: 'Learn how to implement semantic search using vector databases and embeddings',
        category: 'ai',
        source: 'Dev.to',
        score: 0.92,
        reason: 'Matches your interest in AI',
        tags: ['AI', 'Vector Search', 'Machine Learning'],
        created_at: new Date().toISOString()
      },
      {
        id: 'rec3',
        title: 'Optimizing Database Performance at Scale',
        description: 'Advanced techniques for database optimization in high-traffic applications',
        category: 'data',
        source: 'Engineering Blog',
        score: 0.88,
        reason: 'Based on your interest in data',
        tags: ['Database', 'Performance', 'Scalability'],
        created_at: new Date().toISOString()
      }
    ].slice(0, limit);
  }

  // Demo trending content
  private demoTrendingContent(limit: number): RecommendationItem[] {
    return [
      {
        id: 'trend1',
        title: 'The Future of Content Discovery',
        description: 'Exploring next-generation content recommendation systems',
        category: 'ai',
        source: 'TechCrunch',
        score: 0.98,
        reason: 'Trending content',
        tags: ['AI', 'Recommendations', 'Discovery'],
        created_at: new Date().toISOString()
      },
      {
        id: 'trend2',
        title: 'Modern CSS Techniques for 2024',
        description: 'Explore the latest CSS features and techniques for modern web development',
        category: 'webdev',
        source: 'CSS Tricks',
        score: 0.95,
        reason: 'Trending content',
        tags: ['CSS', 'Frontend', 'Design'],
        created_at: new Date().toISOString()
      }
    ].slice(0, limit);
  }

  // Demo similar content
  private demoSimilarContent(limit: number): RecommendationItem[] {
    return [
      {
        id: 'similar1',
        title: 'React Performance Optimization Guide',
        description: 'Comprehensive guide to optimizing React application performance',
        category: 'webdev',
        source: 'React Blog',
        score: 0.85,
        reason: 'Similar to "Advanced React Patterns for 2024"',
        tags: ['React', 'Performance', 'Frontend'],
        created_at: new Date().toISOString()
      },
      {
        id: 'similar2',
        title: 'State Management in React Applications',
        description: 'Best practices for managing state in complex React applications',
        category: 'webdev',
        source: 'Medium',
        score: 0.82,
        reason: 'Similar to "Advanced React Patterns for 2024"',
        tags: ['React', 'State Management', 'Frontend'],
        created_at: new Date().toISOString()
      }
    ].slice(0, limit);
  }
}

export const recommendationEngine = new RecommendationEngine(); 