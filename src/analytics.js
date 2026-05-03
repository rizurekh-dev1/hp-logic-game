import posthog from 'posthog-js';

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Adapter — THE ONLY FILE that knows about PostHog.
// To swap providers (e.g. Google Analytics 4), change ONLY this file.
// All other files call trackEvent() and are provider-agnostic.
// ─────────────────────────────────────────────────────────────────────────────

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

/**
 * Call once at app startup (inside main.jsx).
 * No-ops safely if the key is missing (e.g. local dev without .env).
 */
export function initAnalytics() {
  if (!POSTHOG_KEY) {
    console.warn('[Analytics] VITE_POSTHOG_KEY not set — analytics disabled.');
    return;
  }
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only', // no PII stored by default
    capture_pageview: false,            // we track screens manually
    autocapture: false,                 // we fire only explicit events
  });
  initialized = true;
}

/**
 * Track a named event with optional properties.
 * Usage: trackEvent('puzzle_solved', { level: 1, time_seconds: 42 })
 */
export function trackEvent(eventName, properties = {}) {
  if (!initialized) return;
  posthog.capture(eventName, properties);
}
