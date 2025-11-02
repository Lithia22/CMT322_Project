import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About USM Hostel Care</h3>
            <p className="text-gray-300 text-sm">
              A centralized platform for USM students to report and track hostel facility issues efficiently. 
              Quick response, transparent tracking, better hostel living.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/submit-complaint" className="hover:text-white transition">Submit Complaint</a></li>
              <li><a href="/view-complaints" className="hover:text-white transition">View Complaints</a></li>
              <li><a href="/feedback" className="hover:text-white transition">Feedback</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-300">
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

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 USM Hostel Care. All rights reserved. | CMT322 Web Engineering Project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;