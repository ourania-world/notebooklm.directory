# 🎵 Audio Setup Guide for NotebookLM Directory

## Overview

This guide helps you set up reliable audio playback for your NotebookLM Directory, including the vision overview and any notebook audio summaries.

## 🚀 Quick Setup

### 1. Deploy the Audio Edge Function

The `serve-audio` Edge Function handles audio delivery with proper CORS headers and caching.

**Deploy via Supabase Dashboard:**
1. Go to your Supabase Dashboard → Edge Functions
2. Create new function named `serve-audio`
3. Copy the code from `supabase/functions/serve-audio/index.ts`
4. Deploy the function

### 2. Set Up Storage Bucket

1. **Create Audio Bucket:**
   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('audio', 'audio', true);
   ```

2. **Set Storage Policies:**
   ```sql
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
   ```

### 3. Upload Your Audio Files

**Option A: Via Supabase Dashboard**
1. Go to Storage → audio bucket
2. Upload your `overview.mp3` file
3. Note the file path for reference

**Option B: Via Code**
```javascript
import { supabase } from './lib/supabase';

async function uploadAudio(file, filename) {
  const { data, error } = await supabase.storage
    .from('audio')
    .upload(filename, file);
    
  if (error) throw error;
  return data;
}
```

## 🔧 Configuration

### Environment Variables

Ensure these are set in your deployment:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### CORS Configuration

In your Supabase Dashboard → Settings → API:
1. Add your domain to allowed origins
2. Include `https://your-domain.com` and `http://localhost:3000`

## 🎵 Using the Audio Player

### Basic Usage

```jsx
import AudioPlayer from '../components/AudioPlayer';

function MyComponent() {
  return (
    <AudioPlayer 
      audioUrl="overview.mp3"
      title="Project Overview"
    />
  );
}
```

### With Notebook Data

```jsx
function NotebookCard({ notebook }) {
  return (
    <div>
      <h3>{notebook.title}</h3>
      <p>{notebook.description}</p>
      
      {notebook.audio_overview_url && (
        <AudioPlayer 
          audioUrl={notebook.audio_overview_url}
          title="Audio Overview"
        />
      )}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Audio Not Loading**
   - Check browser console for CORS errors
   - Verify the Edge Function is deployed
   - Ensure audio file exists in storage

2. **Playback Fails**
   - Check audio file format (MP3, WAV, OGG supported)
   - Verify file isn't corrupted
   - Test direct URL access

3. **CORS Errors**
   - Add your domain to Supabase CORS settings
   - Check Edge Function CORS headers
   - Verify storage bucket is public

### Debug Steps

1. **Test Edge Function Directly:**
   ```
   GET https://your-project.supabase.co/functions/v1/serve-audio?path=overview.mp3
   ```

2. **Check Storage Access:**
   ```
   GET https://your-project.supabase.co/storage/v1/object/public/audio/overview.mp3
   ```

3. **Browser Console:**
   - Look for network errors
   - Check for media format errors
   - Verify CORS policy errors

## 📱 Mobile Considerations

- iOS requires user interaction before audio playback
- Android may have different codec support
- Consider providing multiple audio formats for compatibility

## 🎯 Best Practices

1. **File Optimization:**
   - Compress audio files (aim for <5MB)
   - Use MP3 format for best compatibility
   - Consider multiple bitrates for different connections

2. **User Experience:**
   - Show loading states during audio loading
   - Provide clear error messages
   - Include duration and progress indicators

3. **Performance:**
   - Use `preload="metadata"` for faster loading
   - Implement proper caching headers
   - Consider lazy loading for multiple audio files

## 🚀 Production Deployment

1. **Upload all audio files to Supabase Storage**
2. **Deploy the Edge Function**
3. **Test audio playback on your live site**
4. **Monitor for any CORS or loading issues**

Your audio setup is now complete and ready for production! 🎉