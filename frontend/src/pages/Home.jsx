import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FileText, Eye, Search, TrendingUp, Clock, CheckCircle, AlertCircle, Users, ShieldCheck, MessageSquare } from 'lucide-react';
import { mockComplaints } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics from mock data
  const totalComplaints = mockComplaints.length;
  const pendingComplaints = mockComplaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = mockComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = mockComplaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label: 'Total Complaints', value: totalComplaints, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Pending', value: pendingComplaints, icon: Clock, color: 'bg-yellow-500' },
    { label: 'In Progress', value: inProgressComplaints, icon: AlertCircle, color: 'bg-orange-500' },
    { label: 'Resolved', value: resolvedComplaints, icon: CheckCircle, color: 'bg-green-500' },
  ];

  const features = [
    {
      icon: FileText,
      title: 'Submit Complaints',
      description: 'Easily report any hostel facility issues with our simple form.',
      colorClass: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Eye,
      title: 'Track Status',
      description: 'Monitor your complaint progress in real-time with transparent updates.',
      colorClass: 'bg-green-100 text-green-600',
    },
    {
      icon: MessageSquare,
      title: 'Provide Feedback',
      description: 'Rate and comment on resolved complaints to help us improve.',
      colorClass: 'bg-purple-100 text-purple-600',
    },
  ];

  // Filter complaints for search
  const filteredComplaints = mockComplaints.filter(complaint =>
    complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            USM Hostel Care System
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Your centralized platform for reporting and tracking hostel facility issues. 
            Fast response, transparent tracking, better living experience.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search common complaints (e.g., AC, bathroom, electrical)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/submit-complaint"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center space-x-2 shadow-lg"
              >
                <FileText size={20} />
                <span>Submit a Complaint</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center space-x-2 shadow-lg"
              >
                <FileText size={20} />
                <span>Login to Submit Complaint</span>
              </Link>
            )}
            <Link
              to="/faq"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition flex items-center space-x-2 shadow-lg"
            >
              <ShieldCheck size={20} />
              <span>View FAQ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-lg`}>
                    <Icon size={32} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${feature.colorClass}`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Complaints Preview */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {searchTerm ? 'Search Results' : 'Recent Complaints'}
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-8">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">
                {searchTerm ? 'No complaints found matching your search.' : 'No complaints to display.'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{complaint.facilityType}</h4>
                        <p className="text-sm text-gray-600">{complaint.hostelName} - Room {complaint.roomNumber}</p>
                        <p className="text-sm text-gray-500 mt-1">{complaint.issueDescription}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {!isAuthenticated && (
                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Login to view all complaints →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;