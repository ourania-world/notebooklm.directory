import { AuthProvider } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ErrorBoundary fallbackMessage="Something went wrong with this page. Please try refreshing." showReload={true}>
        <Component {...pageProps} />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default MyApp;