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
  
  // For relative paths, use direct storage URL instead of Edge Function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
  
  // Return direct storage URL
  return `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(audioPath)}`;
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
 * Debug audio issues
 */
export function debugAudio(audioElement) {
  if (typeof window === 'undefined') return null;
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