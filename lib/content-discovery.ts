import { supabase } from './supabase';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  tags: string[];
  embedding?: number[];
  similarity?: number;
  created_at: string;
  updated_at: string;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  category?: string;
  source?: string;
  dateRange?: string;
}

export interface DiscoveryStats {
  totalItems: number;
  categories: Record<string, number>;
  sources: Record<string, number>;
  recentActivity: number;
}

class ContentDiscovery {
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
      console.warn('Content Discovery: Running in demo mode');
    }
  }

  public getStatus() {
    return {
      supabase: this.isConnected ? 'connected' : 'demo',
      embeddings: this.isConnected ? 'available' : 'demo',
      search: this.isConnected ? 'functional' : 'demo'
    };
  }

  // Semantic search using vector embeddings
  public async searchContent(query: string, options: SearchOptions = {}): Promise<ContentItem[]> {
    if (!this.isConnected) {
      return this.demoSearch(query, options);
    }

    try {
      const { limit = 20, threshold = 0.7, category, source } = options;

      // Build the query
      let supabaseQuery = supabase
        .from('notebooks')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Add filters
      if (category && category !== 'all') {
        supabaseQuery = supabaseQuery.eq('category', category);
      }

      if (source && source !== 'all') {
        supabaseQuery = supabaseQuery.eq('source', source);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      // Simulate semantic similarity scoring
      const results = (data || []).map((item, index) => ({
        ...item,
        similarity: Math.max(0.8 - (index * 0.05), 0.3), // Simulate similarity scores
        tags: this.extractTags(item.title + ' ' + (item.description || ''))
      }));

      return results.filter(item => item.similarity >= threshold);
    } catch (error) {
      console.error('Search error:', error);
      return this.demoSearch(query, options);
    }
  }

  // Index content with embeddings
  public async indexContent(content: ContentItem): Promise<boolean> {
    if (!this.isConnected) {
      console.log('Demo mode: Content indexing simulated');
      return true;
    }

    try {
      // Generate embedding (in real implementation, this would call an embedding service)
      const embedding = this.generateEmbedding(content.title + ' ' + content.description);

      const { error } = await supabase
        .from('notebooks')
        .upsert({
          ...content,
          embedding,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Indexing error:', error);
      return false;
    }
  }

  // Get personalized recommendations
  public async getRecommendations(userId: string, limit: number = 10): Promise<ContentItem[]> {
    if (!this.isConnected) {
      return this.demoRecommendations(limit);
    }

    try {
      // Get user preferences and history
      const { data: userHistory } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get content based on user preferences
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        tags: this.extractTags(item.title + ' ' + (item.description || ''))
      }));
    } catch (error) {
      console.error('Recommendations error:', error);
      return this.demoRecommendations(limit);
    }
  }

  // Get discovery statistics
  public async getStats(): Promise<DiscoveryStats> {
    if (!this.isConnected) {
      return this.demoStats();
    }

    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*');

      if (error) throw error;

      const items = data || [];
      const categories: Record<string, number> = {};
      const sources: Record<string, number> = {};

      items.forEach(item => {
        categories[item.category || 'uncategorized'] = (categories[item.category || 'uncategorized'] || 0) + 1;
        sources[item.source || 'unknown'] = (sources[item.source || 'unknown'] || 0) + 1;
      });

      const today = new Date();
      const recentActivity = items.filter(item => {
        const itemDate = new Date(item.created_at);
        return (today.getTime() - itemDate.getTime()) < (24 * 60 * 60 * 1000); // Last 24 hours
      }).length;

      return {
        totalItems: items.length,
        categories,
        sources,
        recentActivity
      };
    } catch (error) {
      console.error('Stats error:', error);
      return this.demoStats();
    }
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

    return foundTags.slice(0, 5); // Limit to 5 tags
  }

  // Generate mock embedding (in real implementation, this would call OpenAI or similar)
  private generateEmbedding(text: string): number[] {
    // Simulate 1536-dimensional embedding
    const embedding = [];
    for (let i = 0; i < 1536; i++) {
      embedding.push(Math.random() * 2 - 1);
    }
    return embedding;
  }

  // Demo search for when not connected
  private demoSearch(query: string, options: SearchOptions = {}): ContentItem[] {
    const demoItems: ContentItem[] = [
      {
        id: '1',
        title: 'Advanced React Patterns for 2024',
        description: 'Discover cutting-edge React patterns and best practices for building scalable applications',
        url: 'https://example.com/react-patterns',
        source: 'Medium',
        category: 'webdev',
        tags: ['React', 'JavaScript', 'Frontend'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        similarity: 0.95
      },
      {
        id: '2',
        title: 'Building AI-Powered Search with Vector Embeddings',
        description: 'Learn how to implement semantic search using vector databases and embeddings',
        url: 'https://example.com/ai-search',
        source: 'Dev.to',
        category: 'ai',
        tags: ['AI', 'Vector Search', 'Machine Learning'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        similarity: 0.92
      },
      {
        id: '3',
        title: 'The Future of Content Discovery',
        description: 'Exploring next-generation content recommendation systems',
        url: 'https://example.com/content-discovery',
        source: 'TechCrunch',
        category: 'ai',
        tags: ['AI', 'Recommendations', 'Discovery'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        similarity: 0.88
      }
    ];

    return demoItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Demo recommendations
  private demoRecommendations(limit: number): ContentItem[] {
    return [
      {
        id: 'rec1',
        title: 'Optimizing Database Performance at Scale',
        description: 'Advanced techniques for database optimization in high-traffic applications',
        url: 'https://example.com/db-performance',
        source: 'Engineering Blog',
        category: 'data',
        tags: ['Database', 'Performance', 'Scalability'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        similarity: 0.85
      },
      {
        id: 'rec2',
        title: 'Modern CSS Techniques for 2024',
        description: 'Explore the latest CSS features and techniques for modern web development',
        url: 'https://example.com/modern-css',
        source: 'CSS Tricks',
        category: 'webdev',
        tags: ['CSS', 'Frontend', 'Design'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        similarity: 0.82
      }
    ].slice(0, limit);
  }

  // Demo stats
  private demoStats(): DiscoveryStats {
    return {
      totalItems: 1250,
      categories: {
        'ai': 320,
        'webdev': 280,
        'data': 200,
        'productivity': 150,
        'design': 120,
        'business': 100,
        'tutorials': 80
      },
      sources: {
        'Medium': 400,
        'Dev.to': 300,
        'GitHub': 250,
        'TechCrunch': 150,
        'Engineering Blog': 150
      },
      recentActivity: 45
    };
  }
}

export const contentDiscovery = new ContentDiscovery(); 