// Supabase Configuration
// These values are loaded from environment variables (set in .env.local or Netlify)
// Fallback to placeholders if not set
console.log('📋 Loading Supabase Configuration...');

const SUPABASE_URL = typeof window !== 'undefined' && window.__CONFIG__?.SUPABASE_URL 
  ? window.__CONFIG__.SUPABASE_URL
  : 'https://YOUR_SUPABASE_URL.supabase.co';

const SUPABASE_ANON_KEY = typeof window !== 'undefined' && window.__CONFIG__?.SUPABASE_ANON_KEY
  ? window.__CONFIG__.SUPABASE_ANON_KEY
  : 'YOUR_SUPABASE_ANON_KEY';

const ADMIN_PASSWORD = typeof window !== 'undefined' && window.__CONFIG__?.ADMIN_PASSWORD
  ? window.__CONFIG__.ADMIN_PASSWORD
  : 'YourSecureAdminPassword123';

console.log('Supabase URL:', SUPABASE_URL);
console.log('Has API Key:', !!SUPABASE_ANON_KEY);
console.log('Config source:', window.__CONFIG__?.SOURCE || 'fallback');

// Check if credentials are still placeholder values
if (SUPABASE_URL.includes('YOUR_SUPABASE_URL')) {
  console.error('⚠️ Supabase credentials not configured! Update your environment variables.');
}

// Supabase client initialization (using Supabase JavaScript library)
let supabaseClient = null;

if (typeof supabase === 'undefined') {
  console.error('❌ Supabase library not loaded! Check script tag order.');
} else {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✓ Supabase client initialized');
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
  }
}
