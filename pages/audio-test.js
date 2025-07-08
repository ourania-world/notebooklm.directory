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
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#ffffff' }}>
          🎵 Audio System Test
        </h1>

        {/* Test Audio Player */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>
            Live Audio Player Test
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <AudioPlayer 
              audioUrl="overview.mp3"
              title="Test Audio Playback"
            />
            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: '#e2e8f0',
              textAlign: 'center'
            }}>
              This should load and play your overview.mp3 file
            </p>
          </div>
        </section>

        {/* System Tests */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>
            System Tests
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={runAllTests}
              disabled={loading}
              style={{
                background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                color: loading ? '#ffffff' : '#0a0a0a',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                marginRight: '1rem'
              }}
            >
              {loading ? 'Running Tests...' : 'Run All Audio Tests'}
            </button>
            
            <button
              onClick={() => setTestResults({})}
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
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
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>
                      {testName}
                    </h3>
                    <button
                      onClick={() => runTest(testName, testFunction)}
                      disabled={loading}
                      style={{
                        background: 'rgba(0, 255, 136, 0.1)',
                        color: '#00ff88',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
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
                      borderRadius: '8px',
                      background: result.status === 'success' ? 'rgba(0, 255, 136, 0.1)' : 
                                 result.status === 'error' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                      border: `1px solid ${result.status === 'success' ? 'rgba(0, 255, 136, 0.3)' : 
                                          result.status === 'error' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`
                    }}>
                      <div style={{ 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        color: result.status === 'success' ? '#00ff88' : 
                               result.status === 'error' ? '#ff6b6b' : '#ffc107'
                      }}>
                        Status: {result.status}
                      </div>
                      
                      {result.result && (
                        <div style={{ 
                          color: '#e2e8f0',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace'
                        }}>
                          {result.result}
                        </div>
                      )}
                      
                      {result.error && (
                        <div style={{ 
                          color: '#ff6b6b',
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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>
            Configuration Check
          </h2>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#e2e8f0' }}>
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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>
            Troubleshooting Guide
          </h2>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>
              Common Issues & Solutions
            </h3>
            
            <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
              <p><strong>Audio not loading:</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Check that overview.mp3 is uploaded to the 'audio' bucket in Supabase Storage</li>
                <li>Verify the serve-audio Edge Function is deployed</li>
                <li>Ensure your audio file is in MP3 format and under 10MB</li>
              </ul>
              
              <p><strong>CORS errors:</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Add your domain to Supabase CORS settings</li>
                <li>Check that the Edge Function includes proper CORS headers</li>
                <li>Verify the storage bucket is set to public</li>
              </ul>
              
              <p><strong>Playback fails:</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
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