import { useState } from 'react';
import Layout from '../components/Layout';

export default function TestAPIs() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint, method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      return {
        success: response.ok,
        status: response.status,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    const results = {};

    // Test 1: Add test data
    console.log('Testing: Adding test data...');
    results.testData = await testAPI('/api/test-data', 'POST');

    // Test 2: Enhanced search
    console.log('Testing: Enhanced search...');
    results.enhancedSearch = await testAPI('/api/enhanced-search', 'POST', {
      query: 'AI',
      limit: 5
    });

    // Test 3: Basic search
    console.log('Testing: Basic search...');
    results.basicSearch = await testAPI('/api/enhanced-search', 'GET', null);

    setTestResults(results);
    setLoading(false);
  };

  return (
    <Layout title="API Test Dashboard">
      <div style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        padding: '2rem',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#00ff88',
              marginBottom: '1rem'
            }}>
              API Test Dashboard
            </h1>
            <p style={{ color: '#e2e8f0' }}>
              Testing all API endpoints for the enhanced scraping dashboard
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={runAllTests}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                background: loading ? 'rgba(0, 255, 136, 0.3)' : '#00ff88',
                color: loading ? '#e2e8f0' : '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Running Tests...' : 'Run All API Tests'}
            </button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#ffffff',
                marginBottom: '1.5rem'
              }}>
                Test Results
              </h2>
              
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  border: `1px solid ${result.success ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.2rem',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      {testName}
                    </h3>
                    <div style={{
                      background: result.success ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                      color: result.success ? '#00ff88' : '#ff6b6b',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {result.success ? '✅ PASS' : '❌ FAIL'}
                    </div>
                  </div>
                  
                  {result.status && (
                    <p style={{
                      color: '#e2e8f0',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      Status: {result.status}
                    </p>
                  )}
                  
                  {result.error && (
                    <p style={{
                      color: '#ff6b6b',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      Error: {result.error}
                    </p>
                  )}
                  
                  <pre style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}