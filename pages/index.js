export default function Notebooks() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '5rem' }}>
      <h1>📘 NotebookLM Directory</h1>
      <p>Coming soon: A curated collection of LM notebooks</p>
      
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>🎧 Listen to the Vision</h2>
        <audio controls>
          <source src="/overview.wav" type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </section>
    </div>
  );
}