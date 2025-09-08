// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://axxwhwyfsmwjmtcprkxr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eHdod3lmc213am10Y3Bya3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTU4MDEsImV4cCI6MjA3MjkzMTgwMX0.0PWxtI8vM_kOIkd5YuDVuu45-5nEJE-e0shcvDG5EZw'

console.log('🚀 SUPABASE CONFIG LOADED - VERSION 2.0 - DEPLOYMENT TEST');
console.log('Loading Supabase configuration...');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key length:', SUPABASE_ANON_KEY.length);

// Check if Supabase library is loaded
if (typeof window.supabase === 'undefined') {
    console.error('Supabase library not loaded! Make sure the script tag is included.');
} else {
    console.log('Supabase library loaded successfully');
}

// Initialize Supabase client
try {
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('Supabase client created:', supabase);
    
    // Export for use in other files
    window.supabaseClient = supabase;
    console.log('Supabase client exported to window.supabaseClient');
} catch (error) {
    console.error('Error creating Supabase client:', error);
}