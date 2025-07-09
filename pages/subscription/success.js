// pages/subscription/success.js
import React from 'react';

export default function SubscriptionSuccess() {
  return (
    <div style={{
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#ffffff',
      margin: '0 0 0.25rem 0',
      padding: '4rem',
      background: '#0a0a0a',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉 Subscription Successful</h1>
      <p style={{
        color: '#e2e8f0',
        fontSize: '1.2rem',
        lineHeight: '1.6',
        marginBottom: '1.5rem'
      }}>
        Thank you for subscribing! Your premium access is now active.
      </p>
      <p style={{
        color: '#94a3b8',
        fontSize: '1rem',
        lineHeight: '1.4'
      }}>
        You can now explore all enhanced features and content across the platform.
      </p>
    </div>
  );
}
