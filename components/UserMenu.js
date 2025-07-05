import { useState, useEffect } from 'react'
import { getCurrentUser, signOut } from '../lib/auth'

export default function UserMenu({ user, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      onSignOut?.()
      setIsOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'white',
          color: '#667eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
        </div>
        <span>{user.user_metadata?.full_name || user.email}</span>
        <span style={{ fontSize: '0.8rem' }}>▼</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e9ecef',
            minWidth: '200px',
            zIndex: 1000
          }}>
            <div style={{ padding: '0.5rem 0' }}>
              <button
                onClick={() => {
                  window.location.href = '/profile'
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#212529'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                👤 Profile
              </button>
              <button
                onClick={() => {
                  window.location.href = '/my-notebooks'
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#212529'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                📚 My Notebooks
              </button>
              <button
                onClick={() => {
                  window.location.href = '/saved'
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#212529'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                💾 Saved
              </button>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e9ecef' }} />
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#dc3545'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}