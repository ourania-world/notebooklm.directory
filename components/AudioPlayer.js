import { useState, useEffect, useRef } from 'react';
import { formatDuration, isAudioSupported } from '../lib/audio';

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
  const [waveformBars, setWaveformBars] = useState(50);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const waveformRef = useRef(null);
  const animationRef = useRef(null);

  const fullAudioUrl = mounted ? audioUrl : null;

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    if (!isAudioSupported()) {
      setError('Audio not supported in this browser');
      setLoading(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio || !fullAudioUrl) return;

    const handleCanPlayThrough = () => {
      setLoading(false);
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [fullAudioUrl]);

  useEffect(() => {
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!waveformRef.current) return;
    const observer = new ResizeObserver(entries => {
      const container = entries[0].contentRect;
      const bars = Math.floor(container.width / 6); // ~5px per bar with gap
      setWaveformBars(bars);
    });
    observer.observe(waveformRef.current);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const animateWaveform = () => {
    if (waveformRef.current && showWaveform) {
      const bars = waveformRef.current.children;
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        const height = Math.random() * 30 + 10;
        bar.style.height = `${height}px`;
      }
    }
    animationRef.current = requestAnimationFrame(animateWaveform);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8))',
      borderRadius: '16px',
      padding: compact ? '1rem' : '1.5rem',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      width: '100%'
    }}>
      {fullAudioUrl && <audio ref={audioRef} src={fullAudioUrl} preload="metadata" />}
      {/* Control + Title Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: compact ? '0.75rem' : '1.5rem' }}>
        <button
          onClick={togglePlayPause}
          disabled={loading || error}
          style={{
            width: compact ? '40px' : '50px',
            height: compact ? '40px' : '50px',
            borderRadius: '50%',
            background: loading ? 'rgba(0,255,136,0.2)' : error ? 'rgba(255,0,0,0.2)' : 'linear-gradient(135deg, #00ff88, #00e67a)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || error ? 'not-allowed' : 'pointer',
            color: '#0a0a0a',
            fontSize: compact ? '1rem' : '1.2rem',
            fontWeight: 700,
            flexShrink: 0,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
          }}
        >
          {loading ? (
            <div style={{
              width: '20px', height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : error ? '⚠️' : isPlaying ? '❚❚' : '▶'}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: compact ? '0.9rem' : '1rem', marginBottom: '0.25rem' }}>
            {title}
          </div>
          {!compact && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{formatDuration(currentTime)}</span>
              <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                <input
                  ref={progressRef}
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    appearance: 'none', background: 'transparent', margin: 0, padding: 0, cursor: 'pointer', zIndex: 2
                  }}
                />
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${(currentTime / (duration || 1)) * 100}%`,
                  background: '#00ff88', borderRadius: '2px', pointerEvents: 'none'
                }} />
              </div>
              <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{formatDuration(duration)}</span>
            </div>
          )}
        </div>
      </div>

      {showWaveform && !compact && !error && (
        <div ref={waveformRef} style={{ display: 'flex', gap: '2px', width: '100%', height: '40px' }}>
          {[...Array(waveformBars)].map((_, i) => (
            <div key={i} style={{
              flex: '1',
              maxWidth: '5px',
              height: isPlaying ? `${Math.random() * 30 + 10}px` : '10px',
              background: isPlaying ? '#00ff88' : 'rgba(0,255,136,0.3)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
              animationPlayState: isPlaying ? 'running' : 'paused'
            }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center', padding: '0.5rem' }}>
          {error}
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Try refreshing the page or check your audio file.
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
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
