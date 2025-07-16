import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export interface ServiceStatus {
  supabase: 'connected' | 'error' | 'demo';
  openai: 'connected' | 'error' | 'demo';
  vectorSearch: 'available' | 'unavailable' | 'demo';
}

export class ContentDiscoveryService {
  private supabase: any = null;
  private openai: any = null;
  private status: ServiceStatus = {
    supabase: 'demo',
    openai: 'demo',
    vectorSearch: 'demo'
  };

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    try {
      // Initialize Supabase
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        this.status.supabase = 'connected';
        console.log('✅ Supabase connected');
      } else {
        console.warn('⚠️ Supabase credentials missing, using demo mode');
        this.status.supabase = 'demo';
      }
    } catch (error) {
      console.error('❌ Supabase initialization failed:', error);
      this.status.supabase = 'error';
    }

    try {
      // Initialize OpenAI
      if (process.env.OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.status.openai = 'connected';
        console.log('✅ OpenAI connected');
      } else {
        console.warn('⚠️ OpenAI API key missing, using demo mode');
        this.status.openai = 'demo';
      }
    } catch (error) {
      console.error('❌ OpenAI initialization failed:', error);
      this.status.openai = 'error';
    }

    // Update vector search status
    this.status.vectorSearch = 
      this.status.supabase === 'connected' && this.status.openai === 'connected' 
        ? 'available' 
        : 'demo';
  }

  getStatus(): ServiceStatus {
    return { ...this.status };
  }

  private getMockEmbedding(): number[] {
    // Generate a mock embedding vector (1536 dimensions for text-embedding-3-small)
    return Array.from({ length: 1536 }, () => Math.random() - 0.5);
  }

  private getMockSearchResults(query: string, limit: number): any[] {
    const mockNotebooks = [
      {
        id: 'mock-1',
        title: 'Machine Learning Research Analysis',
        description: 'Comprehensive analysis of recent ML breakthroughs',
        similarity: 0.95,
        quality_score: 0.9
      },
      {
        id: 'mock-2',
        title: 'Data Science Notebook Collection',
        description: 'Curated notebooks for data science projects',
        similarity: 0.87,
        quality_score: 0.85
      },
      {
        id: 'mock-3',
        title: 'AI Research Papers Summary',
        description: 'Summarized research papers on artificial intelligence',
        similarity: 0.82,
        quality_score: 0.88
      },
      {
        id: 'mock-4',
        title: 'Business Intelligence Dashboard',
        description: 'Interactive dashboards for business analytics',
        similarity: 0.78,
        quality_score: 0.83
      },
      {
        id: 'mock-5',
        title: 'Creative Writing Workshop',
        description: 'Workshop materials for creative writing projects',
        similarity: 0.75,
        quality_score: 0.79
      }
    ];

    return mockNotebooks.slice(0, limit).map(notebook => ({
      ...notebook,
      similarity: notebook.similarity * (0.8 + Math.random() * 0.2) // Add some randomness
    }));
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (this.openai && this.status.openai === 'connected') {
        const response = await this.openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: text.replace(/\n/g, ' '),
        });
        return response.data[0].embedding;
      } else {
        console.log('🎭 Using mock embedding (demo mode)');
        return this.getMockEmbedding();
      }
    } catch (error) {
      console.error('❌ Embedding generation failed, using mock:', error);
      return this.getMockEmbedding();
    }
  }

  async indexNotebook(notebook: any): Promise<void> {
    try {
      if (this.supabase && this.status.supabase === 'connected') {
        const content = `${notebook.title} ${notebook.description}`.trim();
        const embedding = await this.generateEmbedding(content);
        
        await this.supabase
          .from('notebooks')
          .update({ 
            embedding: embedding,
            updated_at: new Date().toISOString()
          })
          .eq('id', notebook.id);
        
        console.log(`✅ Indexed: ${notebook.title}`);
      } else {
        console.log(`🎭 Mock indexing: ${notebook.title} (demo mode)`);
        // Simulate indexing delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`❌ Failed to index ${notebook.title}:`, error);
      throw error;
    }
  }

  async semanticSearch(query: string, limit = 20): Promise<any[]> {
    try {
      if (this.supabase && this.status.vectorSearch === 'available') {
        const queryEmbedding = await this.generateEmbedding(query);
        
        const { data, error } = await this.supabase.rpc('hybrid_search', {
          search_query: query,
          query_embedding: queryEmbedding,
          match_threshold: 0.75,
          match_count: limit
        });

        if (error) throw error;
        return data || [];
      } else {
        console.log('🎭 Using mock semantic search results (demo mode)');
        return this.getMockSearchResults(query, limit);
      }
    } catch (error) {
      console.error('❌ Semantic search failed, using mock results:', error);
      return this.getMockSearchResults(query, limit);
    }
  }

  async batchIndexNotebooks(notebooks: any[]): Promise<void> {
    console.log(`🔄 Indexing ${notebooks.length} notebooks with embeddings...`);
    
    for (const notebook of notebooks) {
      try {
        await this.indexNotebook(notebook);
      } catch (error) {
        console.error(`❌ Failed to index ${notebook.title}:`, error);
      }
    }
  }

  async getSimilarNotebooks(notebookId: string, limit = 10): Promise<any[]> {
    try {
      if (this.supabase && this.status.vectorSearch === 'available') {
        const { data: notebook } = await this.supabase
          .from('notebooks')
          .select('embedding, title, description')
          .eq('id', notebookId)
          .single();

        if (!notebook?.embedding) {
          return [];
        }

        const { data, error } = await this.supabase.rpc('hybrid_search', {
          search_query: notebook.title,
          query_embedding: notebook.embedding,
          match_threshold: 0.7,
          match_count: limit + 1
        });

        if (error) throw error;
        
        return data.filter((item: any) => item.id !== notebookId);
      } else {
        console.log('🎭 Using mock similar notebooks (demo mode)');
        return this.getMockSearchResults('similar notebooks', limit);
      }
    } catch (error) {
      console.error('❌ Get similar notebooks failed, using mock:', error);
      return this.getMockSearchResults('similar notebooks', limit);
    }
  }

  // Demo mode utilities
  isDemoMode(): boolean {
    return this.status.vectorSearch === 'demo';
  }

  getConnectionStatus(): string {
    if (this.status.vectorSearch === 'available') {
      return '🟢 All services connected';
    } else if (this.status.supabase === 'connected' && this.status.openai === 'demo') {
      return '🟡 Supabase connected, OpenAI in demo mode';
    } else if (this.status.openai === 'connected' && this.status.supabase === 'demo') {
      return '🟡 OpenAI connected, Supabase in demo mode';
    } else {
      return '🔴 Demo mode - check environment variables';
    }
  }
}

// Export singleton instance
export const contentDiscovery = new ContentDiscoveryService(); 