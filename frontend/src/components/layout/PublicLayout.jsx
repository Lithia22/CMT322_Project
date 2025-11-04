import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Menu, X, Home as HomeIcon, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';

const PublicLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <span className="font-bold text-xl">USM Hostel Care</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button 
                    key={item.path} 
                    variant={isActive(item.path) ? "default" : "ghost"} 
                    asChild
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button 
                    key={item.path} 
                    variant={isActive(item.path) ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
              <Button className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About USM Hostel Care</h3>
              <p className="text-sm text-muted-foreground">
                A centralized platform for USM students to report and track hostel facility issues efficiently.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link to="/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
              </ul>
            </div>

            <div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Universiti Sains Malaysia, Penang</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+604-653 3888</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>hostelcare@usm.my</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 USM Hostel Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;