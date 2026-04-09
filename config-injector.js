/**
 * Config Injector - Loads configuration into window.__CONFIG__
 * 
 * Loading priority (first one wins):
 * 1. config-env.js (created by Netlify build - environment variables injected)
 * 2. localStorage (manual setup via browser console)
 * 3. Placeholder values (shows configuration incomplete warning)
 */

// Initialize config object if not already set by config-env.js
if (!window.__CONFIG__) {
  window.__CONFIG__ = {};
}

console.log('📋 Config Injector: Checking configuration sources...');

// Try to load from localStorage as fallback
const localConfig = localStorage.getItem('wedding-wagers-config');
if (localConfig && !window.__CONFIG__.SUPABASE_URL) {
  try {
    const parsedConfig = JSON.parse(localConfig);
    window.__CONFIG__ = { ...window.__CONFIG__, ...parsedConfig };
    console.log('✓ Config loaded from localStorage');
  } catch (e) {
    console.error('⚠️ Failed to parse config from localStorage:', e);
  }
}

// Log configuration status
console.group('🔐 Wedding Wagers Configuration Status');
const hasURL = !!window.__CONFIG__.SUPABASE_URL;
const hasKey = !!window.__CONFIG__.SUPABASE_ANON_KEY;
const hasPassword = !!window.__CONFIG__.ADMIN_PASSWORD;
const isConfigured = hasURL && hasKey && hasPassword;
const source = window.__CONFIG__.SOURCE || 'unknown';

console.log('Configuration Source:', source);
console.log('Has SUPABASE_URL:', hasURL ? '✓' : '✗');
console.log('Has SUPABASE_ANON_KEY:', hasKey ? '✓' : '✗');
console.log('Has ADMIN_PASSWORD:', hasPassword ? '✓' : '✗');
console.log('Status:', isConfigured ? '✅ READY' : '❌ INCOMPLETE');
console.groupEnd();

if (!isConfigured) {
  console.error('\n═══════════════════════════════════════════════════════════');
  console.error('⚠️  CONFIGURATION INCOMPLETE!');
  console.error('═══════════════════════════════════════════════════════════\n');
  console.error('NETLIFY SETUP:');
  console.error('• Go to Netlify Dashboard → Site Settings');
  console.error('• Build & deploy → Environment');
  console.error('• Add these variables:');
  console.error('  - SUPABASE_URL: https://xxx.supabase.co');
  console.error('  - SUPABASE_ANON_KEY: your_anon_key');
  console.error('  - ADMIN_PASSWORD: your_password');
  console.error('• Trigger a redeploy\n');
  console.error('LOCAL SETUP (if needed):');
  console.error('localStorage.setItem(\'wedding-wagers-config\', JSON.stringify({');
  console.error('  SUPABASE_URL: \'https://xxx.supabase.co\',');
  console.error('  SUPABASE_ANON_KEY: \'your_key\',');
  console.error('  ADMIN_PASSWORD: \'your_password\'');
  console.error('}));');
  console.error('location.reload();');
  console.error('\n═══════════════════════════════════════════════════════════\n');
}
