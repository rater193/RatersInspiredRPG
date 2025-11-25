/**
 * Helper utility functions
 */

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format time as Day X • HH:MM
 */
export function formatGameTime(minutes) {
  const day = Math.floor(minutes / 1440) + 1;
  const hourInDay = Math.floor((minutes % 1440) / 60);
  const minute = minutes % 60;
  const hh = String(hourInDay).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `Day ${day} • ${hh}:${mm}`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate damage with some randomness
 */
export function calculateDamage(base, variance = 0.2) {
  const min = Math.floor(base * (1 - variance));
  const max = Math.ceil(base * (1 + variance));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if a random event occurs based on chance (0-1)
 */
export function chance(probability) {
  return Math.random() < probability;
}

/**
 * Deep clone an object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
