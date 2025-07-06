import { AuthProvider } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

// Wrap the app with AuthProvider to provide authentication context
function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;