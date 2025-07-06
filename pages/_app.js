import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

// Main app component
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
