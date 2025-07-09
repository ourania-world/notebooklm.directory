// pages/subscription/success.js
import React from 'react';

export default function SubscriptionSuccess() {
  return (
    <div style={{ 
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      padding: '4rem',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Subscription Successful!</h1>
      <p style={{
        color: '#e2e8f0',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        marginBottom: '1.5rem'
      }}>
        Thank you for subscribing. You now have access to premium features.
      </p>
      <a href="/" style={{
        display: 'inline-block',
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        Go to Homepage
      </a>
    </div>
  );
}
