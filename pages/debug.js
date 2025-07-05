import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Debug() {
  const [envVars, setEnvVars] = useState({});
  const [supabaseStatus, setSupabaseStatus] = useState('checking');

  useEffect(() => {
    // Check environment variables
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'
    };
    setEnvVars(vars);

    // Test Supabase connection
    async function testSupabase() {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.from('notebooks').select('count').limit(1);
        
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
        } else {
          setSupabaseStatus('Connected successfully');
        }
      } catch (err) {
        setSupabaseStatus(`Connection failed: ${err.message}`);
      }
    }

    testSupabase();
  }, []);

  return (
    <Layout title="Debug - NotebookLM Directory">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#212529' }}>
          🔧 Debug Information
        </h1>

        {/* Environment Variables */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Environment Variables
          </h2>
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                <span style={{ fontWeight: '600' }}>{key}:</span>
                <span style={{ 
                  color: value && value !== 'Not set' ? '#28a745' : '#dc3545' 
                }}>
                  {value || 'Not set'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Supabase Connection */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Supabase Connection
          </h2>
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontWeight: '600' }}>Status:</span>
              <span style={{ 
                color: supabaseStatus === 'Connected successfully' ? '#28a745' : 
                       supabaseStatus === 'checking' ? '#ffc107' : '#dc3545',
                fontFamily: 'monospace'
              }}>
                {supabaseStatus}
              </span>
            </div>
          </div>
        </section>

        {/* Browser Information */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Browser Information
          </h2>
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>User Agent:</span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}
              </div>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Current URL:</span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {typeof window !== 'undefined' ? window.location.href : 'Server-side'}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Quick Tests
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/test'}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Test API Route
            </button>
            <button
              onClick={() => window.location.href = '/edge-test'}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Test Edge Function
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: '#6f42c1',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Test Main App
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}