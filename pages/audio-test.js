import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AudioPlayer from '../components/AudioPlayer';
import { testAudioUrl } from '../lib/audio';

export default function AudioTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [directUrl, setDirectUrl] = useState('');

  useEffect(() => {
    // Generate direct URL for testing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
    setDirectUrl(`${supabaseUrl}/storage/v1/object/public/audio/overview.mp3`);
  }, []);

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
    'Direct Storage URL Test': async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
      const url = `${supabaseUrl}/storage/v1/object/public/audio/overview.mp3`;
      const response = await testAudioUrl(url);
      return `Direct URL test: ${response.accessible ? 'Success' : 'Failed'} - Status: ${response.status || 'N/A'}`;
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
    
    'Browser Audio API': async () => {
      const result = typeof Audio !== 'undefined' && 'canPlayType' in HTMLAudioElement.prototype;
      return `Audio API available: ${result ? 'Yes' : 'No'}`;
    }
  };

  return (
    <Layout title="Audio Test - NotebookLM Directory">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          color: '#ffffff',
          margin: '0 0 2rem 0'
        }}>
          🎵 Audio System Test
        </h1>

        {/* Test Audio Player */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Live Audio Player Test
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <AudioPlayer 
              audioUrl="overview.mp3"
              title="Test Audio Playback"
              showWaveform={true}
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '1rem'
            }}>
              Direct URL Test
            </h3>
            <AudioPlayer 
              audioUrl={directUrl}
              title="Direct URL Test"
              showWaveform={true}
            />
            <p style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.9rem', 
              color: '#e2e8f0'
            }}>
              Testing direct storage URL: {directUrl}
            </p>
          </div>
        </section>

        {/* System Tests */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            System Tests
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => {
                Object.entries(audioTests).forEach(([testName, testFunction]) => {
                  runTest(testName, testFunction);
                });
              }}
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
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 255, 136, 0.2)'
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
                        background: 'rgba(0, 255, 136, 0.2)',
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
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Configuration Check
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#e2e8f0' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
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
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Troubleshooting Guide
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 255, 136, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>
              Common Issues & Solutions
            </h3>
            
            <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
              <p><strong>Audio not loading:</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Check that overview.mp3 is uploaded to the 'audio' bucket in Supabase Storage</li>
                <li>Verify the audio file is in MP3 format and under 10MB</li>
                <li>Try accessing the direct URL in a new browser tab</li>
              </ul>
              
              <p><strong>Audio format not supported:</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Try converting the audio to a different format (MP3, WAV, OGG)</li>
                <li>Check browser console for specific error messages</li>
                <li>Ensure the audio file isn't corrupted</li>
              </ul>
              
              <p><strong>CORS errors:</strong></p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Add your domain to Supabase CORS settings</li>
                <li>Verify the storage bucket is set to public</li>
                <li>Check browser console for specific CORS errors</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}