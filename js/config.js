// Supabase Configuration
// These values are loaded from environment variables (set in .env.local or Netlify)
// Fallback to placeholders if not set
const SUPABASE_URL = typeof window !== 'undefined' && window.__CONFIG__?.SUPABASE_URL 
  ? window.__CONFIG__.SUPABASE_URL
  : 'https://YOUR_SUPABASE_URL.supabase.co';

const SUPABASE_ANON_KEY = typeof window !== 'undefined' && window.__CONFIG__?.SUPABASE_ANON_KEY
  ? window.__CONFIG__.SUPABASE_ANON_KEY
  : 'YOUR_SUPABASE_ANON_KEY';

const ADMIN_PASSWORD = typeof window !== 'undefined' && window.__CONFIG__?.ADMIN_PASSWORD
  ? window.__CONFIG__.ADMIN_PASSWORD
  : 'YourSecureAdminPassword123';

// Check if credentials are still placeholder values
if (SUPABASE_URL.includes('YOUR_SUPABASE_URL')) {
  console.error('⚠️ Supabase credentials not configured! Update your environment variables.');
}

// Supabase client initialization (using Supabase JavaScript library)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
