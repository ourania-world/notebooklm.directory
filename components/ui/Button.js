export function Button({ children, onClick, disabled, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? 
          'rgba(255, 255, 255, 0.1)' : 
          'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
        color: disabled ? '#ffffff' : '#0a0a0a',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        ...className
      }}
      {...props}
    >
      {children}
    </button>
  );
}