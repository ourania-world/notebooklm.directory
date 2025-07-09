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
  
  // Try multiple sources in order of preference
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
  
  // First try direct storage URL
  return `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(audioPath.replace(/^\//, ''))}`;
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
    // Try a GET request as fallback for CORS issues with HEAD
    try {
      const response = await fetch(url);
      console.log('GET fallback result:', url, response.status, response.ok);
      return {
        accessible: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type')
      };
    } catch (secondError) {
      console.error('Error with fallback GET request:', secondError);
      return {
        accessible: false,
        error: secondError.message || error.message
      };
    }
  }
}

/**
 * Try multiple audio sources and return the first one that works
 */
export async function findWorkingAudioSource(sources) {
  for (const source of sources) {
    try {
      console.log('Testing source:', source);
      const result = await testAudioUrl(source);
      if (result.accessible) {
        console.log('Found working source:', source);
        return source;
      }
      console.log('Source not accessible:', source);
    } catch (error) {
      console.warn(`Source failed: ${source}`, error);
    }
  }
  return null;
}

/**
 * Get all possible audio sources to try
 */
export function getAudioSources(audioPath) {
  if (!audioPath) return [];
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';
  
  const sources = [
    // 1. Direct Supabase Storage URL
    `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(audioPath.replace(/^\//, ''))}`,
    // 2. Local public folder
    `/${audioPath}`,
  ];
  
  // 3. Add original URL if it's a full URL
  if (audioPath.startsWith('http')) {
    sources.push(audioPath);
  }
  
  // 4. Try Edge Function as last resort
  sources.push(`${supabaseUrl}/functions/v1/serve-audio?path=${encodeURIComponent(audioPath.replace(/^\//, ''))}`);
  
  return sources;
}

/**
 * Create a blob URL from an audio file
 */
export async function createAudioBlobUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating blob URL:', error);
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
    return typeof Audio !== 'undefined' && 'canPlayType' in HTMLAudioElement.prototype;
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