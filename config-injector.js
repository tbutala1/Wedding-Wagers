/**
 * Config Injector - Loads configuration into window.__CONFIG__
 * 
 * For Netlify Static Sites: Configuration is stored in localStorage
 * 
 * SETUP INSTRUCTIONS:
 * First time setup - paste in browser console (F12):
 * 
 * localStorage.setItem('wedding-wagers-config', JSON.stringify({
 *   SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
 *   SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',
 *   ADMIN_PASSWORD: 'YOUR_PASSWORD'
 * }));
 * location.reload();
 */

// Initialize config object
window.__CONFIG__ = window.__CONFIG__ || {};

// Load from localStorage (primary source for static sites)
const savedConfig = localStorage.getItem('wedding-wagers-config');
if (savedConfig) {
  try {
    const config = JSON.parse(savedConfig);
    window.__CONFIG__ = { ...window.__CONFIG__, ...config };
    console.log('✓ Config loaded from localStorage');
  } catch (e) {
    console.error('⚠️ Failed to parse stored config:', e);
  }
}

// Log configuration status
console.group('Wedding Wagers Configuration Status');
const hasURL = !!window.__CONFIG__.SUPABASE_URL;
const hasKey = !!window.__CONFIG__.SUPABASE_ANON_KEY;
const hasPassword = !!window.__CONFIG__.ADMIN_PASSWORD;
const isConfigured = hasURL && hasKey && hasPassword;

console.log('✓ SUPABASE_URL:', hasURL ? '✓ Set' : '✗ Missing');
console.log('✓ SUPABASE_ANON_KEY:', hasKey ? '✓ Set' : '✗ Missing');
console.log('✓ ADMIN_PASSWORD:', hasPassword ? '✓ Set' : '✗ Missing');
console.log('Status:', isConfigured ? '✅ Ready to use' : '❌ Incomplete - see instructions below');
console.groupEnd();

if (!isConfigured) {
  console.error('═══════════════════════════════════════════════════════════');
  console.error('⚠️  SETUP REQUIRED - Configuration not found!');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('');
  console.error('First time setup: Paste this in console and press Enter:');
  console.error('');
  console.error(`localStorage.setItem('wedding-wagers-config', JSON.stringify({
  SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY_HERE',
  ADMIN_PASSWORD: 'YOUR_PASSWORD_HERE'
}));`);
  console.error('');
  console.error('Then refresh the page (F5 or Cmd+R)');
  console.error('═══════════════════════════════════════════════════════════');
}
