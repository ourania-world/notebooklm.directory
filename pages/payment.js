                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Instant Access
                    </h3>
                    <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.85rem' }}>
                      Get immediate access to all available features. Coming soon features will be automatically enabled when ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Payment Form */}
            <div style={{ flex: '1 1 400px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(0, 255, 136, 0.2)'
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '1.5rem'
                }}>
                  Payment Details
                </h2>
                
                {error && (
                  <div style={{
                    background: 'rgba(220, 53, 69, 0.1)',
                    color: '#ff6b6b',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    fontSize: '0.9rem'
                  }}>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handlePayment}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="John Smith"
                      required
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      required
                      maxLength="19"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        required
                        maxLength="5"
                        style={{
                          width: '100%',
                          padding: '1rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        required
                        maxLength="3"
                        style={{
                          width: '100%',
                          padding: '1rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.9rem'
                    }}>
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#00ff88'
                        }}
                      />
                      <label htmlFor="terms" style={{ color: '#e2e8f0' }}>
                        I agree to the <Link href="/terms" style={{ color: '#00ff88', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: '#00ff88', textDecoration: 'none' }}>Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={paymentLoading}
                    style={{
                      width: '100%',
                      background: paymentLoading ? 
                        'rgba(255, 255, 255, 0.1)' : 
                        'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                      color: paymentLoading ? '#ffffff' : '#0a0a0a',
                      border: 'none',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: paymentLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {paymentLoading ? 'Processing...' : `Pay $${selectedPlan.price}/${selectedPlan.interval || 'once'}`}
                  </button>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1.5rem',
                    color: '#e2e8f0',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                    Secure payment processed by Stripe
                  </div>
                </form>
              </div>
              
              <div style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                color: '#e2e8f0',
                fontSize: '0.9rem'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  ✓ Cancel anytime • ✓ No hidden fees
                </p>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  Questions? Contact us at support@notebooklm.directory
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}