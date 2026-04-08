// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://lspdvccaaozetfhwywyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcGR2Y2NhYW96ZXRmaHd5d3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODM2NDEsImV4cCI6MjA5MTI1OTY0MX0.b-N7zjsFfmu09EiRZIBuzd3wOyvHDX-KR0eiSMui9Ek';
const ADMIN_PASSWORD = 'Stevie'; // Change this to a secure password

// Supabase client initialization (using Supabase JavaScript library)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
