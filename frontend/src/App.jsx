import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import { Toaster } from '@/components/ui/sonner';

// Public pages
import Home from './pages/public/Home';
import FAQ from './pages/public/FAQ';
import Login from './pages/public/Login';
import Contact from './pages/public/Contact';
import SignUp from './pages/public/SignUp';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyComplaints from './pages/student/MyComplaints';
import Feedback from './pages/student/Feedback';

// Admin pages  
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageComplaints from './pages/admin/ManageComplaints';
import ViewFeedback from './pages/admin/ViewFeedback';
import EditProfile from './pages/admin/EditProfile';

// Technician pages  
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianComplaints from './pages/technician/TechnicianComplaints';


// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Student Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-complaints" 
            element={
              <ProtectedRoute>
                <MyComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manage-complaints" 
            element={
              <ProtectedRoute>
                <ManageComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/view-feedback" 
            element={
              <ProtectedRoute>
                <ViewFeedback />
              </ProtectedRoute>
            } 
          />
\          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />

          {/* Protected Technician Routes */}
          <Route 
            path="/technician" 
            element={
              <ProtectedRoute>
                <TechnicianDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/technician-complaints" 
            element={
              <ProtectedRoute>
                <TechnicianComplaints />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;