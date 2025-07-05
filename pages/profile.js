import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getCurrentUser } from '../lib/auth'
import { getProfile, updateProfile, getUserNotebooks, getSavedNotebooks } from '../lib/profiles'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [userNotebooks, setUserNotebooks] = useState([])
  const [savedNotebooks, setSavedNotebooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    institution: '',
    website: ''
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          // Redirect to home if no user, but don't throw error
          if (typeof window !== 'undefined') {
            window.location.href = '/'
          }
          return
        }

        setUser(currentUser)
        
        // Load profile
        const userProfile = await getProfile(currentUser.id)
        setProfile(userProfile)
        
        if (userProfile) {
          setFormData({
            full_name: userProfile.full_name || '',
            bio: userProfile.bio || '',
            institution: userProfile.institution || '',
            website: userProfile.website || ''
          })
        }

        // Load user's notebooks and saved notebooks
        const [notebooks, saved] = await Promise.all([
          getUserNotebooks(currentUser.id),
          getSavedNotebooks(currentUser.id)
        ])
        
        setUserNotebooks(notebooks)
        setSavedNotebooks(saved)
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedProfile = await updateProfile(user.id, formData)
      setProfile(updatedProfile)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Profile - NotebookLM Directory">
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p>Loading profile...</p>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout title="Profile - NotebookLM Directory">
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p>Please sign in to view your profile.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Profile - NotebookLM Directory">
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* Profile Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {(profile?.full_name || user.email)[0].toUpperCase()}
              </div>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#212529' }}>
                  {profile?.full_name || 'User'}
                </h1>
                <p style={{ margin: 0, color: '#6c757d' }}>{user.email}</p>
                {profile?.institution && (
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d' }}>
                    📍 {profile.institution}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setEditing(!editing)}
              style={{
                background: editing ? '#6c757d' : '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px'
                    }}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSave}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  alignSelf: 'flex-start'
                }}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              {profile?.bio && (
                <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6', color: '#495057' }}>
                  {profile.bio}
                </p>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#667eea', textDecoration: 'none' }}
                >
                  🌐 {profile.website}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {userNotebooks.length}
            </div>
            <div style={{ color: '#6c757d' }}>Notebooks Submitted</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {savedNotebooks.length}
            </div>
            <div style={{ color: '#6c757d' }}>Saved Notebooks</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={() => window.location.href = '/my-notebooks'}
            style={{
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#667eea'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#212529' }}>
              My Notebooks
            </div>
            <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              View and manage your submitted notebooks
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/saved'}
            style={{
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#667eea'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💾</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#212529' }}>
              Saved Notebooks
            </div>
            <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Access your bookmarked notebooks
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/submit'}
            style={{
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#667eea'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>➕</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#212529' }}>
              Submit New Notebook
            </div>
            <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Share your latest NotebookLM project
            </div>
          </button>
        </div>
      </div>
    </Layout>
  )
}