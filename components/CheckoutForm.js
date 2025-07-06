import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/subscription/success`,
        },
      });

      if (error) {
        setMessage(error.message || "An unexpected error occurred.");
      }
      // No else needed as successful payments redirect to return_url
    } catch (err) {
      setMessage("Payment processing failed. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <PaymentElement id="payment-element" />
      
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit" 
        style={{
          width: '100%',
          background: isProcessing ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
          color: isProcessing ? '#ffffff' : '#0a0a0a',
          border: 'none',
          padding: '1rem',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          marginTop: '2rem',
          transition: 'all 0.2s ease'
        }}
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
      
      {message && (
        <div style={{
          color: '#ff6b6b',
          textAlign: 'center',
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          {message}
        </div>
      )}
    </form>
  );
}