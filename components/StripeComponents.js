import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment succeeded!');
      setTimeout(() => router.push('/payment-success'), 1500);
    } else {
      setMessage('Unexpected payment state.');
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      {message && (
        <div
          style={{
            color: message.includes('succeeded') ? '#00ff88' : '#ff6b6b',
            margin: '1rem 0',
            padding: '0.75rem',
            borderRadius: '8px',
            background: message.includes('succeeded')
              ? 'rgba(0, 255, 136, 0.1)'
              : 'rgba(255, 107, 107, 0.1)',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          {message}
        </div>
      )}
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        style={{
          width: '100%',
          background: isLoading
            ? 'rgba(255, 255, 255, 0.1)'
            : 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
          color: isLoading ? '#ffffff' : '#0a0a0a',
          border: 'none',
          padding: '1rem',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginTop: '1.5rem',
          transition: 'all 0.2s ease',
        }}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function StripeComponents({ clientSecret }) {
  if (!clientSecret) {
    return (
      <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '2rem' }}>
        ⚠️ No client secret provided. Unable to initialize Stripe.
      </p>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#00ff88',
        colorBackground: '#16213e',
        colorText: '#ffffff',
        colorDanger: '#ff6b6b',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
