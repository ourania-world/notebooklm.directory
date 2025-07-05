import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ audioUrl, title = "Audio Overview" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);

  // Use direct path for public audio files
  const audioSrc = audioUrl?.startsWith('/') ? audioUrl : `/audio/${audioUrl}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => {
      setLoading(false);
      setIsLoaded(true);
      setError(null);
    };
    const handleError = (e) => {
      setLoading(false);
      setIsLoaded(false);
      setError('Failed to load audio');
      console.error('Audio error:', e.target?.error || e);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError('Playback failed');
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioSrc) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      maxWidth: '500px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Waveform visual effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(90deg, 
            transparent 0%, 
            rgba(0, 255, 136, 0.05) 25%, 
            rgba(0, 255, 136, 0.1) 50%, 
            rgba(0, 255, 136, 0.05) 75%, 
            transparent 100%
          )
        `,
        animation: isPlaying ? 'waveform 2s ease-in-out infinite' : 'none',
        pointerEvents: 'none'
      }} />
      
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.1rem',
          color: '#ffffff',
          fontWeight: '600'
        }}>
          🎧 {title}
        </h3>
        {error && (
          <p style={{ 
            color: '#dc3545', 
            fontSize: '0.9rem',
            margin: '0.5rem 0 0 0'
          }}>
            {error}
          </p>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          onClick={togglePlayPause}
          disabled={loading || error || !isLoaded}
          style={{
            background: loading || error || !isLoaded ? 
              'rgba(255, 255, 255, 0.1)' : 
              'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
            color: loading || error || !isLoaded ? '#ffffff' : '#0a0a0a',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || error || !isLoaded ? 'not-allowed' : 'pointer',
            fontSize: '1.5rem',
            transition: 'all 0.3s ease',
            boxShadow: loading || error || !isLoaded ? 
              'none' : 
              '0 8px 24px rgba(0, 255, 136, 0.3)',
            fontWeight: '700'
          }}
          onMouseEnter={(e) => {
            if (!loading && !error && isLoaded) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !error && isLoaded) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.3)';
            }
          }}
        >
          {loading ? '⏳' : error ? '❌' : !isLoaded ? '⏸️' : isPlaying ? '⏸️' : '▶️'}
        </button>

        <div style={{ flex: 1 }}>
          <div
            onClick={handleSeek}
            disabled={!isLoaded || loading || error}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              height: '8px',
              borderRadius: '4px',
              cursor: !isLoaded || loading || error ? 'not-allowed' : 'pointer',
              position: 'relative',
              marginBottom: '0.75rem',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                height: '100%',
                borderRadius: '4px',
                width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                transition: 'width 0.1s ease',
                boxShadow: '0 0 8px rgba(0, 255, 136, 0.5)'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontWeight: '500'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes waveform {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}