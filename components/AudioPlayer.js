import React, { useState, useRef, useEffect } from 'react';

/**
 * Get the proper audio URL for playback
 * Handles both direct URLs and Supabase Storage paths
 */
function getAudioUrl(audioPath) {
  if (!audioPath) return null;
  
  // If it's already a full URL, use it directly
  if (audioPath.startsWith('http')) {
    return audioPath;
  }
  
  // For relative paths, use direct storage URL instead of Edge Function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
  
  // Return direct storage URL
  return `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(audioPath)}`;
}

/**
 * Format duration in seconds to MM:SS format
 */
function formatDuration(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * AudioPlayer React Component
 */
const AudioPlayer = ({ audioPath, title, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const audioUrl = getAudioUrl(audioPath);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      setError('Failed to load audio');
      setIsLoading(false);
      console.error('Audio error:', e);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        setError('Failed to play audio');
        console.error('Play error:', err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!audioUrl) {
    return (
      <div className={`audio-player error ${className}`}>
        <p>No audio file provided</p>
      </div>
    );
  }

  return (
    <div className={`audio-player ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {title && <div className="audio-title">{title}</div>}
      
      <div className="audio-controls">
        <button 
          onClick={togglePlayPause}
          disabled={isLoading || error}
          className="play-pause-btn"
        >
          {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="time-display">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>
        
        <div 
          className="progress-bar"
          onClick={handleSeek}
        >
          <div 
            className="progress-fill"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>
      
      {error && <div className="audio-error">{error}</div>}
      
      <style jsx>{`
        .audio-player {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 16px;
          margin: 8px 0;
          border: 1px solid #ddd;
        }
        
        .audio-player.error {
          background: #fee;
          border-color: #fcc;
          color: #c33;
        }
        
        .audio-title {
          font-weight: bold;
          margin-bottom: 12px;
          color: #333;
        }
        
        .audio-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .play-pause-btn {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .play-pause-btn:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .play-pause-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .time-display {
          font-family: monospace;
          font-size: 14px;
          color: #666;
          min-width: 80px;
        }
        
        .progress-bar {
          flex: 1;
          height: 6px;
          background: #ddd;
          border-radius: 3px;
          cursor: pointer;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: #007bff;
          border-radius: 3px;
          transition: width 0.1s ease;
        }
        
        .audio-error {
          color: #c33;
          font-size: 14px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;