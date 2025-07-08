// Audio utility functions for the NotebookLM Directory

/**
 * Get the proper audio URL for playback
 * Handles both direct URLs and Supabase Storage paths
 */
export function getAudioUrl(audioPath) {
  if (!audioPath) return null;
  
  // If it's already a full URL, use it directly
  if (audioPath.startsWith('http')) {
    return audioPath;
  }
  
  // For relative paths, use direct storage URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
  
  // Return direct storage URL
  return `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(audioPath)}`;
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Check if audio is supported in the current browser
 */
export function isAudioSupported() {
  if (typeof window === 'undefined') return false;
  try {
    const result = typeof Audio !== 'undefined' && 'canPlayType' in HTMLAudioElement.prototype;
    console.log('Audio supported:', result);
    return result;
  } catch (e) {
    console.error('Audio not supported:', e);
    return false;
  }
}

/**
 * Test if an audio URL is accessible
 */
export async function testAudioUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log('Audio URL test result:', url, response.status, response.ok);
    return {
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type')
    };
  } catch (error) {
    console.error('Error testing audio URL:', url, error);
    return {
      accessible: false,
      error: error.message
    };
  }
}