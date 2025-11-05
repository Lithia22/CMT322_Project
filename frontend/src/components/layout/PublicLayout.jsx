import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Menu, X, Home as HomeIcon, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';

const PublicLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/faq', label: 'FAQ' },
  { path: '/login', label: 'Login' },
];

  const isActive = (path) => location.pathname === path;

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
                const Icon = item.icon;
                return (
                  <div key={item.path} className="relative">
                    <Link 
                      to={item.path}
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
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
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

      {/* Footer - LSU Style */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-6xl mx-auto">
            <div className="md:col-span-4">
              <h3 className="font-bold text-xl mb-6 text-white">About DesaFix</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                A centralized platform for USM students to report and track hostel facility issues efficiently, 
                ensuring comfortable living conditions across campus.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <h3 className="font-bold text-xl mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4 text-lg">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="font-bold text-xl mb-6 text-white">Contact Info</h3>
              <div className="space-y-4 text-lg text-gray-300">
                <div className="flex items-center space-x-4">
                  <MapPin size={20} className="flex-shrink-0 text-purple-400" />
                  <span className="font-medium">Universiti Sains Malaysia, Penang</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone size={20} className="flex-shrink-0 text-purple-400" />
                  <span className="font-medium">+604-653 3888</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail size={20} className="flex-shrink-0 text-purple-400" />
                  <span className="font-medium">hostelcare@usm.my</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              &copy; 2025 DesaFix - Universiti Sains Malaysia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;