import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ audioUrl, title = "Audio Overview" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);

  // Construct the proper audio URL
  const getAudioUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL, use it directly
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it's a path, use the Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/functions/v1/serve-audio?path=${encodeURIComponent(url)}`;
  };

  const audioSrc = getAudioUrl(audioUrl);

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
      background: '#1a2332',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #2a3441',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.1rem',
          color: '#ffffff'
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={togglePlayPause}
          disabled={loading || error || !isLoaded}
          style={{
            background: loading || error || !isLoaded ? '#6c757d' : '#00ff88',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || error || !isLoaded ? 'not-allowed' : 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading && !error && isLoaded) {
              e.target.style.background = '#00e67a';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !error && isLoaded) {
              e.target.style.background = '#00ff88';
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
              background: '#2a3441',
              height: '6px',
              borderRadius: '3px',
              cursor: !isLoaded || loading || error ? 'not-allowed' : 'pointer',
              position: 'relative',
              marginBottom: '0.5rem'
            }}
          >
            <div
              style={{
                background: '#00ff88',
                height: '100%',
                borderRadius: '3px',
                width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                transition: 'width 0.1s ease'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#a0aec0'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}