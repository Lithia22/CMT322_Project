require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const complaintsRoutes = require('./routes/complaints');
const feedbacksRoutes = require('./routes/feedbacks');
// Setup first admin if needed
const createFirstAdmin = require('./setup/first-admin');
createFirstAdmin();

// Middleware
app.use(express.json());

// Enable CORS (allow frontend)
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/feedbacks', feedbacksRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'DesaFix Backend API',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        getStaff: 'GET /api/auth/staff (admin only)',
        registerStaff: 'POST /api/auth/register-staff (admin only)',
        deleteStaff: 'DELETE /api/auth/staff/:id (admin only)',
      },
      complaints: {
        getMyComplaints: 'GET /api/complaints/my-complaints (student)',
        getAllComplaints: 'GET /api/complaints (admin/maintenance only)',
        createComplaint: 'POST /api/complaints (student)',
        updateComplaint: 'PATCH /api/complaints/:id (admin/maintenance only)',
        resolveComplaint:
          'PATCH /api/complaints/:id/resolve (admin/maintenance only)',
        assignComplaint: 'PATCH /api/complaints/:id/assign (admin only)',
        getRecommendedStaff:
          'GET /api/complaints/:id/recommended-staff (admin only)',
      },
      feedbacks: {
        getMyFeedbacks: 'GET /api/feedbacks/my-feedbacks (student)',
        getMaintenanceFeedbacks:
          'GET /api/feedbacks/maintenance-feedbacks (maintenance staff)',
        getAllFeedbacks: 'GET /api/feedbacks (admin only)',
        createFeedback: 'POST /api/feedbacks (student)',
        getFeedbackByComplaint: 'GET /api/feedbacks/complaint/:id (student)',
      },
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('✅ Backend running on http://localhost:' + PORT);
  console.log('📡 Available endpoints:');
  console.log('='.repeat(60));

  console.log('');
  console.log('🔐 AUTH ENDPOINTS:');
  console.log('   • POST   http://localhost:' + PORT + '/api/auth/register');
  console.log('   • POST   http://localhost:' + PORT + '/api/auth/login');
  console.log(
    '   • GET    http://localhost:' + PORT + '/api/auth/profile (requires auth)'
  );
  console.log(
    '   • PUT    http://localhost:' + PORT + '/api/auth/profile (requires auth)'
  );
  console.log(
    '   • GET    http://localhost:' + PORT + '/api/auth/staff (admin only)'
  );
  console.log(
    '   • POST   http://localhost:' +
      PORT +
      '/api/auth/register-staff (admin only)'
  );
  console.log(
    '   • DELETE http://localhost:' + PORT + '/api/auth/staff/:id (admin only)'
  );

  console.log('');
  console.log('⚠️  COMPLAINTS ENDPOINTS:');
  console.log(
    '   • GET    http://localhost:' +
      PORT +
      '/api/complaints/my-complaints (student)'
  );
  console.log(
    '   • GET    http://localhost:' +
      PORT +
      '/api/complaints (admin/maintenance only)'
  );
  console.log(
    '   • POST   http://localhost:' + PORT + '/api/complaints (student)'
  );
  console.log(
    '   • PATCH  http://localhost:' +
      PORT +
      '/api/complaints/:id (admin/maintenance)'
  );
  console.log(
    '   • PATCH  http://localhost:' +
      PORT +
      '/api/complaints/:id/resolve (admin/maintenance)'
  );
  console.log(
    '   • PATCH  http://localhost:' +
      PORT +
      '/api/complaints/:id/assign (admin only)'
  );
  console.log(
    '   • GET    http://localhost:' +
      PORT +
      '/api/complaints/:id/recommended-staff (admin only)'
  );

  console.log('');
  console.log('⭐ FEEDBACK ENDPOINTS:');
  console.log(
    '   • GET    http://localhost:' +
      PORT +
      '/api/feedbacks/my-feedbacks (student)'
  );
  console.log(
    '   • GET    http://localhost:' +
      PORT +
      '/api/feedbacks/maintenance-feedbacks (maintenance staff)'
  );
  console.log(
    '   • GET    http://localhost:' + PORT + '/api/feedbacks (admin only)'
  );
  console.log(
    '   • POST   http://localhost:' + PORT + '/api/feedbacks (student)'
  );
  console.log(
    '   • GET    http://localhost:' +
      PORT +
      '/api/feedbacks/complaint/:id (student)'
  );

  console.log('');
  console.log('🧪 TEST COMMANDS:');
  console.log('   • Health check:    curl http://localhost:' + PORT + '/');
  console.log(
    '   • Student complaints: curl http://localhost:' +
      PORT +
      "/api/complaints/my-complaints -H 'Authorization: Bearer YOUR_TOKEN'"
  );
  console.log(
    '   • Student feedback:   curl http://localhost:' +
      PORT +
      "/api/feedbacks/my-feedbacks -H 'Authorization: Bearer YOUR_TOKEN'"
  );
  console.log(
    '   • Maintenance feedback: curl http://localhost:' +
      PORT +
      "/api/feedbacks/maintenance-feedbacks -H 'Authorization: Bearer YOUR_TOKEN'"
  );
  console.log(
    '   • Admin feedback:   curl http://localhost:' +
      PORT +
      "/api/feedbacks -H 'Authorization: Bearer YOUR_TOKEN'"
  );
  console.log('='.repeat(60));
});
