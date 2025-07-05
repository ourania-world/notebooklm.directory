import { useState, useEffect, useRef } from 'react'
import { trackSearch } from '../lib/analytics'
import { getCurrentUser } from '../lib/auth'

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search notebooks, topics, or authors...",
  showSuggestions = true 
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Popular search suggestions
  const popularSearches = [
    'AI research', 'Climate change', 'Machine learning', 'Data analysis',
    'Business strategy', 'Creative writing', 'Education', 'Healthcare',
    'Finance', 'Technology trends', 'Academic papers', 'Case studies'
  ]

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setShowSuggestions(false)

    try {
      // Track search analytics
      const user = await getCurrentUser()
      await trackSearch(user?.id, searchQuery)
      
      // Perform search
      onSearch(searchQuery)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 1 && showSuggestions) {
      // Filter suggestions based on input
      const filtered = popularSearches.filter(search =>
        search.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 6))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <div
        ref={searchRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onFocus={() => setShowSuggestions(true)}
      >
        <div style={{
          color: '#00ff88',
          fontSize: '1.2rem',
          marginRight: '0.75rem'
        }}>
          🔍
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        />

        {loading ? (
          <div style={{
            color: '#00ff88',
            fontSize: '1rem',
            marginLeft: '0.75rem'
          }}>
            ⏳
          </div>
        ) : (
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            style={{
              background: query.trim() ? 
                'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)' : 
                'rgba(255, 255, 255, 0.1)',
              color: query.trim() ? '#0a0a0a' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: query.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              marginLeft: '0.75rem'
            }}
          >
            Search
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (query.length > 1 || suggestions.length === 0) && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '12px',
            marginTop: '0.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {suggestions.length > 0 ? (
            <>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
                fontSize: '0.8rem',
                color: '#00ff88',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: index < suggestions.length - 1 ? 
                      '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                    e.target.style.color = '#00ff88';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ffffff';
                  }}
                >
                  🔍 {suggestion}
                </button>
              ))}
            </>
          ) : (
            <>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
                fontSize: '0.8rem',
                color: '#00ff88',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Popular Searches
              </div>
              {popularSearches.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: index < 5 ? 
                      '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 255, 136, 0.1)';
                    e.target.style.color = '#00ff88';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#ffffff';
                  }}
                >
                  🔥 {search}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}