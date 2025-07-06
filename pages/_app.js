import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

// Wrap the app with AuthProvider to provide authentication context
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;