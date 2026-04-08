/**
 * Config Injector - Loads environment variables into window.__CONFIG__
 * This file is used to inject sensitive configuration from Netlify environment variables
 * 
 * Usage: Add a script tag in your HTML before config.js:
 * <script src="config-injector.js"></script>
 */

// Initialize config object
window.__CONFIG__ = window.__CONFIG__ || {};

// Try to load from environment variables (works in Netlify)
// These would be set in Netlify's Build & Deploy > Environment settings
if (typeof process !== 'undefined' && process.env) {
  window.__CONFIG__.SUPABASE_URL = process.env.SUPABASE_URL;
  window.__CONFIG__.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  window.__CONFIG__.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
}

// For local development, try to load from localStorage
// (Users can set via browser console for testing)
const localConfig = localStorage.getItem('wedding-wagers-config');
if (localConfig) {
  try {
    const parsedConfig = JSON.parse(localConfig);
    window.__CONFIG__ = { ...window.__CONFIG__, ...parsedConfig };
  } catch (e) {
    console.warn('Failed to parse local config from localStorage');
  }
}

// Log status (for debugging)
const hasAllConfig = window.__CONFIG__.SUPABASE_URL && 
                     window.__CONFIG__.SUPABASE_ANON_KEY && 
                     window.__CONFIG__.ADMIN_PASSWORD;

if (!hasAllConfig) {
  console.warn('⚠️  Some configuration missing. Please set environment variables in Netlify or .env.local');
}
