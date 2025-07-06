import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Initialize stripe outside component
let stripePromise;

export default function StripeComponents({ clientSecret }) {
  // Initialize stripe only once
  useEffect(() => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
  }, []);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#00ff88',
      colorBackground: '#1a1a2e',
      colorText: '#ffffff',
      colorDanger: '#ff6b6b',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '12px',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  if (!stripePromise || !clientSecret) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#e2e8f0'
      }}>
        Preparing payment form...
      </div>
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}