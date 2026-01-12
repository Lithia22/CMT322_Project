// fix-admin.js
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Use your exact credentials from .env
const SUPABASE_URL = 'https://pjjwltjipxgaywcbazyq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqandsdGppcHhnYXl3Y2JhenlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTg3NjQsImV4cCI6MjA4MTQ3NDc2NH0.1Q2B44ECXe-9lhIZiH2wK7vEIZiHMILhvBFlR_4YGvk';

console.log('🔧 Fixing admin user...');
console.log('URL:', SUPABASE_URL);
console.log('Key valid:', SUPABASE_KEY.startsWith('eyJ'));

// Create direct Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixAdmin() {
  try {
    // First, delete any existing admin with null password
    console.log('\n🧹 Checking for existing admin...');
    
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@usm.my');
    
    if (checkError) {
      console.error('❌ Error checking existing:', checkError.message);
      return;
    }
    
    if (existing && existing.length > 0) {
      console.log('Found existing admin:', existing[0].id);
      
      // Delete if password is null
      if (!existing[0].password_hash) {
        console.log('Deleting admin with null password...');
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('email', 'admin@usm.my');
        
        if (deleteError) {
          console.error('Delete error:', deleteError.message);
        } else {
          console.log('✅ Deleted old admin');
        }
      }
    }
    
    // Create new admin
    console.log('\n🛠️ Creating new admin user...');
    
    const password = 'Admin@USM2024';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      name: 'System Administrator',
      email: 'admin@usm.my',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Email:', userData.email);
    console.log('Password:', password);
    console.log('Hash:', hashedPassword.substring(0, 30) + '...');
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert error:', error.message);
      console.log('\n💡 Try using service_role key instead:');
      console.log('1. Go to Supabase → Project Settings → API');
      console.log('2. Click "Reveal" next to service_role');
      console.log('3. Use that key instead');
      return;
    }
    
    console.log('\n🎉 SUCCESS!');
    console.log('✅ Admin created with ID:', data.id);
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('=====================');
    console.log('Email: admin@usm.my');
    console.log('Password: Admin@USM2024');
    console.log('=====================');
    console.log('\n💡 Test login immediately!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

fixAdmin();