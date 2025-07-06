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
  
  // If it's a relative path, use the Edge Function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
  
  // Make sure the path doesn't start with a slash for the storage URL
  const cleanPath = audioPath.startsWith('/') ? audioPath.substring(1) : audioPath;
  
  // Return the edge function URL with proper encoding
  return `${supabaseUrl}/functions/v1/serve-audio?path=${encodeURIComponent(cleanPath)}`;
}

/**
 * Validate audio file format
 */
export function isValidAudioFormat(filename) {
  const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
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
 * Test if an audio URL is accessible
 */
export async function testAudioUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type')
    };
  } catch (error) {
    return {
      accessible: false,
      error: error.message
    };
  }
}

/**
 * Get audio file info from URL
 */
export async function getAudioInfo(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        duration: audio.duration,
        canPlay: true
      });
    });
    
    audio.addEventListener('error', (e) => {
      reject(new Error(`Audio load error: ${e.target?.error?.message || 'Unknown error'}`));
    });
    
    audio.src = url;
  });
}

/**
 * Check if audio is supported in the current browser
 */
export function isAudioSupported() {
  return typeof Audio !== 'undefined';
}

/**
 * Debug audio issues
 */
export function debugAudio(audioElement) {
  if (!audioElement) return null;
  
  return {
    src: audioElement.src,
    currentTime: audioElement.currentTime,
    duration: audioElement.duration,
    paused: audioElement.paused,
    ended: audioElement.ended,
    readyState: audioElement.readyState,
    networkState: audioElement.networkState,
    error: audioElement.error ? {
      code: audioElement.error.code,
      message: audioElement.error.message
    } : null
  };
}