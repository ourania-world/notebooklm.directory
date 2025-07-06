
// Main app component
// Main app component
function MyApp({ Component, pageProps }) { 
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
