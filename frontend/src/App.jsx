import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import DashboardLayout from './components/layout/DashboardLayout';
import { Toaster } from '@/components/ui/sonner';

// Public pages
import Home from './pages/public/Home';
import FAQ from './pages/public/FAQ';
import Login from './pages/public/Login';
import Contact from './pages/public/Contact';
import SignUp from './pages/public/Signup';
// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyComplaints from './pages/student/MyComplaints';
import Feedback from './pages/student/Feedback';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EditProfile from './pages/admin/EditProfile';
import StaffManagement from './pages/admin/StaffManagement';
import StaffPerformance from './pages/admin/StaffPerformance';

// Maintenance pages
import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';
import MaintenanceFeedback from './pages/maintenance/MaintenanceFeedback';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? (
    <DashboardLayout>{children}</DashboardLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="desafix-theme">
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
              path="/staff-management"
              element={
                <ProtectedRoute>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-performance"
              element={
                <ProtectedRoute>
                  <StaffPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected Maintenance Routes */}
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenanceDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance-feedback"
              element={
                <ProtectedRoute>
                  <MaintenanceFeedback />
                </ProtectedRoute>
              }
            />

            {/* Redirect to appropriate dashboard based on role */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
