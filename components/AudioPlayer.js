import React from 'react';

// If you have a getAudioUrl utility, import it. If not, just use the url directly.
function getAudioUrl(url) {
  return url;
}

const AudioPlayer = ({ audioUrl, title, showWaveform = false }) => {
  const url = getAudioUrl(audioUrl);
  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.8)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem'
    }}>
      <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>{title}</h3>
      <audio controls src={url} style={{ width: '100%' }}>
        Your browser does not support the audio element.
      </audio>
      {showWaveform && (
        <div style={{
          height: '40px',
          background: 'rgba(0, 255, 136, 0.1)',
          borderRadius: '8px',
          marginTop: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00ff88',
            fontSize: '0.8rem'
          }}>
            Waveform visualization (placeholder)
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
