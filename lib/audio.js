// Audio utility functions for the NotebookLM Directory

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ciwlmdnmnsymiwmschej.supabase.co';

/**
 * Returns a fully qualified audio URL from a given path.
 * Removes any accidental leading slashes.
 */
export function getAudioUrl(audioPath) {
  if (!audioPath) return null;
  if (audioPath.startsWith('http')) return audioPath;

  const cleanPath = audioPath.replace(/^\/+/, '');
  return `${BASE_URL}/storage/v1/object/public/audio/${encodeURIComponent(cleanPath)}`;
}

/**
 * Returns multiple fallback audio sources to test
 */
export function getAudioSources(audioPath) {
  if (!audioPath) return [];

  const cleanPath = audioPath.replace(/^\/+/, '');
  return [
    `/${cleanPath}`, // Local fallback
    `${BASE_URL}/functions/v1/serve-audio?path=${encodeURIComponent(cleanPath)}`, // Edge function
    `${BASE_URL}/storage/v1/object/public/audio/${encodeURIComponent(cleanPath)}`, // Direct
    ...(audioPath.startsWith('http') ? [audioPath] : [])
  ];
}

export function isValidAudioFormat(filename) {
  const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
  return validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

export function formatDuration(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export async function testAudioUrl(url) {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (head.ok) return { accessible: true, status: head.status, contentType: head.headers.get('content-type') };
    const get = await fetch(url);
    return { accessible: get.ok, status: get.status, contentType: get.headers.get('content-type') };
  } catch (error) {
    console.error('Audio test failed:', url, error);
    return { accessible: false, error: error.message };
  }
}

export async function findWorkingAudioSource(sources) {
  for (const source of sources) {
    const result = await testAudioUrl(source);
    if (result.accessible) return source;
  }
  return null;
}

export async function createAudioBlobUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Blob error:', err);
    return { accessible: false, error: err.message };
  }
}

export async function getAudioInfo(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => resolve({ duration: audio.duration, canPlay: true });
    audio.onerror = (e) => reject(new Error(`Audio error: ${e.target?.error?.message || 'Unknown error'}`));
    audio.src = url;
  });
}

export function isAudioSupported() {
  if (typeof window === 'undefined') return false;
  try {
    return typeof Audio !== 'undefined' && 'canPlayType' in HTMLAudioElement.prototype;
  } catch {
    return false;
  }
}

export function debugAudio(audio) {
  if (!audio || typeof window === 'undefined') return null;
  return {
    src: audio.src,
    currentTime: audio.currentTime,
    duration: audio.duration,
    paused: audio.paused,
    ended: audio.ended,
    readyState: audio.readyState,
    networkState: audio.networkState,
    error: audio.error ? { code: audio.error.code, message: audio.error.message } : null
  };
}
