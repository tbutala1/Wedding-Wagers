// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const ADMIN_PASSWORD = 'YourSecureAdminPassword123'; // Change this to a secure password

// Supabase client initialization (using Supabase JavaScript library)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
