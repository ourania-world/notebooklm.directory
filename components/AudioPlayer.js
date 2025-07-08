import { useState, useEffect, useRef } from 'react';
import { getAudioUrl, formatDuration, isAudioSupported } from '../lib/audio';

export default function AudioPlayer({ 
  audioUrl,
  title = 'Audio Overview',
  showWaveform = true,
  compact = false
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const audioRef = useRef(null);  
  const progressRef = useRef(null);  
  const waveformRef = useRef(null);  
  const animationRef = useRef(null);  
  
  // Try multiple sources in order of preference
  const tryAudioSources = async (primaryUrl) => {
    if (!primaryUrl) return null;
    
    // 1. Try Supabase Storage URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
    const storageUrl = `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(primaryUrl)}`;
    
    try {
      const response = await fetch(storageUrl, { method: 'HEAD' });
      if (response.ok) return storageUrl;
    } catch (e) {
      console.log('Storage URL not accessible, trying fallbacks');
    }
    
    // 2. Try local public folder
    const localUrl = `/${primaryUrl}`;
    try {
      const response = await fetch(localUrl, { method: 'HEAD' });
      if (response.ok) return localUrl;
    } catch (e) {
      console.log('Local URL not accessible, trying direct URL');
    }
    
    // 3. Use the URL directly if it's a full URL
    if (primaryUrl.startsWith('http')) return primaryUrl;
    
    // 4. Return the original URL as last resort
    return primaryUrl;
  };
  
  useEffect(() => {
    // Mark component as mounted to prevent hydration mismatch
    setMounted(true);
    
    // Don't run audio logic during SSR 
    if (typeof window === 'undefined') return;
    
    // Check if audio is supported
    if (!isAudioSupported()) {
      setError('Audio not supported in this browser');
      setLoading(false);
      return;
    }
    
    const initializeAudio = async () => {
      try {
        // Try to find a working audio source
        const workingUrl = await tryAudioSources(audioUrl);
        
        if (!workingUrl) {
          setError('Could not find a valid audio source');
          setLoading(false);
          return;
        }
        
        if (!audioRef.current) return;
        
        audioRef.current.src = workingUrl;
        
        // Set up event listeners after setting the source
        const handleCanPlayThrough = () => {
          setLoading(false);
          setDuration(audioRef.current.duration || 0);
        };
        
        const handleTimeUpdate = () => {
          setCurrentTime(audioRef.current.currentTime || 0);
        };
        
        const handleEnded = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (audioRef.current) audioRef.current.currentTime = 0;
        };
        
        const handleError = (e) => {
          console.error('Audio error:', e);
          
          // Provide more specific error messages
          let errorMessage = 'Failed to load audio';
          
          if (e.target?.error) {
            switch (e.target.error.code) {
              case 1: // MEDIA_ERR_ABORTED
                errorMessage = 'Audio loading aborted';
                break;
              case 2: // MEDIA_ERR_NETWORK
                errorMessage = 'Network error while loading audio';
                break;
              case 3: // MEDIA_ERR_DECODE
                errorMessage = 'Audio format not supported';
                break;
              case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                errorMessage = 'Audio file not found or not supported';
                break;
              default:
                errorMessage = `Error loading audio: ${e.target.error.message || 'Unknown error'}`;
            }
          }
          
          setError(errorMessage);
          setLoading(false);
        };
        
        audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('error', handleError);
        
        // Load the audio
        audioRef.current.load();
        
        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.removeEventListener('error', handleError);
          }
          
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      } catch (err) {
        console.error('Error initializing audio:', err);
        setError('Failed to initialize audio player');
        setLoading(false);
      }
    };
    
    initializeAudio();
  }, [audioUrl]);
  
  useEffect(() => {
    // Don't run during SSR 
    if (typeof window === 'undefined' || !mounted || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setError(`Playback error: ${err.message}`);
        setIsPlaying(false);
      });
      animateWaveform();
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } 
  }, [isPlaying, mounted]);
  
  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) return null;
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const animateWaveform = () => {
    if (waveformRef.current && showWaveform) {
      const bars = waveformRef.current.children; 
      const numBars = bars.length;
      
      for (let i = 0; i < numBars; i++) {
        const bar = bars[i];
        const height = Math.random() * 30 + 10;
        bar.style.height = `${height}px`;
      }
    }
    
    animationRef.current = requestAnimationFrame(animateWaveform);
  };
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)', 
      borderRadius: '16px',  
      padding: compact ? '1rem' : '1.5rem',
      border: '1px solid rgba(0, 255, 136, 0.2)',  
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      width: '100%'
    }}> 
      <audio ref={audioRef} preload="metadata" />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',  
        marginBottom: compact ? '0.75rem' : '1.5rem'
      }}>
        <button
          onClick={togglePlayPause}
          disabled={loading || error}
          style={{
            width: compact ? '40px' : '50px',
            height: compact ? '40px' : '50px', 
            borderRadius: '50%',
            background: loading ? 'rgba(0, 255, 136, 0.2)' :  
                      error ? 'rgba(255, 0, 0, 0.2)' : 
                      'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || error ? 'not-allowed' : 'pointer',
            color: '#0a0a0a',
            fontSize: compact ? '1rem' : '1.2rem',
            fontWeight: '700', 
            flexShrink: 0,
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!loading && !error) {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 255, 136, 0.4)';
            } 
          }}
          onMouseLeave={(e) => {
            if (!loading && !error) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.3)';
            }
          }} 
        >
          {loading ? (
            <div style={{
              width: '20px', 
              height: '20px', 
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : error ? (
            '⚠️'
          ) : isPlaying ? (
            '❚❚'
          ) : (
            '▶'
          )}
        </button>
        
        <div style={{ flex: 1 }}>
          <div style={{
            color: '#ffffff',
            fontWeight: '600', 
            fontSize: compact ? '0.9rem' : '1rem', 
            marginBottom: '0.25rem'
          }}>
            {title}
          </div>
          
          {!compact && (
            <div style={{
              display: 'flex',
              alignItems: 'center', 
              gap: '0.5rem'
            }}>
              <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                {formatDuration(currentTime)}
              </span>
              
              <div style={{
                flex: 1, 
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '2px',
                position: 'relative'
              }}>
                <input
                  ref={progressRef}
                  type="range" 
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0, 
                    width: '100%',
                    height: '100%',
                    appearance: 'none',
                    background: 'transparent',
                    margin: 0,
                    padding: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
                
                <div style={{
                  position: 'absolute',
                  top: 0, 
                  left: 0, 
                  height: '100%', 
                  width: `${(currentTime / (duration || 1)) * 100}%`,
                  background: '#00ff88',
                  borderRadius: '2px',
                  pointerEvents: 'none'
                }} />
              </div>
              
              <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                {formatDuration(duration)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {showWaveform && !compact && !error && (
        <div 
          ref={waveformRef}
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '2px', 
            height: '40px'
          }}
        >
          {[...Array(50)].map((_, i) => ( 
            <div
              key={i}
              style={{ 
                width: '3px',
                height: isPlaying ? `${Math.random() * 30 + 10}px` : '10px',
                background: isPlaying ? '#00ff88' : 'rgba(0, 255, 136, 0.3)',
                borderRadius: '1px', 
                transition: 'height 0.2s ease',
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            />
          ))}
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: '#ff6b6b',
          fontSize: '0.9rem',
          textAlign: 'center', 
          padding: '0.5rem',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          {error}
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Make sure the audio file is uploaded to the Supabase Storage 'audio' bucket
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input[type=range]::-webkit-slider-thumb { 
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
        }
        
        input[type=range]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%; 
          background: #00ff88;
          cursor: pointer;
          border: none; 
        }
      `}</style>
    </div>
  );
}