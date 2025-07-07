import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getCurrentUser } from '../utils/yourHelpers';
import { SUBSCRIPTION_PLANS } from '../utils/yourHelpers';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

// Initialize Stripe (using a test publishable key)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export default function Payment() {
  const router = useRouter();
  const { plan = 'standard' } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [showStripe, setShowStripe] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login?redirect=/payment');
          return;
        }
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('Authentication error. Please try logging in again.');
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const selectedPlan = SUBSCRIPTION_PLANS[plan?.toUpperCase()] || SUBSCRIPTION_PLANS.STANDARD;

  const handleInitiatePayment = async () => {
    setPaymentLoading(true);
    setError(null);
    try {
      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.id,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title={`${selectedPlan.name} Plan - NotebookLM Directory`}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 255, 136, 0.3)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ color: '#e2e8f0', marginTop: '1rem' }}>
            Loading payment details...
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${selectedPlan.name} Plan - NotebookLM Directory`}>
      <div className="pricing-section-bg">
        <div className="pricing-section-container">
          <div className="pricing-flex">
            {/* Left: Punchy Pricing/Features Card */}
            <section className="pricing-section">
              <h2 className="pricing-title">Unlock Everything</h2>
              <p className="pricing-subtitle">
                All the bells & whistles — no surprises, no hidden fees.<br />
                <strong>One plan. All premium features.</strong>
              </p>
              <div className="pricing-amount">
                <span className="currency">$</span>
                <span className="price">{selectedPlan.price}</span>
                <span className="interval">/{selectedPlan.interval || 'month'}</span>
              </div>
              <ul className="feature-list">
                {selectedPlan.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <span role="img" aria-label="check">✅</span> <strong>{feature}</strong>
                  </li>
                ))}
              </ul>
              <button
                className="cta-btn"
                onClick={handleInitiatePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing...' : 'Start your free trial'}
              </button>
              <p className="fine-print">
                7-day free trial. Cancel anytime. No hidden fees, ever.
              </p>
            </section>
            {/* Right: Payment Form */}
            <div className="payment-card">
              <h2 className="payment-title">Payment Details</h2>
              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}
              {!showStripe ? (
                <div>
                  <button
                    onClick={handleInitiatePayment}
                    disabled={paymentLoading}
                    className="cta-btn stripe-btn"
                  >
                    {paymentLoading
                      ? 'Processing...'
                      : `Pay $${selectedPlan.price}/${selectedPlan.interval || 'once'}`}
                  </button>
                  <div className="secure-note">
                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                    Secure payment processed by Stripe
                  </div>
                </div>
              ) : (
                <div>
                  {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm />
                    </Elements>
                  )}
                </div>
              )}
              <div className="cancel-note">
                <p>
                  ✓ Cancel anytime • ✓ No hidden fees
                </p>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  Questions? Contact us at support@notebooklm.directory
                </p>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .pricing-section-bg {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            min-height: 80vh;
            padding: 4rem 0;
          }
          .pricing-section-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          .pricing-flex {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 2rem;
            flex-wrap: wrap;
          }
          .pricing-section {
            max-width: 420px;
            margin: 0 auto 2rem auto;
            padding: 2.5rem 1.25rem;
            background: #fff;
            border-radius: 1.5rem;
            box-shadow: 0 4px 32px rgba(0,0,0,0.07);
            text-align: center;
            flex: 1 1 400px;
          }
          .pricing-title {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
            letter-spacing: -0.02em;
          }
          .pricing-subtitle {
            color: #5a5a5a;
            margin-bottom: 1.25rem;
            font-size: 1.1rem;
          }
          .pricing-amount {
            font-size: 2.1rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .currency {
            font-size: 1.2rem;
            vertical-align: super;
          }
          .price {
            font-size: 2.2rem;
            font-weight: 800;
          }
          .interval {
            font-size: 1rem;
            color: #999;
            margin-left: 0.1em;
          }
          .feature-list {
            list-style: none;
            margin: 1.3em 0 1em 0;
            padding: 0;
            text-align: left;
          }
          .feature-item {
            font-size: 1.08rem;
            margin-bottom: 0.7em;
            display: flex;
            align-items: center;
          }
          .feature-item span[role="img"] {
            margin-right: 0.65em;
          }
          .cta-btn {
            background: linear-gradient(90deg,#5f59f7 0%,#aa4bfa 100%);
            color: #fff;
            font-weight: 700;
            font-size: 1.13rem;
            border: none;
            border-radius: 0.7em;
            padding: 0.85em 2em;
            margin-top: 1em;
            box-shadow: 0 4px 18px rgba(95,89,247,0.13);
            cursor: pointer;
            transition: background 0.2s;
            width: 100%;
          }
          .cta-btn:hover {
            background: linear-gradient(90deg,#aa4bfa 0%,#5f59f7 100%);
          }
          .fine-print {
            color: #767676;
            font-size: 0.95rem;
            margin-top: 1em;
          }
          .payment-card {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(0, 255, 136, 0.2);
            flex: 1 1 400px;
            min-width: 320px;
            max-width: 420px;
            margin: 0 auto 2rem auto;
          }
          .payment-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1.5rem;
            text-align: center;
          }
          .error-box {
            background: rgba(220, 53, 69, 0.1);
            color: #ff6b6b;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(220, 53, 69, 0.3);
            font-size: 0.9rem;
            text-align: center;
          }
          .stripe-btn {
            background: linear-gradient(135deg, #00ff88 0%, #00e67a 100%);
            color: #0a0a0a;
            margin-top: 0;
          }
          .stripe-btn:disabled {
            background: rgba(255,255,255,0.12);
            color: #fff;
            cursor: not-allowed;
          }
          .secure-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
            color: #e2e8f0;
            font-size: 0.9rem;
          }
          .cancel-note {
            text-align: center;
            margin-top: 1.5rem;
            color: #e2e8f0;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    </Layout>
  );
}
