import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, MapPin, ChevronUp } from 'lucide-react';

const PublicLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Scroll to top functionality
  const checkScrollTop = () => {
    if (!showScrollTop && window.pageYOffset > 400) {
      setShowScrollTop(true);
    } else if (showScrollTop && window.pageYOffset <= 400) {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add scroll event listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', checkScrollTop);
  }

  const navItems = [
    { path: '/', label: 'Home'},
    { path: '/contact', label: 'Contact Us'},
    { path: '/faq', label: 'FAQ'},
    { path: '/login', label: 'Login'},
  ];

  // Update the isActive function to treat /signup as part of login
  const isActive = (path) => {
    if (path === '/login') {
      // Consider both /login and /signup as active for the Login nav item
      return location.pathname === '/login' || location.pathname === '/signup';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - LSU Style */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/USM.svg" 
                alt="USM Logo" 
                className="h-14 w-14 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-gray-900 leading-tight">DesaFix</span>
                <span className="text-xs text-gray-600 font-medium">USM Hostel Complaint System</span>
              </div>
            </Link>

            {/* Desktop Navigation - LSU Style */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                return (
                  <div key={item.path} className="relative">
<Link 
  to={item.path}
  onClick={() => window.scrollTo(0, 0)}
  className={`font-semibold text-lg transition-all duration-300 group ${
    isActive(item.path) 
      ? 'text-purple-600' 
      : 'text-gray-700 hover:text-purple-600'
  }`}
>
                      <div className="flex items-center space-x-2 px-2 py-1">
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:text-purple-600 hover:bg-transparent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 space-y-4 border-t border-gray-200">
              {navItems.map((item) => {
                return (
<Link 
  key={item.path} 
  to={item.path}
  onClick={() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }}
  className={`flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
    isActive(item.path) 
      ? 'bg-purple-50 text-purple-600 border border-purple-100' 
      : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
  }`}
>
                    <span className="font-semibold text-lg">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-purple-900 text-white mt-auto border-t-4 border-yellow-400">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/USM.svg" 
                  alt="USM Logo" 
                  className="h-12 w-12"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-white leading-tight">DesaFix</span>
                  <span className="text-xs text-purple-200 font-medium">USM Hostel Complaint System</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-400">Quick Links</h3>
              <ul className="space-y-2 text-sm">
<li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-purple-100 hover:text-yellow-400 transition-colors duration-200">Home</Link></li>
<li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-purple-100 hover:text-yellow-400 transition-colors duration-200">Contact Us</Link></li>
<li><Link to="/faq" onClick={() => window.scrollTo(0, 0)} className="text-purple-100 hover:text-yellow-400 transition-colors duration-200">FAQ</Link></li>
<li><Link to="/login" onClick={() => window.scrollTo(0, 0)} className="text-purple-100 hover:text-yellow-400 transition-colors duration-200">Login</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-400">Contact Info</h3>
              <div className="space-y-2 text-sm text-purple-100">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-yellow-400" />
                  <span>Universiti Sains Malaysia, Penang</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-yellow-400" />
                  <span>+604-653 3888</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-700 mt-8 pt-6 text-center text-sm text-purple-200">
            <p>&copy; 2025 USM DesaFix. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110 border-2 border-yellow-400"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
};

export default PublicLayout;