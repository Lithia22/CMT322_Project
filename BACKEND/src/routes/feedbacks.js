// feedbacks.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const jwt = require("jsonwebtoken");

// Reuse the same authMiddleware from complaints.js
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {       
      return res.status(401).json({
        success: false,
        error: "No authentication token provided"
      });
    }

    const token = authHeader.replace("Bearer ", "");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, role, name, matric_number, hostel_id, room_number")
      .eq("id", userId)
      .single();

    if (error || !user) {
      console.error("User not found in database for ID:", userId, error);
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      matricNumber: user.matric_number,
      hostelId: user.hostel_id,
      roomNumber: user.room_number
    };

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired"
      });
    }
    
    res.status(401).json({
      success: false,
      error: "Authentication failed: " + error.message
    });
  }
};

// ============ GET USER'S FEEDBACKS (STUDENTS) ============
router.get("/my-feedbacks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📋 Student fetching their feedbacks for user ID:", userId);   

    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select(`
        *,
        complaints!inner (
          id,
          facility_type_id,
          facility_types!facility_type_id (name),
          issue_description,
          status,
          maintenance_remarks,
          submitted_at,
          room_number,
          assigned_maintenance_id,
          assigned_maintenance:assigned_maintenance_id (id, name, phone, specialty),
          hostels:hostel_id (name, location)
        )
      `)
      .eq("student_id", userId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    console.log(`✅ Found ${feedbacks?.length || 0} feedbacks for student`);
    
    // Transform the data to include complaint details
    const transformedFeedbacks = (feedbacks || []).map(feedback => ({
      id: feedback.id,
      complaint_id: feedback.complaint_id,
      student_id: feedback.student_id,
      maintenance_id: feedback.maintenance_id,
      rating: feedback.rating,
      comment: feedback.comment,
      submitted_at: feedback.submitted_at,
      submitted_date: feedback.submitted_at ? 
        new Date(feedback.submitted_at).toLocaleDateString('en-MY') : 'N/A',
      complaint_details: feedback.complaints ? {
        id: feedback.complaints.id,
        facility_type_id: feedback.complaints.facility_type_id,
        facility_type: feedback.complaints.facility_types?.name,
        issue_description: feedback.complaints.issue_description,
        status: feedback.complaints.status,
        maintenance_remarks: feedback.complaints.maintenance_remarks,
        submitted_at: feedback.complaints.submitted_at,
        room_number: feedback.complaints.room_number,
        hostel_name: feedback.complaints.hostels?.name,
        hostel_location: feedback.complaints.hostels?.location,
        assigned_maintenance_id: feedback.complaints.assigned_maintenance_id,
        assigned_maintenance: feedback.complaints.assigned_maintenance?.name,
        assigned_maintenance_phone: feedback.complaints.assigned_maintenance?.phone,
        assigned_maintenance_specialty: feedback.complaints.assigned_maintenance?.specialty
      } : null
    }));
    
    res.json({ success: true, feedbacks: transformedFeedbacks });

  } catch (error) {
    console.error("Get student feedbacks error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ GET MAINTENANCE STAFF FEEDBACKS ============
router.get("/maintenance-feedbacks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole !== 'maintenance') {
      return res.status(403).json({ 
        success: false, 
        error: 'Maintenance staff access required' 
      });
    }

    console.log(`📋 Maintenance staff ${req.user.name} fetching their feedbacks`);

    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select(`
        *,
        complaints!inner (
          id,
          facility_type_id,
          facility_types!facility_type_id (name),
          issue_description,
          status,
          maintenance_remarks,
          submitted_at,
          room_number,
          hostels!hostel_id (name, location),
          students:student_id (name, matric_number, email)
        ),
        students:student_id (name, matric_number, email)
      `)
      .eq('maintenance_id', userId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    console.log(`✅ Found ${feedbacks?.length || 0} feedbacks for maintenance staff`);
    
    // Transform the data
    const transformedFeedbacks = (feedbacks || []).map(feedback => ({
      id: feedback.id,
      complaint_id: feedback.complaint_id,
      student_id: feedback.student_id,
      student_name: feedback.students?.name,
      student_matric: feedback.students?.matric_number,
      student_email: feedback.students?.email,
      maintenance_id: feedback.maintenance_id,
      rating: feedback.rating,
      comment: feedback.comment,
      submitted_at: feedback.submitted_at,
      submitted_date: feedback.submitted_at ? 
        new Date(feedback.submitted_at).toLocaleDateString('en-MY') : 'N/A',
      complaint_details: feedback.complaints ? {
        id: feedback.complaints.id,
        facility_type_id: feedback.complaints.facility_type_id,
        facility_type: feedback.complaints.facility_types?.name,
        issue_description: feedback.complaints.issue_description,
        status: feedback.complaints.status,
        maintenance_remarks: feedback.complaints.maintenance_remarks,
        hostel_name: feedback.complaints.hostels?.name,
        hostel_location: feedback.complaints.hostels?.location,
        room_number: feedback.complaints.room_number,
        submitted_at: feedback.complaints.submitted_at
      } : null
    }));
    
    // Log to check if facility_type is coming through
    if (transformedFeedbacks.length > 0) {
      console.log('Sample feedback facility type:', transformedFeedbacks[0]?.complaint_details?.facility_type);
    }
    
    res.json({ 
      success: true, 
      feedbacks: transformedFeedbacks,
      message: 'Your feedbacks retrieved successfully'
    });

  } catch (error) {
    console.error("Get maintenance feedbacks error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ CREATE FEEDBACK ============
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { complaint_id, rating, comment } = req.body;

    console.log("📝 Creating feedback for user:", req.user.name, "ID:", userId);
    console.log("📝 Request body:", req.body);

    // Validation
    if (!complaint_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "Complaint ID, rating, and comment are required"   
      });
    }

    // Check if complaint exists and is resolved
    const { data: complaint, error: complaintError } = await supabase
      .from("complaints")
      .select("*")
      .eq("id", complaint_id)
      .eq("student_id", userId)
      .eq("status", "resolved")
      .single();

    if (complaintError || !complaint) {
      return res.status(400).json({
        success: false,
        error: "Complaint not found or not resolved"
      });
    }

    // Check if feedback already exists for this complaint
    const { data: existingFeedback, error: checkError } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("complaint_id", complaint_id)
      .eq("student_id", userId)
      .single();

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        error: "Feedback already submitted for this complaint"
      });
    }

    // Check if complaint has assigned maintenance staff
    if (!complaint.assigned_maintenance_id) {
      console.warn("⚠️ Complaint has no assigned maintenance staff, maintenance_id will be null");
    }

    // Create feedback
    const { data: feedback, error } = await supabase
      .from("feedbacks")
      .insert([{
        complaint_id: complaint_id,
        student_id: userId,
        maintenance_id: complaint.assigned_maintenance_id,
        rating: rating,
        comment: comment,
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Feedback saved successfully!");
    console.log("   Feedback ID:", feedback.id);
    console.log("   Complaint ID:", complaint_id);
    console.log("   Rating:", rating);
    console.log("   Maintenance ID:", complaint.assigned_maintenance_id);

    // Get the full feedback with complaint details including facility type
    const { data: newFeedback, error: fetchError } = await supabase
      .from("feedbacks")
      .select(`
        *,
        complaints!inner (
          id,
          facility_type_id,
          facility_types!facility_type_id (name),
          issue_description,
          status,
          maintenance_remarks,
          submitted_at,
          room_number,
          hostels!hostel_id (name, location)
        )
      `)
      .eq("id", feedback.id)
      .single();

    if (fetchError) {
      console.error("Error fetching created feedback:", fetchError);
      // Return the basic feedback if we can't get details
      return res.status(201).json({ success: true, feedback: feedback });
    }

    // Transform with facility_type
    const transformedFeedback = {
      id: newFeedback.id,
      complaint_id: newFeedback.complaint_id,
      student_id: newFeedback.student_id,
      maintenance_id: newFeedback.maintenance_id,
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      submitted_at: newFeedback.submitted_at,
      submitted_date: newFeedback.submitted_at ? 
        new Date(newFeedback.submitted_at).toLocaleDateString('en-MY') : 'N/A',
      complaint_details: newFeedback.complaints ? {
        id: newFeedback.complaints.id,
        facility_type_id: newFeedback.complaints.facility_type_id,
        facility_type: newFeedback.complaints.facility_types?.name,
        issue_description: newFeedback.complaints.issue_description,
        status: newFeedback.complaints.status,
        maintenance_remarks: newFeedback.complaints.maintenance_remarks,
        hostel_name: newFeedback.complaints.hostels?.name,
        hostel_location: newFeedback.complaints.hostels?.location,
        room_number: newFeedback.complaints.room_number,
        submitted_at: newFeedback.complaints.submitted_at
      } : null
    };
    
    res.status(201).json({ success: true, feedback: transformedFeedback });

  } catch (error) {
    console.error("Create feedback error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ GET FEEDBACK BY COMPLAINT ID ============
router.get("/complaint/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const complaintId = req.params.id;

    console.log(`📋 Fetching feedback for complaint: ${complaintId}`);

    const { data: feedback, error } = await supabase
      .from("feedbacks")
      .select(`
        *,
        complaints!inner (
          id,
          facility_type_id,
          facility_types!facility_type_id (name),
          issue_description,
          status,
          maintenance_remarks,
          submitted_at
        )
      `)
      .eq("complaint_id", complaintId)
      .eq("student_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw error;
    }

    if (!feedback) {
      return res.json({
        success: true,
        feedback: null,
        message: "No feedback found for this complaint"
      });
    }

    console.log(`✅ Found feedback for complaint ${complaintId}`);
    
    // Transform to include facility_type
    const transformedFeedback = {
      id: feedback.id,
      complaint_id: feedback.complaint_id,
      student_id: feedback.student_id,
      maintenance_id: feedback.maintenance_id,
      rating: feedback.rating,
      comment: feedback.comment,
      submitted_at: feedback.submitted_at,
      submitted_date: feedback.submitted_at ? 
        new Date(feedback.submitted_at).toLocaleDateString('en-MY') : 'N/A',
      complaint_details: feedback.complaints ? {
        id: feedback.complaints.id,
        facility_type_id: feedback.complaints.facility_type_id,
        facility_type: feedback.complaints.facility_types?.name,
        issue_description: feedback.complaints.issue_description,
        status: feedback.complaints.status,
        maintenance_remarks: feedback.complaints.maintenance_remarks,
        submitted_at: feedback.complaints.submitted_at
      } : null
    };
    
    res.json({ success: true, feedback: transformedFeedback });

  } catch (error) {
    console.error("Get feedback by complaint error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ GET ALL FEEDBACKS (ADMIN ONLY) ============
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Only admin can view all feedbacks
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }

    console.log("📋 Admin fetching all feedbacks");

    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select(`
        *,
        complaints!inner (
          id,
          facility_type_id,
          facility_types!facility_type_id (name),
          issue_description,
          status,
          maintenance_remarks,
          room_number,
          submitted_at,
          hostels!hostel_id (name, location),
          students:student_id (name, matric_number, email),
          assigned_maintenance:assigned_maintenance_id (id, name, phone, specialty)
        ),
        maintenance_staff:maintenance_id (id, name, phone, specialty),
        students:student_id (name, matric_number, email)
      `)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    console.log(`✅ Found ${feedbacks?.length || 0} feedbacks`);
    
    // Transform the data for admin view
    const transformedFeedbacks = (feedbacks || []).map(feedback => ({
      id: feedback.id,
      complaint_id: feedback.complaint_id,
      student_id: feedback.student_id,
      student_name: feedback.students?.name,
      student_matric: feedback.students?.matric_number,
      student_email: feedback.students?.email,
      maintenance_id: feedback.maintenance_id,
      rating: feedback.rating,
      comment: feedback.comment,
      submitted_at: feedback.submitted_at,
      submitted_date: feedback.submitted_at ? 
        new Date(feedback.submitted_at).toLocaleDateString('en-MY') : 'N/A',
      complaint_details: feedback.complaints ? {
        id: feedback.complaints.id,
        facility_type_id: feedback.complaints.facility_type_id,
        facility_type: feedback.complaints.facility_types?.name,
        issue_description: feedback.complaints.issue_description,
        status: feedback.complaints.status,
        maintenance_remarks: feedback.complaints.maintenance_remarks,
        hostel_name: feedback.complaints.hostels?.name,
        hostel_location: feedback.complaints.hostels?.location,
        room_number: feedback.complaints.room_number,
        submitted_at: feedback.complaints.submitted_at,
        assigned_maintenance_id: feedback.complaints.assigned_maintenance_id,
        assigned_maintenance_name: feedback.complaints.assigned_maintenance?.name,
        assigned_maintenance_phone: feedback.complaints.assigned_maintenance?.phone,
        assigned_maintenance_specialty: feedback.complaints.assigned_maintenance?.specialty
      } : null,
      maintenance_staff: feedback.maintenance_staff ? {
        id: feedback.maintenance_staff.id,
        name: feedback.maintenance_staff.name,
        phone: feedback.maintenance_staff.phone,
        specialty: feedback.maintenance_staff.specialty
      } : null
    }));
    
    res.json({ success: true, feedbacks: transformedFeedbacks });

  } catch (error) {
    console.error("Get all feedbacks error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
