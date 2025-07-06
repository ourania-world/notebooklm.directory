import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './your_supabase_client'; // Adjust this import as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const getInitialSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Error getting session:', error);
            setError(error);
          } else {
            setSession(data?.session || null);
            setUser(data?.session?.user || null);
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session || null);
          setUser(session?.user || null);
          setLoading(false);
        }
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    } else {
      setLoading(false);
    }
  }, []);

  // Auth methods (add your own as needed)
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setError(error);
    } catch (err) {
      setError(err);
    }
  };

  // Example placeholder for other auth methods:
  // const signIn = async (...) => { ... }
  // const signUp = async (...) => { ... }
  // const resetPassword = async (...) => { ... }

  const value = {
    user,
    error,
    signOut,
    // signIn,
    // signUp,
    // resetPassword,
    isAuthenticated: !!user,
    isLoading: loading,
    session,
  };

  // Prevent hydration mismatches
  return (
    <AuthContext.Provider value={value}>
      {mounted ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for advanced usage
export { AuthContext };
