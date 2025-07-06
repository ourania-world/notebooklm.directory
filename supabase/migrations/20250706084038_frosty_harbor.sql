-- Create audio bucket if it doesn't exist
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
WITH CHECK (bucket_id = 'audio');

-- Allow authenticated users to update their own audio files
CREATE POLICY "Authenticated update audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'audio' AND (auth.uid() = owner OR owner IS NULL));

-- Allow authenticated users to delete their own audio files
CREATE POLICY "Authenticated delete audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'audio' AND (auth.uid() = owner OR owner IS NULL));