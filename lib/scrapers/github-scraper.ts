import { graphql } from '@octokit/graphql';

export interface GitHubRepository {
  title: string;
  content: string;
  description: string;
  url: string;
  stars: number;
  source_type: string;
  owner: string;
  name: string;
  language: string;
  lastUpdated: Date;
}

export class GitHubScraper {
  private graphqlClient: any;

  constructor() {
    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
  }

  async searchNotebookLMRepositories(): Promise<GitHubRepository[]> {
    const queries = [
      'notebooklm',
      'notebook-lm',
      'google notebooklm',
      'ai research assistant',
      'document analysis ai',
      'research assistant'
    ];

    const allRepos: GitHubRepository[] = [];

    for (const query of queries) {
      try {
        console.log(`🔍 Searching GitHub for: ${query}`);
        const repos = await this.searchRepositories(query);
        allRepos.push(...repos);
        
        // Rate limiting
        await this.delay(1000);
      } catch (error) {
        console.error(`❌ Error searching for "${query}":`, error);
      }
    }

    return allRepos;
  }

  async searchRepositories(query: string): Promise<GitHubRepository[]> {
    const result = await this.graphqlClient(`
      query ($query: String!) {
        search(query: $query, type: REPOSITORY, first: 50) {
          repositoryCount
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
              }
              updatedAt
              owner {
                login
              }
              readme: object(expression: "HEAD:README.md") {
                ... on Blob {
                  text
                }
              }
              readme2: object(expression: "HEAD:README.md") {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      }
    `, {
      query: `${query} language:javascript language:python language:typescript`,
    });

    return result.search.nodes
      .filter((repo: any) => this.isNotebookLMRepository(repo))
      .map((repo: any) => this.extractRepositoryData(repo));
  }

  async scrapeRepository(owner: string, name: string): Promise<GitHubRepository | null> {
    try {
      const result = await this.graphqlClient(`
        query ($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            name
            description
            readme: object(expression: "HEAD:README.md") {
              ... on Blob {
                text
              }
            }
            stargazerCount
            url
            primaryLanguage {
              name
            }
            updatedAt
            owner {
              login
            }
          }
        }
      `, {
        owner,
        name,
      });

      if (!result.repository) {
        return null;
      }

      return this.extractRepositoryData(result.repository);
    } catch (error) {
      console.error(`❌ Error scraping repository ${owner}/${name}:`, error);
      return null;
    }
  }

  private isNotebookLMRepository(repo: any): boolean {
    const indicators = [
      'notebooklm',
      'notebook-lm',
      'google.com/notebook',
      'ai research',
      'document analysis',
      'research assistant'
    ];
    
    const content = `${repo.name} ${repo.description || ''} ${repo.readme?.text || ''}`.toLowerCase();
    return indicators.some(indicator => content.includes(indicator));
  }

  private extractRepositoryData(repo: any): GitHubRepository {
    return {
      title: repo.name,
      content: repo.readme?.text || repo.description || '',
      description: repo.description || '',
      url: repo.url,
      stars: repo.stargazerCount,
      source_type: 'github',
      owner: repo.owner.login,
      name: repo.name,
      language: repo.primaryLanguage?.name || 'Unknown',
      lastUpdated: new Date(repo.updatedAt)
    };
  }

  async extractNotebookLMUrls(repos: GitHubRepository[]): Promise<string[]> {
    const urls: string[] = [];
    const notebookLMRegex = /https:\/\/notebooklm\.google\.com\/notebook\/[a-zA-Z0-9_-]+/g;

    for (const repo of repos) {
      const matches = repo.content.match(notebookLMRegex);
      if (matches) {
        urls.push(...matches);
      }
    }

    return [...new Set(urls)]; // Remove duplicates
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const githubScraper = new GitHubScraper(); 