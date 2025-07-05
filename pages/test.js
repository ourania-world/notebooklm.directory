import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Test() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setTestResults(prev => ({ ...prev, [testName]: { status: 'running', result: null, error: null } }));
    
    try {
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'success', result, error: null } 
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { status: 'error', result: null, error: error.message } 
      }));
    }
    setLoading(false);
  };

  const tests = {
    'Supabase Client': async () => {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.from('notebooks').select('count');
      if (error) throw error;
      return 'Supabase client working';
    },
    
    'Get Notebooks': async () => {
      const { getNotebooks } = await import('../lib/notebooks');
      const notebooks = await getNotebooks();
      return `Found ${notebooks.length} notebooks`;
    },
    
    'Get Featured Notebooks': async () => {
      const { getNotebooks } = await import('../lib/notebooks');
      const notebooks = await getNotebooks({ featured: true });
      return `Found ${notebooks.length} featured notebooks`;
    },
    
    'Get Category Counts': async () => {
      const { getCategoryCounts } = await import('../lib/notebooks');
      const counts = await getCategoryCounts();
      return `Categories: ${JSON.stringify(counts)}`;
    },
    
    'Search Notebooks': async () => {
      const { getNotebooks } = await import('../lib/notebooks');
      const notebooks = await getNotebooks({ search: 'research' });
      return `Found ${notebooks.length} notebooks matching "research"`;
    },
    
    'Filter by Category': async () => {
      const { getNotebooks } = await import('../lib/notebooks');
      const notebooks = await getNotebooks({ category: 'Academic' });
      return `Found ${notebooks.length} Academic notebooks`;
    }
  };

  const runAllTests = async () => {
    for (const [testName, testFunction] of Object.entries(tests)) {
      await runTest(testName, testFunction);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Layout title="API Test - NotebookLM Directory">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#212529' }}>
          🧪 API Route Tests
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={runAllTests}
            disabled={loading}
            style={{
              background: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              marginRight: '1rem'
            }}
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(tests).map(([testName, testFunction]) => {
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
                    onClick={() => runTest(testName, testFunction)}
                    disabled={loading}
                    style={{
                      background: '#28a745',
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
                
                {result && (
                  <div style={{
                    padding: '1rem',
                    borderRadius: '4px',
                    background: result.status === 'success' ? '#d4edda' : 
                               result.status === 'error' ? '#f8d7da' : '#fff3cd',
                    border: `1px solid ${result.status === 'success' ? '#c3e6cb' : 
                                        result.status === 'error' ? '#f5c6cb' : '#ffeaa7'}`,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      Status: {result.status}
                    </div>
                    {result.result && (
                      <div style={{ color: '#155724' }}>
                        Result: {result.result}
                      </div>
                    )}
                    {result.error && (
                      <div style={{ color: '#721c24' }}>
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
            Test Information
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6c757d' }}>
            These tests verify that your Supabase integration is working correctly.
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
            If any tests fail, check your environment variables and database migration.
          </p>
        </div>
      </div>
    </Layout>
  );
}