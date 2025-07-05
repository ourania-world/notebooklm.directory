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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/serve-audio?path=${encodeURIComponent(audioPath)}`;
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
 * Check if audio is supported in the current browser
 */
export function isAudioSupported() {
  return typeof Audio !== 'undefined';
}