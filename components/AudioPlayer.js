// components/AudioPlayer.js
import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ 
  audioUrl, 
  title,
  autoPlay = false,
  onEnded = () => {},
  onPlay = () => {},
  onPause = () => {}
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states when audio URL changes
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setLoading(true);
    setError(null);
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded();
    };

    const handleError = (e) => {
      setLoading(false);
      
      let errorMessage = "Unknown audio error";
      if (audio.error) {
        switch (audio.error.code) {
          case 1: errorMessage = "Audio loading aborted"; break;
          case 2: errorMessage = "Network error while loading audio"; break;
          case 3: errorMessage = "Audio decoding failed"; break;
          case 4: errorMessage = "Audio source not supported"; break;
        }
      }
      
      setError(errorMessage);
      console.error("Audio error:", e);
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Clean up
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, onEnded]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPause();
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          onPlay();
        })
        .catch(err => {
          setError("Failed to play audio: " + err.message);
          console.error("Play error:", err);
        });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {title && <div className="audio-title">{title}</div>}
      
      <div className="audio-controls">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`} 
          onClick={togglePlayPause}
          disabled={loading || error}
        >
          {loading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="seek-slider"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleSeek}
            disabled={loading || error}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {error && <div className="audio-error">{error}</div>}
      
      <style jsx>{`
        .audio-player {
          width: 100%;
          max-width: 500px;
          padding: 15px;
          border-radius: 8px;
          background: #f5f5f5;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .audio-title {
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
        }
        
        .audio-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .play-button {
          padding: 8px 16px;
          border-radius: 20px;
          background: #3498db;
          color: white;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .play-button:hover {
          background: #2980b9;
        }
        
        .play-button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }
        
        .play-button.playing {
          background: #e74c3c;
        }
        
        .time-display {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 10px;
        }
        
        .seek-slider {
          flex-grow: 1;
          height: 5px;
        }
        
        .audio-error {
          margin-top: 10px;
          color: #e74c3c;
          text-align: center;
          padding: 5px;
          border: 1px solid #e74c3c;
          border-radius: 4px;
          background: rgba(231, 76, 60, 0.1);
        }
      `}</style>
    </div>
  );
}
