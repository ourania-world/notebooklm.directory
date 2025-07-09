import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function CrawlerDashboard() {
  const [crawlerActive, setCrawlerActive] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    github: true,
    reddit: true,
    twitter: true,
    academic: true,
    youtube: true,
    discord: true,
  });

  useEffect(() => {
    // Simulate checking crawler status
    const interval = setInterval(() => {
      // You can replace this with a real API call
      console.log('Checking crawler heartbeat...');
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleCrawler = () => {
    setCrawlerActive(!crawlerActive);
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Crawler System Dashboard</h1>
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Status</h2>
              <p>
                Crawler is currently{' '}
                <span className={crawlerActive ? 'text-green-600' : 'text-red-600'}>
                  {crawlerActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </p>
            </div>
            <Button onClick={toggleCrawler}>
              {crawlerActive ? 'Pause Crawler' : 'Resume Crawler'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <ul>
            {Object.entries(systemStatus).map(([system, isActive]) => (
              <li key={system} className="mb-2">
                <span className="capitalize">{system}:</span>{' '}
                <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                  {isActive ? 'Online' : 'Offline'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
