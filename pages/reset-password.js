import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password - NotebookLM Directory">
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '3rem',
          width: '100%',
          maxWidth: '500px',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Reset <span style={{ color: '#00ff88' }}>Password</span>
          </h1>

          {error && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.1)',
              color: '#dc3545',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(220, 53, 69, 0.3)'
            }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{
              background: 'rgba(0, 255, 136, 0.1)',
              color: '#00ff88',
              padding: '2rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <h3 style={{ marginBottom: '1rem' }}>Check Your Email</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#ffffff',
                  fontWeight: '500'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: loading ? '#ffffff' : '#0a0a0a',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '1rem'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a
                  href="/login"
                  style={{
                    color: '#00ff88',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  Back to login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}