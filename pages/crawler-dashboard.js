// pages/payment.js
import React from 'react';

export default function PaymentPage() {
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
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Upgrade Your Experience</h1>
      <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
        To unlock premium features, please proceed with a subscription via the checkout link.
      </p>
      {/* Add payment logic or button here */}
    </div>
  );
}
