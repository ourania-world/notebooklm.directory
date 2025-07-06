import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

function AuthProvider({ children }) {
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

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
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
    isAuthenticated: !!user,
    isLoading: loading,
    session,
  };

  return <AuthContext.Provider value={value}>{mounted ? children : null}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };
