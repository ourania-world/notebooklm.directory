export function Card({ children, className = '' }) {
  return <div style={{
    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8) 100%)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    marginBottom: '1rem',
    ...className
  }}>
    {children}
  </div>;
}