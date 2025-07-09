import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CrawlerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('GITHUB');
  const [scrapingActive, setScrapingActive] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.from('scraper_stats').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/start-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, source: selectedSource })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Scraping started successfully!');
        loadStats();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Scraping failed:', err);
      alert('Failed to start scraping.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crawler Dashboard</h1>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter keyword or topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-1"
        />
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="border p-2"
        >
          <option value="GITHUB">GitHub</option>
          <option value="YOUTUBE">YouTube</option>
          <option value="REDDIT">Reddit</option>
        </select>
        <Button onClick={handleScrape} disabled={loading}>
          {loading ? 'Scraping...' : 'Start Scraping'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.query}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Source:</strong> {item.source}</p>
              <p><strong>Articles Found:</strong> {item.article_count}</p>
              <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CrawlerDashboard;
