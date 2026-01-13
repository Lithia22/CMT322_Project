const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

// ============ AUTH MIDDLEWARE ============
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 Auth token received for complaints');

    // 1. VERIFY THE JWT TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. USE THE USER ID FROM THE DECODED TOKEN
    const userId = decoded.userId;

    console.log('✅ Decoded token for user ID:', userId);

    // 3. GET THE FULL USER FROM DATABASE USING THE ID
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, name, matric_number, hostel_id, room_number')
      .eq('id', userId)
      .single();

    if (error || !user) {
      console.error('User not found in database for ID:', userId, error);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // 4. ATTACH THE REAL USER TO THE REQUEST
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      matricNumber: user.matric_number,
      hostelId: user.hostel_id,
      roomNumber: user.room_number,
    };

    console.log('✅ Authenticated user:', req.user.id, req.user.name);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }

    res.status(401).json({
      success: false,
      error: 'Authentication failed: ' + error.message,
    });
  }
};

// ============ GET ALL COMPLAINTS (ADMIN/MAINTENANCE/STUDENT) ============
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;

    console.log(
      `📋 Fetching complaints for user: ${req.user.name}, Role: ${role}`
    );

    let query = supabase
      .from('complaints')
      .select(
        `
        *,
        facility_types!facility_type_id (id, name),
        hotels!hostel_id (id, name, location),
        students:student_id (id, name, email, phone, matric_number),
        assigned_maintenance:assigned_maintenance_id (id, name, email, phone, specialty)
      `
      )
      .order('submitted_at', { ascending: false });

    // Filter based on user role
    if (role === 'student') {
      query = query.eq('student_id', id);
    } else if (role === 'maintenance') {
      query = query.eq('assigned_maintenance_id', id);
    }
    // Admin sees all

    const { data: complaints, error } = await query;

    if (error) throw error;

    // Transform the data to match frontend expectations
    const transformedComplaints = (complaints || []).map(complaint => ({
      id: complaint.id,
      student_id: complaint.student_id,
      student_name: complaint.students?.name,
      student_email: complaint.students?.email,
      student_phone: complaint.students?.phone,
      hostel_id: complaint.hostel_id,
      hostel_name: complaint.hostels?.name,
      hostel_location: complaint.hostels?.location,
      room_number: complaint.room_number,
      facility_type_id: complaint.facility_type_id,
      facility_type: complaint.facility_types?.name,
      issue_description: complaint.issue_description,
      photo_url: complaint.photo_url,
      status: complaint.status,
      priority: complaint.priority,
      assigned_maintenance_id: complaint.assigned_maintenance_id,
      assigned_maintenance: complaint.assigned_maintenance?.name,
      assigned_maintenance_email: complaint.assigned_maintenance?.email,
      assigned_maintenance_phone: complaint.assigned_maintenance?.phone,
      admin_remarks: complaint.admin_remarks,
      maintenance_remarks: complaint.maintenance_remarks,
      resolution_date: complaint.resolution_date,
      submitted_at: complaint.submitted_at,
      submitted_date: complaint.submitted_at
        ? new Date(complaint.submitted_at).toLocaleDateString('en-MY')
        : 'N/A',
      updated_at: complaint.updated_at,
    }));

    console.log(`✅ Found ${transformedComplaints.length} complaints`);

    res.json({
      success: true,
      complaints: transformedComplaints,
    });
  } catch (error) {
    console.error('Get all complaints error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ GET USER'S COMPLAINTS (STUDENT SPECIFIC) ============
router.get('/my-complaints', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📋 Fetching complaints for user ID:', userId);

    const { data: complaints, error } = await supabase
      .from('complaints')
      .select(
        `
        *,
        facility_types:facility_type_id (id, name),
        assigned_maintenance:assigned_maintenance_id (id, name, email, phone, specialty)
      `
      )
      .eq('student_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    console.log(`✅ Found ${complaints?.length || 0} complaints`);

    // Transform the data - ADD ALL IMPORTANT FIELDS
    const transformedComplaints = (complaints || []).map(complaint => ({
      id: complaint.id,
      student_id: complaint.student_id,
      hostel_id: complaint.hostel_id,
      room_number: complaint.room_number,
      facility_type_id: complaint.facility_type_id,
      facility_type: complaint.facility_types?.name,
      issue_description: complaint.issue_description,
      photo_url: complaint.photo_url,
      status: complaint.status,
      priority: complaint.priority,
      assigned_maintenance_id: complaint.assigned_maintenance_id,
      assigned_maintenance: complaint.assigned_maintenance?.name,
      assigned_maintenance_phone: complaint.assigned_maintenance?.phone,
      assigned_maintenance_email: complaint.assigned_maintenance?.email,
      assigned_maintenance_specialty: complaint.assigned_maintenance?.specialty,
      admin_remarks: complaint.admin_remarks,
      maintenance_remarks: complaint.maintenance_remarks, // ADD THIS LINE
      resolution_date: complaint.resolution_date, // ADD THIS LINE
      submitted_at: complaint.submitted_at,
      submitted_date: complaint.submitted_at
        ? new Date(complaint.submitted_at).toLocaleDateString('en-MY')
        : 'N/A',
      updated_at: complaint.updated_at,
    }));

    console.log(
      'Sample complaint with remarks:',
      transformedComplaints[0]?.maintenance_remarks
    );

    res.json({ success: true, complaints: transformedComplaints });
  } catch (error) {
    console.error('Get complaints error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ GET RECOMMENDED STAFF FOR COMPLAINT ============
router.get('/:id/recommended-staff', authMiddleware, async (req, res) => {
  try {
    // Only admins can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }

    const complaintId = req.params.id;

    console.log(`🔍 Getting recommended staff for complaint: ${complaintId}`);

    // Get complaint with facility type
    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .select('facility_type_id')
      .eq('id', complaintId)
      .single();

    if (complaintError || !complaint) {
      console.error('Complaint not found:', complaintError);
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    const facilityTypeId = complaint.facility_type_id;
    console.log(`Facility type ID for complaint: ${facilityTypeId}`);

    // Get all active maintenance staff with their specialties
    const { data: allStaff, error: staffError } = await supabase
      .from('users')
      .select(
        `
        id,
        name,
        email,
        phone,
        specialty,
        status,
        maintenance_specialties (
          facility_type_id,
          facility_types (id, name)
        )
      `
      )
      .eq('role', 'maintenance')
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (staffError) throw staffError;

    console.log(`Found ${allStaff?.length || 0} maintenance staff`);

    // Filter staff who have this facility type as specialty
    const qualifiedStaff = (allStaff || []).filter(staff => {
      const hasSpecialty = staff.maintenance_specialties?.some(
        ms => ms.facility_type_id === facilityTypeId
      );
      return hasSpecialty;
    });

    console.log(
      `Found ${qualifiedStaff.length} qualified staff for facility type ${facilityTypeId}`
    );

    // Get current workload for each qualified staff
    const staffWithWorkload = await Promise.all(
      qualifiedStaff.map(async staff => {
        // Count active complaints assigned to this staff
        const { count, error: countError } = await supabase
          .from('complaints')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_maintenance_id', staff.id)
          .in('status', ['pending', 'in_progress']);

        const assignedCount = countError ? 0 : count;

        // Extract facility type names
        const facilityTypes = (staff.maintenance_specialties || [])
          .map(ms => ms?.facility_types?.name)
          .filter(name => name);

        return {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          specialty: staff.specialty,
          status: staff.status,
          facility_types: facilityTypes,
          assigned_count: assignedCount,
        };
      })
    );

    // Sort by workload (fewest tasks first)
    staffWithWorkload.sort((a, b) => a.assigned_count - b.assigned_count);

    res.json({
      success: true,
      recommended_staff: staffWithWorkload,
      facility_type_id: facilityTypeId,
    });
  } catch (error) {
    console.error('Get recommended staff error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ ASSIGN COMPLAINT TO STAFF ============
router.patch('/:id/assign', authMiddleware, async (req, res) => {
  try {
    // Only admins can assign complaints
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }

    const complaintId = req.params.id;
    const { assigned_maintenance_id } = req.body;

    console.log(
      `Assigning complaint ${complaintId} to staff ${assigned_maintenance_id}`
    );

    if (!assigned_maintenance_id) {
      return res.status(400).json({
        success: false,
        error: 'Staff ID is required for assignment',
      });
    }

    // Verify staff exists and is maintenance
    const { data: staff, error: staffError } = await supabase
      .from('users')
      .select('id, name, role, status')
      .eq('id', assigned_maintenance_id)
      .eq('role', 'maintenance')
      .single();

    if (staffError || !staff) {
      return res.status(404).json({
        success: false,
        error: 'Maintenance staff not found',
      });
    }

    if (staff.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Cannot assign to inactive staff',
      });
    }

    // Update the complaint
    const { data: updatedComplaint, error: updateError } = await supabase
      .from('complaints')
      .update({
        assigned_maintenance_id: assigned_maintenance_id,
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', complaintId)
      .select(
        `
        *,
        facility_types!facility_type_id (id, name),
        hotels!hostel_id (id, name, location),
        students:student_id (id, name, email, phone),
        assigned_maintenance:assigned_maintenance_id (id, name, email, phone)
      `
      )
      .single();

    if (updateError) throw updateError;

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    // Transform response
    const transformedComplaint = {
      id: updatedComplaint.id,
      student_name: updatedComplaint.students?.name,
      student_email: updatedComplaint.students?.email,
      student_phone: updatedComplaint.students?.phone,
      hostel_name: updatedComplaint.hostels?.name,
      hostel_location: updatedComplaint.hostels?.location,
      room_number: updatedComplaint.room_number,
      facility_type: updatedComplaint.facility_types?.name,
      issue_description: updatedComplaint.issue_description,
      photo_url: updatedComplaint.photo_url,
      status: updatedComplaint.status,
      priority: updatedComplaint.priority,
      assigned_maintenance_id: updatedComplaint.assigned_maintenance_id,
      assigned_maintenance: updatedComplaint.assigned_maintenance?.name,
      assigned_maintenance_email: updatedComplaint.assigned_maintenance?.email,
      assigned_maintenance_phone: updatedComplaint.assigned_maintenance?.phone,
      submitted_date: updatedComplaint.submitted_at
        ? new Date(updatedComplaint.submitted_at).toLocaleDateString('en-MY')
        : 'N/A',
    };

    console.log(`✅ Complaint ${complaintId} assigned to ${staff.name}`);

    res.json({
      success: true,
      message: `Complaint assigned to ${staff.name}`,
      complaint: transformedComplaint,
    });
  } catch (error) {
    console.error('Assign complaint error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ CREATE COMPLAINT ============
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { issue_description, facility_type_id, photo_url, priority } =
      req.body;

    console.log(
      '📝 Creating complaint for user:',
      req.user.name,
      'ID:',
      userId
    );
    console.log('📝 User hostel_id:', req.user.hostelId);
    console.log('📝 User room_number:', req.user.roomNumber);
    console.log('📝 Request body:', req.body);
    console.log('📝 Facility type ID from request:', facility_type_id);

    if (!issue_description) {
      return res.status(400).json({
        success: false,
        error: 'Issue description is required',
      });
    }

    // Validate facility_type_id or use default
    const finalFacilityTypeId = parseInt(facility_type_id) || 8; // Default to "Others" (ID 8)

    // === USE THE REAL USER DATA FROM AUTHENTICATION ===
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert([
        {
          student_id: userId,
          hostel_id: req.user.hostelId || 1, // Use authenticated user's hostel_id
          room_number: req.user.roomNumber || 'Not specified', // Use authenticated user's room_number
          facility_type_id: finalFacilityTypeId, // Use the facility_type_id from request
          issue_description: issue_description,
          photo_url: photo_url || null,
          priority: priority || 'medium',
          status: 'pending',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select(
        `
        *,
        facility_types:facility_type_id (id, name)
      `
      )
      .single();

    if (error) throw error;

    console.log('✅ Complaint saved successfully!');
    console.log('   Complaint ID:', complaint.id);
    console.log('   Hostel ID:', req.user.hostelId);
    console.log('   Room Number:', req.user.roomNumber);
    console.log('   Facility Type ID:', finalFacilityTypeId);
    console.log('   Facility Type Name:', complaint.facility_types?.name);

    // Transform the response to include all fields
    const transformedComplaint = {
      id: complaint.id,
      student_id: complaint.student_id,
      hostel_id: complaint.hostel_id,
      room_number: complaint.room_number,
      facility_type_id: complaint.facility_type_id,
      facility_type: complaint.facility_types?.name,
      issue_description: complaint.issue_description,
      photo_url: complaint.photo_url,
      status: complaint.status,
      priority: complaint.priority,
      assigned_maintenance_id: complaint.assigned_maintenance_id,
      admin_remarks: complaint.admin_remarks,
      maintenance_remarks: complaint.maintenance_remarks,
      resolution_date: complaint.resolution_date,
      submitted_at: complaint.submitted_at,
      submitted_date: complaint.submitted_at
        ? new Date(complaint.submitted_at).toLocaleDateString('en-MY')
        : 'N/A',
      updated_at: complaint.updated_at,
    };

    res.status(201).json({ success: true, complaint: transformedComplaint });
  } catch (error) {
    console.error('Create complaint error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ RESOLVE COMPLAINT ============
router.patch('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;
    const complaintId = req.params.id;
    const { maintenance_remarks } = req.body;

    console.log(`Resolving complaint ${complaintId} by user ${id}`);

    // Check if user has permission
    if (role !== 'maintenance' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Maintenance or admin access required',
      });
    }

    // If maintenance staff, verify they are assigned to this complaint
    if (role === 'maintenance') {
      const { data: complaint, error: checkError } = await supabase
        .from('complaints')
        .select('assigned_maintenance_id')
        .eq('id', complaintId)
        .single();

      if (checkError || !complaint) {
        return res.status(404).json({
          success: false,
          error: 'Complaint not found',
        });
      }

      if (complaint.assigned_maintenance_id !== id) {
        return res.status(403).json({
          success: false,
          error: 'You are not assigned to this complaint',
        });
      }
    }

    // Update complaint as resolved
    const { data: updatedComplaint, error: updateError } = await supabase
      .from('complaints')
      .update({
        status: 'resolved',
        maintenance_remarks: maintenance_remarks || null,
        resolution_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', complaintId)
      .select(
        `
        *,
        facility_types!facility_type_id (id, name),
        hotels!hostel_id (id, name, location),
        students:student_id (id, name, email, phone),
        assigned_maintenance:assigned_maintenance_id (id, name, email, phone)
      `
      )
      .single();

    if (updateError) throw updateError;

    // Transform response
    const transformedComplaint = {
      id: updatedComplaint.id,
      student_name: updatedComplaint.students?.name,
      student_email: updatedComplaint.students?.email,
      student_phone: updatedComplaint.students?.phone,
      hostel_name: updatedComplaint.hostels?.name,
      hostel_location: updatedComplaint.hostels?.location,
      room_number: updatedComplaint.room_number,
      facility_type: updatedComplaint.facility_types?.name,
      issue_description: updatedComplaint.issue_description,
      photo_url: updatedComplaint.photo_url,
      status: updatedComplaint.status,
      priority: updatedComplaint.priority,
      assigned_maintenance_id: updatedComplaint.assigned_maintenance_id,
      assigned_maintenance: updatedComplaint.assigned_maintenance?.name,
      assigned_maintenance_email: updatedComplaint.assigned_maintenance?.email,
      assigned_maintenance_phone: updatedComplaint.assigned_maintenance?.phone,
      maintenance_remarks: updatedComplaint.maintenance_remarks,
      resolution_date: updatedComplaint.resolution_date,
      submitted_date: updatedComplaint.submitted_at
        ? new Date(updatedComplaint.submitted_at).toLocaleDateString('en-MY')
        : 'N/A',
      updated_at: updatedComplaint.updated_at,
    };

    console.log(`✅ Complaint ${complaintId} marked as resolved`);

    res.json({
      success: true,
      message: 'Complaint resolved successfully',
      complaint: transformedComplaint,
    });
  } catch (error) {
    console.error('Resolve complaint error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ UPDATE COMPLAINT STATUS (GENERAL) ============
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;
    const complaintId = req.params.id;
    const { status, maintenance_remarks } = req.body;

    console.log(`📝 Updating complaint ${complaintId} by user ${id}`);
    console.log('Update data:', { status, maintenance_remarks });

    // Check if user has permission
    if (role !== 'maintenance' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Maintenance or admin access required',
      });
    }

    // If maintenance staff, verify they are assigned to this complaint
    if (role === 'maintenance') {
      const { data: complaint, error: checkError } = await supabase
        .from('complaints')
        .select('assigned_maintenance_id')
        .eq('id', complaintId)
        .single();

      if (checkError || !complaint) {
        return res.status(404).json({
          success: false,
          error: 'Complaint not found',
        });
      }

      if (complaint.assigned_maintenance_id !== id) {
        return res.status(403).json({
          success: false,
          error: 'You are not assigned to this complaint',
        });
      }
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Use "pending" or "in_progress"',
      });
    }

    // Prepare update data
    const updateData = {
      status: status,
      maintenance_remarks: maintenance_remarks || null,
      updated_at: new Date().toISOString(),
    };

    // If status is changed to pending, remove assignment
    if (status === 'pending') {
      updateData.assigned_maintenance_id = null;
    }

    // Update complaint
    const { data: updatedComplaint, error: updateError } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', complaintId)
      .select(
        `
        *,
        facility_types!facility_type_id (id, name),
        hotels!hostel_id (id, name, location),
        students:student_id (id, name, email, phone),
        assigned_maintenance:assigned_maintenance_id (id, name, email, phone)
      `
      )
      .single();

    if (updateError) throw updateError;

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found after update',
      });
    }

    // Transform response
    const transformedComplaint = {
      id: updatedComplaint.id,
      student_id: updatedComplaint.student_id,
      student_name: updatedComplaint.students?.name,
      student_email: updatedComplaint.students?.email,
      student_phone: updatedComplaint.students?.phone,
      hostel_id: updatedComplaint.hostel_id,
      hostel_name: updatedComplaint.hostels?.name,
      hostel_location: updatedComplaint.hostels?.location,
      room_number: updatedComplaint.room_number,
      facility_type_id: updatedComplaint.facility_type_id,
      facility_type: updatedComplaint.facility_types?.name,
      issue_description: updatedComplaint.issue_description,
      photo_url: updatedComplaint.photo_url,
      status: updatedComplaint.status,
      priority: updatedComplaint.priority,
      assigned_maintenance_id: updatedComplaint.assigned_maintenance_id,
      assigned_maintenance: updatedComplaint.assigned_maintenance?.name,
      assigned_maintenance_email: updatedComplaint.assigned_maintenance?.email,
      assigned_maintenance_phone: updatedComplaint.assigned_maintenance?.phone,
      admin_remarks: updatedComplaint.admin_remarks,
      maintenance_remarks: updatedComplaint.maintenance_remarks,
      resolution_date: updatedComplaint.resolution_date,
      submitted_at: updatedComplaint.submitted_at,
      submitted_date: updatedComplaint.submitted_at
        ? new Date(updatedComplaint.submitted_at).toLocaleDateString('en-MY')
        : 'N/A',
      updated_at: updatedComplaint.updated_at,
    };

    console.log(`✅ Complaint ${complaintId} updated to ${status}`);

    res.json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint: transformedComplaint,
    });
  } catch (error) {
    console.error('Update complaint error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ CRITICAL: EXPORT THE ROUTER ============
module.exports = router;
