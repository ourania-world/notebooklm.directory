import { supabase } from './supabase';

/**
 * Track a user event
 * @param {string} userId - The user ID
 * @param {string} eventType - The type of event (e.g., 'page_view', 'notebook_view', 'search')
 * @param {Object} eventData - Additional data for the event
 */
export async function trackEvent(userId, eventType, eventData = {}) {
  try {
    if (!userId) {
      console.warn('No user ID provided for event tracking');
      return;
    }

    // Track event via Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    await fetch(`${supabaseUrl}/functions/v1/track-user-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        userId,
        eventType,
        eventData,
        notebookId: eventData.notebook_id
      })
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track a page view
 * @param {string} userId - The user ID
 * @param {string} path - The page path
 * @param {Object} additionalData - Additional data for the event
 */
export async function trackPageView(userId, path, additionalData = {}) {
  if (!userId || !path) return;
  
  await trackEvent(userId, 'page_view', {
    path,
    referrer: document.referrer,
    ...additionalData
  });
}

/**
 * Track a notebook view
 * @param {string} userId - The user ID
 * @param {string} notebookId - The notebook ID
 */
export async function trackNotebookView(userId, notebookId) {
  if (!userId || !notebookId) return;
  
  await trackEvent(userId, 'notebook_view', {
    notebook_id: notebookId
  });
}

/**
 * Track a search query
 * @param {string} userId - The user ID
 * @param {string} query - The search query
 * @param {Object} additionalData - Additional data for the event
 */
export async function trackSearch(userId, query, additionalData = {}) {
  if (!query) return;
  
  try {
    // Track directly in the database for faster analytics
    const { error } = await supabase
      .from('search_analytics')
      .insert({
        query,
        user_id: userId || null,
        category: additionalData.category,
        results_count: additionalData.resultsCount
      });
      
    if (error) throw error;
    
    // Also track as a general event
    if (userId) {
      await trackEvent(userId, 'search', {
        query,
        ...additionalData
      });
    }
  } catch (error) {
    console.error('Error tracking search:', error);
  }
}

/**
 * Track audio playback
 * @param {string} userId - The user ID
 * @param {string} notebookId - The notebook ID
 * @param {number} duration - The duration played in seconds
 * @param {boolean} completed - Whether the audio was played to completion
 */
export async function trackAudioPlay(userId, notebookId, duration, completed = false) {
  if (!userId || !notebookId) return;
  
  await trackEvent(userId, 'audio_play', {
    notebook_id: notebookId,
    duration,
    completed
  });
}

/**
 * Track a subscription event
 * @param {string} userId - The user ID
 * @param {string} action - The subscription action (e.g., 'subscribe', 'cancel', 'upgrade')
 * @param {string} planId - The plan ID
 */
export async function trackSubscriptionEvent(userId, action, planId) {
  if (!userId) return;
  
  await trackEvent(userId, 'subscription', {
    action,
    plan_id: planId
  });
}

/**
 * Get user analytics
 * @param {string} userId - The user ID
 * @param {string} timeframe - The timeframe (e.g., '7d', '30d', '90d')
 */
export async function getUserAnalytics(userId, timeframe = '30d') {
  if (!userId) return null;
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-analytics-report?type=user&timeframe=${timeframe}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return null;
  }
}