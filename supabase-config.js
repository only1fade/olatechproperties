// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://axxwhwyfsmwjmtcprkxr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eHdod3lmc213am10Y3Bya3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTU4MDEsImV4cCI6MjA3MjkzMTgwMX0.0PWxtI8vM_kOIkd5YuDVuu45-5nEJE-e0shcvDG5EZw'

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Export for use in other files
window.supabaseClient = supabase