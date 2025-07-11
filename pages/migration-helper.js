import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function MigrationHelper() {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState({});

  useEffect(() => {
    async function checkMigrationStatus() {
      try {
        const response = await fetch('/api/migration-status');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to check migration status');
        }
        
        setMigrationStatus(data);
      } catch (err) {
        console.error('Error checking migration status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkMigrationStatus();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess({ ...copySuccess, [id]: true });
        setTimeout(() => {
          setCopySuccess({ ...copySuccess, [id]: false });
        }, 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const getMigrationInstructions = () => {
    const missingTables = [];
    
    if (migrationStatus?.tables) {
      Object.entries(migrationStatus.tables).forEach(([table, status]) => {
        if (!status.exists) {
          missingTables.push(table);
        }
      });
    }
    
    if (missingTables.length === 0 && migrationStatus?.audioBucket?.exists) {
      return null; // All migrations applied
    }
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          color: '#ffffff', 
          margin: '0 0 1rem 0',
          fontWeight: '600'
        }}>
          Required Migrations
        </h2>
        
        {missingTables.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              color: '#ffffff', 
              margin: '0 0 0.5rem 0',
              fontWeight: '600'
            }}>
              Missing Tables
            </h3>
            <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
              The following tables need to be created:
            </p>
            <ul style={{ 
              color: '#e2e8f0',
              paddingLeft: '1.5rem',
              marginBottom: '1rem'
            }}>
              {missingTables.map(table => (
                <li key={table}>{table}</li>
              ))}
            </ul>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ 
                fontSize: '1rem', 
                color: '#ffffff', 
                margin: '0 0 0.5rem 0',
                fontWeight: '600'
              }}>
                Apply Core Migration
              </h4>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                position: 'relative',
                marginBottom: '1rem'
              }}>
                <pre style={{ 
                  color: '#e2e8f0', 
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}>
                  {`-- Apply this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal')),
  tags text[] DEFAULT '{}',
  author text NOT NULL,
  institution text,
  notebook_url text NOT NULL,
  audio_overview_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read notebooks"
  ON notebooks
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert notebooks
CREATE POLICY "Authenticated users can insert notebooks"
  ON notebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured) VALUES
(
  'Academic Literature Review Assistant',
  'Automated analysis of 50+ research papers on climate change impacts, generating comprehensive summaries and identifying research gaps.',
  'Academic',
  ARRAY['Climate Science', 'Literature Review', 'Research'],
  'Dr. Sarah Chen',
  'Stanford University',
  'https://notebooklm.google.com/notebook/example1',
  true
),
(
  'Startup Pitch Deck Analyzer',
  'Comprehensive analysis of successful startup pitch decks, extracting key patterns and success factors for entrepreneurs.',
  'Business',
  ARRAY['Entrepreneurship', 'Pitch Decks', 'Business Strategy'],
  'Mike Rodriguez',
  'Y Combinator Alumni',
  'https://notebooklm.google.com/notebook/example2',
  true
);`}
                </pre>
                <button
                  onClick={() => copyToClipboard(`-- Apply this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal')),
  tags text[] DEFAULT '{}',
  author text NOT NULL,
  institution text,
  notebook_url text NOT NULL,
  audio_overview_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read notebooks"
  ON notebooks
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert notebooks
CREATE POLICY "Authenticated users can insert notebooks"
  ON notebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notebooks_updated_at
  BEFORE UPDATE ON notebooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured) VALUES
(
  'Academic Literature Review Assistant',
  'Automated analysis of 50+ research papers on climate change impacts, generating comprehensive summaries and identifying research gaps.',
  'Academic',
  ARRAY['Climate Science', 'Literature Review', 'Research'],
  'Dr. Sarah Chen',
  'Stanford University',
  'https://notebooklm.google.com/notebook/example1',
  true
),
(
  'Startup Pitch Deck Analyzer',
  'Comprehensive analysis of successful startup pitch decks, extracting key patterns and success factors for entrepreneurs.',
  'Business',
  ARRAY['Entrepreneurship', 'Pitch Decks', 'Business Strategy'],
  'Mike Rodriguez',
  'Y Combinator Alumni',
  'https://notebooklm.google.com/notebook/example2',
  true
);`, 'core-migration')}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {copySuccess['core-migration'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!migrationStatus?.audioBucket?.exists && (
          <div>
            <h3 style={{ 
              fontSize: '1.2rem', 
              color: '#ffffff', 
              margin: '0 0 0.5rem 0',
              fontWeight: '600'
            }}>
              Audio Bucket Setup
            </h3>
            <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
              The audio storage bucket needs to be created:
            </p>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '8px',
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <pre style={{ 
                color: '#e2e8f0', 
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                {`-- Apply this in your Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to audio files
CREATE POLICY "Public audio access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio');

-- Allow authenticated users to upload audio
CREATE POLICY "Authenticated upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio');`}
              </pre>
              <button
                onClick={() => copyToClipboard(`-- Apply this in your Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to audio files
CREATE POLICY "Public audio access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio');

-- Allow authenticated users to upload audio
CREATE POLICY "Authenticated upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio');`, 'audio-bucket')}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {copySuccess['audio-bucket'] ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            color: '#ffffff', 
            margin: '0 0 0.5rem 0',
            fontWeight: '600'
          }}>
            How to Apply Migrations
          </h3>
          <ol style={{ 
            color: '#e2e8f0',
            paddingLeft: '1.5rem',
            margin: 0
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'none' }}>Supabase Dashboard</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Select your project
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Click on "SQL Editor" in the left sidebar
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Click "New Query"
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Paste the SQL code from above
            </li>
            <li>
              Click "Run" to execute the query
            </li>
          </ol>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Migration Helper - NotebookLM Directory">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 2rem 0',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          Migration Helper
        </h1>
        
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px' 
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(0, 255, 136, 0.3)',
              borderTopColor: '#00ff88',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            color: '#ff6b6b',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              color: '#ff6b6b', 
              margin: '0 0 1rem 0',
              fontWeight: '600'
            }}>
              Connection Error
            </h2>
            <p style={{ margin: '0 0 1rem 0' }}>
              {error}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Please check your Supabase connection and environment variables.
            </p>
          </div>
        ) : (
          <>
            {/* Connection Status */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#ffffff', 
                margin: '0 0 1rem 0',
                fontWeight: '600'
              }}>
                Database Status
              </h2>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: migrationStatus?.status === 'connected' ? '#00ff88' : '#ff6b6b'
                }}></div>
                <span style={{ 
                  color: migrationStatus?.status === 'connected' ? '#00ff88' : '#ff6b6b',
                  fontWeight: '600'
                }}>
                  {migrationStatus?.status === 'connected' ? 'Connected to database' : 'Connection error'}
                </span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  color: '#ffffff', 
                  margin: '0 0 0.5rem 0',
                  fontWeight: '600'
                }}>
                  Environment Variables
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: migrationStatus?.environment?.supabaseUrl ? '#00ff88' : '#ff6b6b'
                    }}></div>
                    <span>NEXT_PUBLIC_SUPABASE_URL: {migrationStatus?.environment?.supabaseUrl ? 'Set' : 'Not set'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: migrationStatus?.environment?.supabaseAnonKey ? '#00ff88' : '#ff6b6b'
                    }}></div>
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {migrationStatus?.environment?.supabaseAnonKey ? 'Set' : 'Not set'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  color: '#ffffff', 
                  margin: '0 0 0.5rem 0',
                  fontWeight: '600'
                }}>
                  Tables Status
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}>
                  {migrationStatus?.tables && Object.entries(migrationStatus.tables).map(([table, status]) => (
                    <div key={table} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: status.exists ? '#00ff88' : '#ff6b6b'
                      }}></div>
                      <span>{table}: {status.exists ? `Exists (${status.count} rows)` : 'Missing'}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: migrationStatus?.audioBucket?.exists ? '#00ff88' : '#ff6b6b'
                    }}></div>
                    <span>audio bucket: {migrationStatus?.audioBucket?.exists ? 'Exists' : 'Missing'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Migration Instructions */}
            {getMigrationInstructions()}
            
            {/* Next Steps */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#ffffff', 
                margin: '0 0 1rem 0',
                fontWeight: '600'
              }}>
                Next Steps
              </h2>
              
              <p style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>
                After applying the migrations, you can test the database connection and view notebooks:
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/database-test" style={{
                  background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}>
                  Test Database Connection
                </Link>
                
                <Link href="/browse" style={{
                  background: 'transparent',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}>
                  Browse Notebooks
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}