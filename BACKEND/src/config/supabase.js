const { createClient } = require("@supabase/supabase-js");

// We'll use environment variables (safe way)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️  Supabase credentials not found in .env file");
  console.warn("   Using mock mode for testing");
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null; // Will be null if no credentials

module.exports = supabase;
