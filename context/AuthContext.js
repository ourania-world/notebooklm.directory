import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({ 
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
  isLoading: true
});
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
  isLoading: true
});

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); 

  // Initialize auth state
  useEffect(() => {
    // Mark component as mounted to prevent hydration mismatch
    setMounted(true); 
    
    // Only run auth logic on the client side
    if (typeof window !== 'undefined') {
      const getInitialSession = async () => {
        // Set loading to true initially 
        setLoading(true);
        
        try {
          
          // Get initial session
          const { data, error } = await supabase.auth.getSession();
    // Mark component as mounted to prevent hydration mismatch
    setMounted(true); 
    
    // Only run auth logic on the client side
    if (typeof window !== 'undefined') {
      const getInitialSession = async () => {
        // Set loading to true initially 
        setLoading(true);
        
        try {
          
          // Get initial session
          const { data, error } = await supabase.auth.getSession();
           
          if (error) {
            console.warn('Error getting session:', error); 
            setError(error);
          } else {
            setSession(data.session || null);
            setUser(data.session?.user || null);
          }
        } catch (error) {
          console.warn('Failed to get initial session:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();
       
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event) {
            // console.log('Auth state changed:', event);
          }
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
      // On server, just set loading to false
      setLoading(false);
    }
  }, []);

  // Auth methods
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;  
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
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
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined 
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const value = {
    user,
    error,
    signOut,
    signIn,  
    signUp,
    resetPassword,
    // Helper methods
    isAuthenticated: !!user,
    isLoading: loading,
    session
  };

  // During SSR, just return children without user data
  // This prevents hydration mismatches
  return <AuthContext.Provider value={value}>{mounted ? children : null}</AuthContext.Provider>;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context && typeof window !== 'undefined') {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for advanced usage
export { AuthContext };
  if (!context && typeof window !== 'undefined') {