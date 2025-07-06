// pages/payment.js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Payment.module.css';

// Dynamically import Stripe components to avoid SSR issues
const StripeComponents = dynamic(
  () => import('../components/StripeComponents'),
  { ssr: false }
);

export default function Payment() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create payment intent');
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1>Payment</h1>
      
      {loading && <p>Loading payment system...</p>}
      
      {error && <p className={styles.error}>Error: {error}</p>}
      
      {!loading && !error && clientSecret && (
        <StripeComponents clientSecret={clientSecret} />
      )}
    </div>
  );
}
