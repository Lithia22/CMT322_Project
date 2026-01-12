const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// ============ AUTH MIDDLEWARE ============
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = { 
      id: decoded.userId, 
      email: decoded.email, 
      role: decoded.role 
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// ============ REGISTER ENDPOINT ============
router.post('/register', async (req, res) => {
  try {
    console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));
    
    const { 
      name, 
      email, 
      password, 
      role = 'student',
      matric_number,
      matricNumber,
      hostel_id,
      room_number,
      roomNumber,
      phone
    } = req.body;

    // Use whichever is provided
    const finalMatricNumber = matric_number || matricNumber;
    const finalRoomNumber = room_number || roomNumber;

    // ============ DEBUG LINES ============
    console.log('========== DEBUG REGISTRATION ==========');
    console.log('hostel_id received:', hostel_id, 'Type:', typeof hostel_id);
    console.log('room_number received:', finalRoomNumber, 'Type:', typeof finalRoomNumber);
    console.log('matric_number received:', finalMatricNumber);
    console.log('phone received:', phone);
    console.log('========================================');

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and password are required' 
      });
    }
    
    // Additional validation for students
    if (role === 'student') {
      if (!finalMatricNumber) {
        return res.status(400).json({ 
          success: false,
          error: 'Matric number is required for students' 
        });
      }
      
      if (!email.endsWith('@student.usm.my')) {
        return res.status(400).json({ 
          success: false,
          error: 'Students must use @student.usm.my email' 
        });
      }
    }
    
    // Validation for admin/maintenance staff
    if (role === 'admin' || role === 'maintenance') {
      if (!email.endsWith('@usm.my')) {
        return res.status(400).json({ 
          success: false,
          error: 'Staff must use @usm.my email' 
        });
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data - FIXED VERSION
    const userData = {
      name,
      email,
      password_hash: hashedPassword,
      role,
      status: 'active',
      matric_number: role === 'student' ? finalMatricNumber : null, 
      hostel_id: (hostel_id !== undefined && hostel_id !== "" && hostel_id !== null) 
        ? parseInt(hostel_id) 
        : null,
      room_number: finalRoomNumber || null,
      phone: phone || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('✅ Prepared userData:', userData);

    // Insert into database
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      // Handle duplicate errors
      if (error.code === '23505') {
        if (error.message.includes('matric_number')) {
          return res.status(400).json({ 
            success: false,
            error: 'This matric number is already registered' 
          });
        }
        if (error.message.includes('email')) {
          return res.status(400).json({ 
            success: false,
            error: 'This email is already registered' 
          });
        }
      }
      throw error;
    }

    // Create token
    const token = jwt.sign(
      { userId: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = data;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ LOGIN ENDPOINT ============
router.post('/login', async (req, res) => {
  console.log('='.repeat(60));
  console.log('🔐 LOGIN REQUEST RECEIVED AT:', new Date().toISOString());
  console.log('='.repeat(60));
  
  try {
    const { email, password } = req.body;
    
    console.log('📧 Email provided:', email);
    console.log('🔑 Password provided:', password ? '*** (length: ' + password.length + ')' : 'None');
    
    // 1. Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }
    
    // 2. Clean and normalize email
    const cleanEmail = email.trim().toLowerCase();
    console.log('🧹 Cleaned email:', cleanEmail);
    
    // 3. Find user - try multiple methods
    let user = null;
    
    // Method 1: Exact match
    console.log('🔍 Method 1: Exact email match...');
    let { data: exactUser, error: exactError } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();
    
    if (exactUser) {
      console.log('✅ Found with exact match:', exactUser.email);
      user = exactUser;
    } else {
      console.log('❌ Exact match failed:', exactError?.message);
      
      // Method 2: Case-insensitive
      console.log('🔍 Method 2: Case-insensitive search...');
      let { data: ciUser, error: ciError } = await supabase
        .from('users')
        .select('*')
        .ilike('email', `%${cleanEmail}%`)
        .single();
      
      if (ciUser) {
        console.log('✅ Found with case-insensitive:', ciUser.email);
        user = ciUser;
      } else {
        console.log('❌ Case-insensitive failed:', ciError?.message);
        
        // Method 3: Try admin@usm.my specifically
        console.log('🔍 Method 3: Trying admin@usm.my specifically...');
        let { data: adminUser, error: adminError } = await supabase
          .from('users')
          .select('*')
          .ilike('email', '%admin%usm.my%')
          .single();
        
        if (adminUser) {
          console.log('✅ Found admin user:', adminUser.email);
          user = adminUser;
        } else {
          console.log('❌ No admin user found');
        }
      }
    }
    
    // 4. If no user found, show all available users
    if (!user) {
      console.log('📋 Listing ALL available users for debugging:');
      const { data: allUsers } = await supabase
        .from('users')
        .select('email, role, status')
        .order('email');
      
      if (allUsers && allUsers.length > 0) {
        console.log('Available users:');
        allUsers.forEach(u => {
          console.log(`   - ${u.email} (${u.role}, ${u.status})`);
        });
      } else {
        console.log('⚠️  No users found in database at all!');
      }
      
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password - User not found'
      });
    }
    
    console.log('✅ USER FOUND IN DATABASE:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log('   Has password_hash?', !!user.password_hash);
    console.log('   Hash exists?', user.password_hash ? 'Yes' : 'No');
    
    // 5. Check if password_hash exists
    if (!user.password_hash) {
      console.log('❌ USER HAS NO PASSWORD HASH! Creating one now...');
      
      // Create a hash for the provided password
      const newHash = await bcrypt.hash(password, 10);
      console.log('   Created new hash:', newHash.substring(0, 20) + '...');
      
      // Update user with hash
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password_hash: newHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('   Failed to update hash:', updateError);
      } else {
        console.log('   ✅ Hash saved to database');
        user.password_hash = newHash;
      }
    }
    
    // 6. Verify password
    console.log('🔑 Verifying password...');
    console.log('   Input password (first 3 chars):', password.substring(0, 3) + '...');
    console.log('   Stored hash (first 20 chars):', user.password_hash.substring(0, 20) + '...');
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('   Password match result:', validPassword ? '✅ CORRECT' : '❌ INCORRECT');
    
    if (!validPassword) {
      console.log('💡 TIP: Try these common passwords:');
      console.log('   - Admin123!');
      console.log('   - admin123');
      console.log('   - password');
      console.log('   - 123456');
      
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // 7. Check status
    if (user.status !== 'active') {
      console.log('⚠️  User not active. Status:', user.status);
      return res.status(403).json({
        success: false,
        error: 'Account is not active. Please contact administrator.'
      });
    }
    
    // 8. Create JWT token
    console.log('🎫 Creating JWT token...');
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-for-development',
      { expiresIn: '7d' }
    );
    
    console.log('✅ TOKEN CREATED (length):', token.length);
    
    // 9. Prepare response
    const { password_hash, ...userWithoutPassword } = user;
    
    console.log('='.repeat(60));
    console.log('🎉 LOGIN SUCCESSFUL!');
    console.log('   User:', user.email);
    console.log('   Role:', user.role);
    console.log('   Token:', token.substring(0, 20) + '...');
    console.log('='.repeat(60));
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('🚨 UNEXPECTED ERROR:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    console.log('='.repeat(60));
    
    res.status(500).json({
      success: false, 
      error: 'Server error: ' + error.message
    });
  }
});

// ============ PROFILE ENDPOINTS ============

// GET /api/auth/profile - Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log('📋 GET Profile request for user ID:', req.user.id);
    
    // Fetch user from database with hostel details
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        hostels:hostel_id (name, phone, location)
      `)
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, specialty, hostel_id, room_number } = req.body;
    console.log('✏️ PUT Profile update for user:', req.user.id, req.body);
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (specialty !== undefined) updateData.specialty = specialty;
    if (hostel_id !== undefined) updateData.hostel_id = parseInt(hostel_id);
    if (room_number !== undefined) updateData.room_number = room_number;
    updateData.updated_at = new Date().toISOString();
    
    // Update user in database
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile: ' + error.message
    });
  }
});

// ============ GET FACILITY TYPES ENDPOINT ============
router.get('/facility-types', authMiddleware, async (req, res) => {
  try {
    console.log('🔧 Fetching facility types...');
    
    const { data: facilityTypes, error } = await supabase
      .from('facility_types')
      .select('id, name, created_at')
      .order('name', { ascending: true });

    if (error) {
      console.error('Get facility types error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch facility types: ' + error.message 
      });
    }

    console.log(`✅ Found ${facilityTypes?.length || 0} facility types`);
    
    res.json({
      success: true,
      facility_types: facilityTypes || []
    });

  } catch (error) {
    console.error('Get facility types error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ GET ALL STAFF WITH SPECIALTIES ============
router.get('/staff', authMiddleware, async (req, res) => {
  try {
    // Only admins can view all staff
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }
    
    const { data: staff, error } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        email, 
        phone, 
        specialty, 
        status, 
        created_at,
        updated_at,
        maintenance_specialties (
          facility_type_id,
          facility_types (id, name)
        )
      `)
      .eq('role', 'maintenance')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data
    const transformedStaff = (staff || []).map(staffMember => ({
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      specialty: staffMember.specialty,
      status: staffMember.status,
      created_at: staffMember.created_at,
      facility_types: staffMember.maintenance_specialties?.map(ms => 
        ms.facility_types?.name
      ).filter(Boolean) || [],
      facility_type_ids: staffMember.maintenance_specialties?.map(ms => 
        ms.facility_type_id
      ).filter(Boolean) || []
    }));

    res.json({
      success: true,
      staff: transformedStaff
    });

  } catch (error) {
    console.error('Get staff error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ REGISTER STAFF ENDPOINT ============
router.post('/register-staff', authMiddleware, async (req, res) => {
  try {
    // Only admins can register staff
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }
    
    const { 
      name, 
      email, 
      password, 
      phone,
      specialty,
      facility_type_ids
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and password are required' 
      });
    }
    
    if (!email.endsWith('@usm.my')) {
      return res.status(400).json({ 
        success: false,
        error: 'Staff must use @usm.my email' 
      });
    }
    
    if (!phone) {
      return res.status(400).json({ 
        success: false,
        error: 'Phone number is required' 
      });
    }
    
    if (!facility_type_ids || !Array.isArray(facility_type_ids) || facility_type_ids.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'At least one facility type must be selected' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff user - ONLY include fields that exist and are needed
    const staffData = {
      name,
      email,
      password_hash: hashedPassword,
      role: 'maintenance',
      status: 'active',
      phone,
      specialty: specialty || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
      // DO NOT include matrics_num, hostel_id, room_num for staff
    };

    // Insert into users table
    const { data: newStaff, error: userError } = await supabase
      .from('users')
      .insert([staffData])
      .select('id, name, email, phone, specialty, role, status, created_at')
      .single();

    if (userError) {
      if (userError.code === '23505') { // Unique violation
        return res.status(400).json({ 
          success: false,
          error: 'This email is already registered' 
        });
      }
      throw userError;
    }

    // Insert into maintenance_specialties table
    const maintenanceSpecialtiesData = facility_type_ids.map(facility_type_id => ({
      maintenance_id: newStaff.id,
      facility_type_id: facility_type_id,
      created_at: new Date().toISOString()
    }));

    const { error: specialtiesError } = await supabase
      .from('maintenance_specialties')
      .insert(maintenanceSpecialtiesData);

    if (specialtiesError) {
      throw specialtiesError;
    }

    // Get complete staff data with their specialties
    const { data: completeStaff } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        email, 
        phone, 
        specialty, 
        status, 
        created_at,
        maintenance_specialties (
          facility_type_id,
          facility_types (id, name)
        )
      `)
      .eq('id', newStaff.id)
      .single();

    // Transform the response
    const transformedStaff = {
      id: newStaff.id,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      specialty: newStaff.specialty,
      status: newStaff.status,
      created_at: newStaff.created_at,
      facility_types: completeStaff?.maintenance_specialties?.map(ms => 
        ms.facility_types?.name
      ).filter(Boolean) || [],
      facility_type_ids: facility_type_ids
    };

    res.status(201).json({
      success: true,
      message: 'Staff member registered successfully',
      staff: transformedStaff
    });

  } catch (error) {
    console.error('Staff registration error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to register staff member'
    });
  }
});

// ============ DELETE STAFF ENDPOINT ============
router.delete('/staff/:id', authMiddleware, async (req, res) => {
  try {
    // Only admins can delete staff
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }
    
    const staffId = req.params.id;
    
    // Check if staff exists and is maintenance role
    const { data: staff, error: fetchError } = await supabase
      .from('users')
      .select('id, role, name')
      .eq('id', staffId)
      .single();
    
    if (fetchError || !staff) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }
    
    if (staff.role !== 'maintenance') {
      return res.status(400).json({
        success: false,
        error: 'Can only delete maintenance staff'
      });
    }
    
    // Check if staff has assigned complaints
    const { data: assignedComplaints, error: complaintsError } = await supabase
      .from('complaints')
      .select('id, status')
      .eq('assigned_maintenance', staffId)
      .in('status', ['pending', 'in_progress']);
    
    if (complaintsError) throw complaintsError;
    
    if (assignedComplaints && assignedComplaints.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete staff with ${assignedComplaints.length} pending/in-progress complaints`
      });
    }
    
    // Delete from maintenance_specialties first (foreign key constraint)
    const { error: deleteSpecialtiesError } = await supabase
      .from('maintenance_specialties')
      .delete()
      .eq('maintenance_id', staffId);
    
    if (deleteSpecialtiesError) throw deleteSpecialtiesError;
    
    // Then delete the user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', staffId);
    
    if (deleteError) throw deleteError;
    
    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete staff error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;