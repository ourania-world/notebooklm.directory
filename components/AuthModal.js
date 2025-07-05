import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        onAuthSuccess?.();
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName
        });
        setMessage('Check your email for the confirmation link!');
      } else if (mode === 'reset') {
        await resetPassword(formData.email);
        setMessage('Password reset email sent!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '20px',
        padding: '2.5rem',
        maxWidth: '450px',
        width: '100%',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            {mode === 'signin' ? 'Sign In' : 
             mode === 'signup' ? 'Create Account' : 
             'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#e2e8f0',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#00ff88';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#e2e8f0';
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            color: '#dc3545',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            color: '#00ff88',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            fontSize: '0.9rem'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#ffffff',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontWeight: '600',
              color: '#ffffff',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#ffffff',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: '#ffffff',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 
                'rgba(255, 255, 255, 0.1)' : 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
              color: loading ? '#ffffff' : '#0a0a0a',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 
                'none' : 
                '0 8px 24px rgba(0, 255, 136, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(0, 255, 136, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.3)';
              }
            }}
          >
            {loading ? 'Loading...' : 
             mode === 'signin' ? 'Sign In' :
             mode === 'signup' ? 'Create Account' :
             'Send Reset Email'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          {mode === 'signin' && (
            <>
              <button
                onClick={() => setMode('reset')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00ff88',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  display: 'block',
                  margin: '0 auto 1rem auto'
                }}
              >
                Forgot password?
              </button>
              <div style={{ fontSize: '0.9rem' }}>
                <span style={{ color: '#e2e8f0' }}>Don't have an account? </span>
                <button
                  onClick={() => setMode('signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00ff88',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.9rem'
                  }}
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div style={{ fontSize: '0.9rem' }}>
              <span style={{ color: '#e2e8f0' }}>Already have an account? </span>
              <button
                onClick={() => setMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00ff88',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.9rem'
                }}
              >
                Sign in
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => setMode('signin')}
              style={{
                background: 'none',
                border: 'none',
                color: '#00ff88',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}