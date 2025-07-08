import React from 'react';
import AudioPlayer from '../components/AudioPlayer';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#181826',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <h1>NotebookLM Directory Vision</h1>
      {/* Example usage of AudioPlayer */}
      <AudioPlayer
        audioUrl="overview.mp3" // Make sure this file exists in your /public folder
        title="NotebookLM Directory Vision"
        showWaveform={true}
      />
      <p>Welcome to your Next.js app with an audio player!</p>
    </div>
  );
};

export default Home;
