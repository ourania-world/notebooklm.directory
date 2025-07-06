/**
 * Utility functions for safely handling window/browser-only code
 * to prevent SSR/hydration issues
 */

/**
 * Safely access window object
 * @returns {Window|null} Window object or null if not available
 */
export const getWindow = () => {
  return typeof window !== 'undefined' ? window : null;
};

/**
 * Safely access document object
 * @returns {Document|null} Document object or null if not available
 */
export const getDocument = () => {
  return typeof document !== 'undefined' ? document : null;
};

/**
 * Safely access navigator object
 * @returns {Navigator|null} Navigator object or null if not available
 */
export const getNavigator = () => {
  return typeof navigator !== 'undefined' ? navigator : null;
};

/**
 * Check if code is running in browser environment
 * @returns {boolean} True if running in browser
 */
export const isBrowser = () => {
  return typeof window !== 'undefined';
};

/**
 * Safely run a function only in browser environment
 * @param {Function} fn Function to run
 * @param {any} fallback Fallback value for SSR
 * @returns {any} Function result or fallback
 */
export const runInBrowser = (fn, fallback = null) => {
  if (isBrowser()) {
    return fn();
  }
  return fallback;
};

/**
 * Safely add event listener that automatically cleans up
 * @param {string} event Event name
 * @param {Function} handler Event handler
 * @param {Element|Window|Document} element Target element (defaults to window)
 * @returns {Function} Cleanup function
 */
export const safeAddEventListener = (event, handler, element = getWindow()) => {
  if (!element) return () => {};
  
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
};