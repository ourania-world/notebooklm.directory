import { useState } from 'react';
import Layout from '../components/Layout';

export default function EdgeTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runEdgeTest = async (testName, url, options = {}) => {
    setLoading(true);
    setTestResults(prev => ({ 
      ...prev, 
      [testName]: { status: 'running', result: null, error: null, url } 
    }));
    
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`);
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'success', 
          result: data, 
          error: null, 
          url,
          statusCode: response.status 
        } 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'error', 
          result: null, 
          error: error.message, 
          url 
        } 
      }));
    }
    setLoading(false);
  };

  const edgeTests = {
    'Get All Notebooks': {
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory`,
      options: {}
    },
    
    'Get Featured Notebooks': {
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory?featured=true`,
      options: {}
    },
    
    'Get Academic Notebooks': {
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory?category=Academic`,
      options: {}
    },
    
    'Search Notebooks': {
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory?search=research`,
      options: {}
    },
    
    'Test CORS Preflight': {
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory`,
      options: { method: 'OPTIONS' }
    }
  };

  const runAllEdgeTests = async () => {
    for (const [testName, { url, options }] of Object.entries(edgeTests)) {
      await runEdgeTest(testName, url, options);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Layout title="Edge Function Test - NotebookLM Directory">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#212529' }}>
          ⚡ Edge Function Tests
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={runAllEdgeTests}
            disabled={loading}
            style={{
              background: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              marginRight: '1rem'
            }}
          >
            {loading ? 'Running Tests...' : 'Run All Edge Tests'}
          </button>
          
          <button
            onClick={() => setTestResults({})}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Clear Results
          </button>
        </div>

        {/* Environment Check */}
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
            Edge Function Configuration
          </h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </div>
            <div>
              <strong>Function URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(edgeTests).map(([testName, { url, options }]) => {
            const result = testResults[testName];
            
            return (
              <div
                key={testName}
                style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#495057' }}>
                    {testName}
                  </h3>
                  <button
                    onClick={() => runEdgeTest(testName, url, options)}
                    disabled={loading}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Run Test
                  </button>
                </div>
                
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.8rem', 
                  color: '#6c757d',
                  marginBottom: '1rem'
                }}>
                  {options.method || 'GET'} {url}
                </div>
                
                {result && (
                  <div style={{
                    padding: '1rem',
                    borderRadius: '4px',
                    background: result.status === 'success' ? '#d4edda' : 
                               result.status === 'error' ? '#f8d7da' : '#fff3cd',
                    border: `1px solid ${result.status === 'success' ? '#c3e6cb' : 
                                        result.status === 'error' ? '#f5c6cb' : '#ffeaa7'}`
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      Status: {result.status}
                      {result.statusCode && ` (HTTP ${result.statusCode})`}
                    </div>
                    
                    {result.result && (
                      <div style={{ 
                        color: '#155724',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        background: '#f8f9fa',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        marginTop: '0.5rem',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result.error && (
                      <div style={{ 
                        color: '#721c24',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                      }}>
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          background: '#e9ecef', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
            About Edge Function Tests
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6c757d' }}>
            These tests directly call your Supabase Edge Function to verify it's working correctly.
          </p>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6c757d' }}>
            If tests fail, check that your Edge Function is deployed and your database migration is applied.
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
            The Edge Function should be available at: <code>{process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notebook-directory</code>
          </p>
        </div>
      </div>
    </Layout>
  );
}