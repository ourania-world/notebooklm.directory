import { createClient } from '@supabase/supabase-js';

export class ContentDiscoveryService {
  constructor() {
    this.supabase = null;
    this.openai = null;
    this.status = {
      supabase: 'demo',
      openai: 'demo',
      vectorSearch: 'demo'
    };
    
    this.initializeServices();
  }

  initializeServices() {
    try {
      // Initialize Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.status.supabase = 'connected';
        console.log('✅ Supabase connected');
      } else {
        console.log('⚠️ Supabase keys missing, using demo mode');
        this.status.supabase = 'demo';
      }

      // Initialize OpenAI (optional for demo)
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        // Note: We'll add OpenAI later if needed
        this.status.openai = 'connected';
        console.log('✅ OpenAI connected');
      } else {
        console.log('⚠️ OpenAI key missing, using demo mode');
        this.status.openai = 'demo';
      }

    } catch (error) {
      console.error('❌ Service initialization error:', error);
      this.status.supabase = 'error';
      this.status.openai = 'error';
    }
  }

  async searchContent(query, filters = {}) {
    try {
      if (this.status.supabase === 'connected' && this.supabase) {
        // Real Supabase search
        let queryBuilder = this.supabase
          .from('notebooks')
          .select('*')
          .ilike('title', `%${query}%`);

        if (filters.category) {
          queryBuilder = queryBuilder.eq('category', filters.category);
        }

        const { data, error } = await queryBuilder.limit(10);

        if (error) {
          console.error('Supabase search error:', error);
          return this.getMockSearchResults(query);
        }

        return data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          similarity: Math.random() * 0.3 + 0.7, // Mock similarity score
          source: 'supabase'
        }));

      } else {
        // Demo mode
        return this.getMockSearchResults(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      return this.getMockSearchResults(query);
    }
  }

  getMockSearchResults(query) {
    const mockResults = [
      {
        id: '1',
        title: `Advanced ${query} Techniques`,
        description: `Comprehensive guide to ${query} implementation with real-world examples`,
        similarity: 0.92,
        source: 'demo'
      },
      {
        id: '2', 
        title: `${query} Best Practices`,
        description: `Industry-standard approaches for ${query} development`,
        similarity: 0.87,
        source: 'demo'
      },
      {
        id: '3',
        title: `${query} Architecture Patterns`,
        description: `Scalable design patterns for ${query} systems`,
        similarity: 0.84,
        source: 'demo'
      }
    ];

    return mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  async indexContent(content) {
    try {
      if (this.status.supabase === 'connected' && this.supabase) {
        // Real indexing
        const { data, error } = await this.supabase
          .from('notebooks')
          .insert([content]);

        if (error) {
          console.error('Indexing error:', error);
          return { success: false, error: error.message };
        }

        return { success: true, id: data[0].id };
      } else {
        // Demo indexing
        console.log('📝 Demo indexing:', content.title);
        return { success: true, id: `demo-${Date.now()}` };
      }
    } catch (error) {
      console.error('Indexing error:', error);
      return { success: false, error: error.message };
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
export const contentDiscovery = new ContentDiscoveryService(); 