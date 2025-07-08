import React from 'react';
import AudioPlayer from '../components/AudioPlayer'; // Make sure the path and filename match exactly!

export default function HomePage() {
  // Debug: Confirm AudioPlayer import
  console.log('AudioPlayer:', typeof AudioPlayer);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#181826',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <h1>NotebookLM Directory Vision</h1>
      <AudioPlayer
        audioUrl="overview.mp3"
        title="NotebookLM Directory Vision"
        showWaveform={true}
      />
      <p>
        Welcome to your Next.js app with a working AudioPlayer component!
      </p>
    </div>
  );
}
