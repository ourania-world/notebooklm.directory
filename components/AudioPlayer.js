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
  
  const audioRef = useRef(null); 
  const progressRef = useRef(null); 
  const waveformRef = useRef(null); 
  const animationRef = useRef(null); 
  const [mounted, setMounted] = useState(false);
  
  // Make sure we have a valid audio URL
  const fullAudioUrl = mounted ? getAudioUrl(audioUrl) : null;
  
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
    
    const audio = audioRef.current;
    if (!audio || !fullAudioUrl) return;
    
    const handleCanPlayThrough = () => {
      setLoading(false);
      setDuration(audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    const handleError = (e) => {
      console.error('Audio error:', e);
      console.error('Audio source:', fullAudioUrl);
      setError(`Failed to load audio: ${e.target?.error?.message || 'Unknown error'}`);
      setLoading(false);
    };
    
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
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
  }, [isPlaying]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) return null;
  
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
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px', 
      padding: compact ? '1rem' : '1.5rem',
      border: '1px solid rgba(0, 255, 136, 0.2)', 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      width: '100%'
    }}> 
      {fullAudioUrl && <audio ref={audioRef} src={fullAudioUrl} preload="metadata" />}
      
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
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
            className: 'button-glow'
          }}
          onMouseEnter={(e) => {
            if (!loading && !error) {
              e.target.style.transform = 'scale(1.05)';
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
              className={isPlaying ? 'waveform-bar' : ''}
              style={{
                '--i': i
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
          padding: '0.5rem' 
        }}>
          {error} 
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Try refreshing the page or check your audio file
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