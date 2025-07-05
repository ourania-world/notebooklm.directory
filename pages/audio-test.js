import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AudioPlayer from '../components/AudioPlayer';

export default function AudioTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setTestResults(prev => ({ 
      ...prev, 
      [testName]: { status: 'running', result: null, error: null } 
    }));
    
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

  const audioTests = {
    'Edge Function Availability': async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/serve-audio?path=test.mp3`);
      return `Edge Function responds with status: ${response.status}`;
    },
    
    'Storage Bucket Access': async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/storage/v1/object/public/audio/overview.mp3`);
      return `Storage access status: ${response.status}`;
    },
    
    'Audio Format Support': async () => {
      const audio = new Audio();
      const formats = {
        mp3: audio.canPlayType('audio/mpeg'),
        wav: audio.canPlayType('audio/wav'),
        ogg: audio.canPlayType('audio/ogg'),
        m4a: audio.canPlayType('audio/mp4')
      };
      return `Supported formats: ${JSON.stringify(formats)}`;
    },
    
    'CORS Headers': async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/serve-audio?path=overview.mp3`, {
        method: 'OPTIONS'
      });
      const corsHeader = response.headers.get('Access-Control-Allow-Origin');
      return `CORS header: ${corsHeader || 'Not set'}`;
    }
  };

  const runAllTests = async () => {
    for (const [testName, testFunction] of Object.entries(audioTests)) {
      await runTest(testName, testFunction);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Layout title="Audio Test - NotebookLM Directory">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#212529' }}>
          🎵 Audio System Test
        </h1>

        {/* Test Audio Player */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Live Audio Player Test
          </h2>
          <div style={{
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #dee2e6'
          }}>
            <AudioPlayer 
              audioUrl="overview.mp3"
              title="Test Audio Playback"
            />
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: '#6c757d',
              textAlign: 'center'
            }}>
              This should load and play your overview.mp3 file
            </p>
          </div>
        </section>

        {/* System Tests */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            System Tests
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={runAllTests}
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
              {loading ? 'Running Tests...' : 'Run All Audio Tests'}
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
            {Object.entries(audioTests).map(([testName, testFunction]) => {
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
                      </div>
                      
                      {result.result && (
                        <div style={{ 
                          color: '#155724',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace'
                        }}>
                          {result.result}
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
        </section>

        {/* Configuration Check */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Configuration Check
          </h2>
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Edge Function URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/serve-audio
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Storage URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio/
              </div>
              <div>
                <strong>Audio Support:</strong> {typeof Audio !== 'undefined' ? 'Available' : 'Not available'}
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting Guide */}
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#495057' }}>
            Troubleshooting Guide
          </h2>
          <div style={{
            background: '#e9ecef',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
              Common Issues & Solutions
            </h3>
            
            <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              <p><strong>Audio not loading:</strong></p>
              <ul>
                <li>Check that overview.mp3 is uploaded to the 'audio' bucket in Supabase Storage</li>
                <li>Verify the serve-audio Edge Function is deployed</li>
                <li>Ensure your audio file is in MP3 format and under 10MB</li>
              </ul>
              
              <p><strong>CORS errors:</strong></p>
              <ul>
                <li>Add your domain to Supabase CORS settings</li>
                <li>Check that the Edge Function includes proper CORS headers</li>
                <li>Verify the storage bucket is set to public</li>
              </ul>
              
              <p><strong>Playback fails:</strong></p>
              <ul>
                <li>Test the audio file in a different player to ensure it's not corrupted</li>
                <li>Check browser console for specific error messages</li>
                <li>Try a different audio format (WAV, OGG)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}