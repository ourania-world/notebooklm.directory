import axios from 'axios';

export interface RedditPost {
  title: string;
  content: string;
  url: string;
  score: number;
  created: Date;
  source_type: string;
  author: string;
  subreddit: string;
}

export class RedditScraper {
  private userAgent = 'NotebookLM-Directory/1.0 (Discovery Bot)';

  async scrapeSubreddit(subreddit: string, keywords: string[] = []): Promise<RedditPost[]> {
    const url = `https://www.reddit.com/r/${subreddit}/search.json`;
    const params = {
      q: keywords.join(' OR '),
      restrict_sr: 'on',
      sort: 'relevance',
      limit: 100,
      t: 'month' // Time filter: month
    };

    try {
      const response = await axios.get(url, { 
        params,
        headers: { 
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      return response.data.data.children.map((post: any) => ({
        title: post.data.title,
        content: post.data.selftext || '',
        url: `https://reddit.com${post.data.permalink}`,
        score: post.data.score,
        created: new Date(post.data.created_utc * 1000),
        source_type: 'reddit',
        author: post.data.author,
        subreddit: post.data.subreddit
      }));
    } catch (error) {
      console.error(`❌ Error scraping r/${subreddit}:`, error);
      return [];
    }
  }

  async searchNotebookLMContent(): Promise<RedditPost[]> {
    const subreddits = [
      'MachineLearning',
      'artificial',
      'research',
      'AcademicPsychology',
      'datascience',
      'GoogleAI',
      'OpenAI',
      'AI'
    ];

    const keywords = [
      'notebooklm',
      'notebook-lm',
      'google notebooklm',
      'ai research assistant',
      'document analysis ai',
      'research assistant'
    ];

    const allPosts: RedditPost[] = [];

    for (const subreddit of subreddits) {
      try {
        console.log(`🔍 Scraping r/${subreddit} for NotebookLM content...`);
        const posts = await this.scrapeSubreddit(subreddit, keywords);
        
        // Filter for actual NotebookLM content
        const notebookLMPosts = posts.filter(post => 
          this.containsNotebookLMContent(post.title + ' ' + post.content)
        );

        allPosts.push(...notebookLMPosts);
        console.log(`✅ Found ${notebookLMPosts.length} NotebookLM posts in r/${subreddit}`);
        
        // Rate limiting
        await this.delay(1000);
      } catch (error) {
        console.error(`❌ Failed to scrape r/${subreddit}:`, error);
      }
    }

    return allPosts;
  }

  private containsNotebookLMContent(text: string): boolean {
    const indicators = [
      'notebooklm',
      'notebook-lm',
      'google.com/notebook',
      'research assistant',
      'document analysis'
    ];
    
    const lowerText = text.toLowerCase();
    return indicators.some(indicator => lowerText.includes(indicator));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async extractNotebookLMUrls(posts: RedditPost[]): Promise<string[]> {
    const urls: string[] = [];
    const notebookLMRegex = /https:\/\/notebooklm\.google\.com\/notebook\/[a-zA-Z0-9_-]+/g;

    for (const post of posts) {
      const matches = post.content.match(notebookLMRegex);
      if (matches) {
        urls.push(...matches);
      }
    }

    return [...new Set(urls)]; // Remove duplicates
  }
}

// Export singleton instance
export const redditScraper = new RedditScraper(); 