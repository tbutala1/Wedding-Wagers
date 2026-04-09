/**
 * Config Injector - Loads environment variables into window.__CONFIG__
 * This file is used to inject sensitive configuration
 * 
 * For GitHub Pages: Set via browser localStorage (see instructions below)
 * For Netlify: Environment variables work if build command is set
 * For Local Dev: Uses .env.local (loaded via build tool or manual setup)
 * 
 * TO SET UP:
 * 1. For local testing, create .env.local in project root
 * 2. For GitHub Pages, use browser console to set:
 *    localStorage.setItem('wedding-wagers-config', JSON.stringify({
 *      SUPABASE_URL: 'https://xxx.supabase.co',
 *      SUPABASE_ANON_KEY: 'your_key',
 *      ADMIN_PASSWORD: 'your_password'
 *    }));
 *    location.reload();
 * 3. For Netlify, set environment variables in dashboard
 */

// Initialize config object
window.__CONFIG__ = window.__CONFIG__ || {};

// Try to load from localStorage first (works everywhere)
const localConfig = localStorage.getItem('wedding-wagers-config');
if (localConfig) {
  try {
    const parsedConfig = JSON.parse(localConfig);
    window.__CONFIG__ = { ...window.__CONFIG__, ...parsedConfig };
    console.log('✓ Config loaded from localStorage');
  } catch (e) {
    console.error('⚠️ Failed to parse config from localStorage:', e);
  }
}

// Try to load from Netlify environment variables (if available)
// Note: This requires a build command in Netlify
if (typeof window !== 'undefined') {
  // Check if this is a Netlify build with injected env vars
  if (window.ENV_SUPABASE_URL) {
    window.__CONFIG__.SUPABASE_URL = window.ENV_SUPABASE_URL;
    window.__CONFIG__.SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY;
    window.__CONFIG__.ADMIN_PASSWORD = window.ENV_ADMIN_PASSWORD;
    console.log('✓ Config loaded from Netlify environment');
  }
}

// Log status (for debugging)
console.group('Wedding Wagers Configuration Status');
const hasAll = window.__CONFIG__.SUPABASE_URL && 
               window.__CONFIG__.SUPABASE_ANON_KEY && 
               window.__CONFIG__.ADMIN_PASSWORD;

console.log('Has SUPABASE_URL:', !!window.__CONFIG__.SUPABASE_URL);
console.log('Has SUPABASE_ANON_KEY:', !!window.__CONFIG__.SUPABASE_ANON_KEY);
console.log('Has ADMIN_PASSWORD:', !!window.__CONFIG__.ADMIN_PASSWORD);
console.log('All configured:', hasAll);
console.groupEnd();

if (!hasAll) {
  console.error('⚠️ CONFIGURATION INCOMPLETE!');
  console.error('For GitHub Pages: Set config in browser console:');
  console.error(`localStorage.setItem('wedding-wagers-config', JSON.stringify({
  SUPABASE_URL: 'https://xxx.supabase.co',
  SUPABASE_ANON_KEY: 'your_anon_key',
  ADMIN_PASSWORD: 'your_password'
})); location.reload();`);
}
