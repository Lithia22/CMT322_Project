const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

const createFirstAdmin = async () => {
  try {
    console.log('🔍 Checking for existing admin...');
    
    // Check if any admin exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking for admins:', checkError.message);
      return;
    }

    if (existingAdmins && existingAdmins.length === 0) {
      console.log('📝 No admin found. Creating first admin...');
      
      // Default admin credentials (CHANGE THESE!)
      const adminData = {
        name: 'System Administrator',
        email: 'admin@usm.my',
        password: 'admin123', // Change this password!
        phone: '0123456789'
      };

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

      // Create first admin
      const { data: admin, error: createError } = await supabase
        .from('users')
        .insert([{
          name: adminData.name,
          email: adminData.email,
          password_hash: hashedPassword,
          role: 'admin',
          status: 'active',
          phone: adminData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating admin:', createError.message);
        return;
      }
      
      console.log('✅ First admin created successfully!');
      console.log('======================================');
      console.log('📋 Admin Login Credentials:');
      console.log('   Email:', adminData.email);
      console.log('   Password:', adminData.password);
      console.log('======================================');
      console.log('⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    } else {
      console.log('✅ Admin already exists in database');
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createFirstAdmin();
}

module.exports = createFirstAdmin;