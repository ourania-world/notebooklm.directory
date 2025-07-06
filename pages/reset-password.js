import { useState } from 'react';
import Layout from '../components/Layout';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send reset email.');

      setSubmitted(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <Layout title="Reset Password - NotebookLM Directory">
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#1e293b', borderRadius: '16px', color: '#ffffff' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Reset Your Password</h1>
        <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
          Enter your email and we'll send you instructions to reset your password.
        </p>

        {submitted ? (
          <p style={{ color: '#00ff88' }}>✅ Check your email for a reset link.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: '#0f172a',
                color: '#fff'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #00ff88, #00e67a)',
                color: '#0a0a0a',
                fontWeight: '700',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Send Reset Link
            </button>
          </form>
        )}

        {error && <p style={{ color: '#ff4d4d', marginTop: '1rem' }}>⚠️ {error}</p>}
        }
      </div>
    </Layout>
  );
}
