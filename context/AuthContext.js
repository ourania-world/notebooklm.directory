import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted to prevent hydration mismatch
    setHasMounted(true);
    
    // Only run auth logic on the client side
    if (typeof window !== 'undefined') {
      // Handle initial session and auth state changes
      const setupAuth = async () => {
        try {
          // First, try to get the session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.warn('Error getting initial session:', error);
            setError(error);
            setLoading(false);
            return;
          }
          
          setUser(data.session?.user || null);
          
          // Set up auth state change listener
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              setUser(session?.user || null);
            }
          );
          
          setLoading(false);
          
          // Cleanup function to unsubscribe
          return () => {
            subscription?.unsubscribe();
          };
        } catch (error) {
          console.error('Auth setup error:', error);
          setError(error);
          setLoading(false);
        }
      };
      
      setupAuth();
    } else {
      // On server, just set loading to false without auth checks
      setLoading(false);
    }
  }, []);

  // Auth methods
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!hasMounted) {
    return <>{children}</>;
  }

  const value = {
    user,
    loading,
    error,
    signOut,
    signIn,
    signUp,
    resetPassword,
    // Helper methods
    isAuthenticated: !!user,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for advanced usage
export { AuthContext };