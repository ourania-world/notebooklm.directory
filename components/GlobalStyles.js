import { useEffect } from 'react';

export default function GlobalStyles() {
  useEffect(() => {
    // Add premium typography and spacing styles
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
        line-height: 1.6;
        letter-spacing: -0.01em;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: -0.025em;
        margin: 0;
      }
      
      h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.04em;
      }
      
      h2 {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.03em;
      }
      
      h3 {
        font-size: clamp(1.25rem, 3vw, 1.875rem);
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.02em;
      }
      
      p {
        line-height: 1.7;
        letter-spacing: -0.005em;
        margin: 0 0 1rem 0;
      }
      
      .text-large {
        font-size: 1.125rem;
        line-height: 1.7;
        letter-spacing: -0.01em;
      }
      
      .text-small {
        font-size: 0.875rem;
        line-height: 1.5;
        letter-spacing: 0.01em;
      }
      
      .text-xs {
        font-size: 0.75rem;
        line-height: 1.4;
        letter-spacing: 0.025em;
        text-transform: uppercase;
        font-weight: 600;
      }
      
      .font-mono {
        font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
        font-feature-settings: 'liga';
      }
      
      .premium-text-shadow {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .neon-text-shadow {
        text-shadow: 0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.1);
      }
      
      /* Responsive spacing utilities */
      .spacing-xs { padding: 0.25rem; }
      .spacing-sm { padding: 0.5rem; }
      .spacing-md { padding: 1rem; }
      .spacing-lg { padding: 1.5rem; }
      .spacing-xl { padding: 2rem; }
      .spacing-2xl { padding: 3rem; }
      .spacing-3xl { padding: 4rem; }
      
      .gap-xs { gap: 0.25rem; }
      .gap-sm { gap: 0.5rem; }
      .gap-md { gap: 1rem; }
      .gap-lg { gap: 1.5rem; }
      .gap-xl { gap: 2rem; }
      
      /* Enhanced readability for long content */
      .reading-content {
        max-width: 65ch;
        line-height: 1.8;
        font-size: 1.0625rem;
        letter-spacing: -0.003em;
      }
      
      .reading-content h1,
      .reading-content h2,
      .reading-content h3 {
        margin-top: 2.5rem;
        margin-bottom: 1rem;
      }
      
      .reading-content p {
        margin-bottom: 1.5rem;
      }
      
      /* Improved button typography */
      button, .button {
        font-family: inherit;
        font-weight: 600;
        letter-spacing: -0.01em;
        line-height: 1;
      }
      
      /* Enhanced input typography */
      input, textarea, select {
        font-family: inherit;
        line-height: 1.5;
        letter-spacing: -0.005em;
      }
      
      input::placeholder, textarea::placeholder {
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: -0.005em;
      }
      
      /* Premium focus states */
      input:focus, textarea:focus, select:focus, button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.2);
      }
      
      /* Smooth transitions for better UX */
      * {
        transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, 
                   box-shadow 0.2s ease, transform 0.2s ease;
      }
      
      /* Premium scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 255, 136, 0.3);
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 255, 136, 0.5);
      }
      
      /* Selection styling */
      ::selection {
        background: rgba(0, 255, 136, 0.3);
        color: #ffffff;
      }
      
      ::-moz-selection {
        background: rgba(0, 255, 136, 0.3);
        color: #ffffff;
      }
      
      /* Responsive breakpoints */
      @media (max-width: 768px) {
        .spacing-lg { padding: 1rem; }
        .spacing-xl { padding: 1.5rem; }
        .spacing-2xl { padding: 2rem; }
        .spacing-3xl { padding: 2.5rem; }
        
        .gap-lg { gap: 1rem; }
        .gap-xl { gap: 1.5rem; }
        
        .reading-content {
          font-size: 1rem;
          line-height: 1.7;
        }
      }
      
      @media (max-width: 480px) {
        .spacing-md { padding: 0.75rem; }
        .spacing-lg { padding: 0.75rem; }
        .spacing-xl { padding: 1rem; }
        .spacing-2xl { padding: 1.5rem; }
        .spacing-3xl { padding: 2rem; }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}