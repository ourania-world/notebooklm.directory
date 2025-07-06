import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error);
        } else {
          setSession(data.session || null);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session || null);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Auth methods
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setError(error);
    } catch (err) {
      setError(err);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
      });
      if (error) throw error;
    } catch (err) {
      setError(err);
      throw err;
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

  return (
    <AuthContext.Provider value={value}>
      {mounted ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
