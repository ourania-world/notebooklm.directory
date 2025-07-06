import { AuthProvider } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR or before hydration, render minimal content
  if (!mounted && typeof window !== 'undefined') {
    return null;
  }

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;