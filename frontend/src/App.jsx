import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import Feedback from './pages/student/Feedback';
import ManageComplaints from './pages/admin/ManageComplaints';
import ViewFeedback from './pages/admin/ViewFeedback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Student Routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/submit-complaint" element={<SubmitComplaint />} />
              <Route path="/my-complaints" element={<MyComplaints />} />
              <Route path="/feedback" element={<Feedback />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/manage-complaints" element={<ManageComplaints />} />
              <Route path="/view-feedback" element={<ViewFeedback />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;