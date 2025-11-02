import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, HelpCircle, Phone, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const publicNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  const studentNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/submit-complaint', label: 'Submit Complaint', icon: ShieldCheck },
    { path: '/my-complaints', label: 'My Complaints', icon: ShieldCheck },
    { path: '/feedback', label: 'Feedback', icon: ShieldCheck },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/manage-complaints', label: 'Manage Complaints', icon: ShieldCheck },
    { path: '/view-feedback', label: 'View Feedback', icon: ShieldCheck },
  ];

  const getNavItems = () => {
    if (!isAuthenticated) return publicNavItems;
    return isAdmin ? adminNavItems : studentNavItems;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 p-2 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-xl">USM Hostel Care</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Auth Section */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition"
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/30">
                <span className="text-sm">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;