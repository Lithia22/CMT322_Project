import { Link } from 'react-router-dom';
import { FileText, Eye, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockComplaints } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Filter complaints for current student
  const studentComplaints = mockComplaints.filter(
    complaint => complaint.studentId === user?.studentId
  );

  // Calculate statistics
  const totalComplaints = studentComplaints.length;
  const pendingComplaints = studentComplaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = studentComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = studentComplaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label: 'Total Complaints', value: totalComplaints, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Pending', value: pendingComplaints, icon: Clock, color: 'bg-yellow-500' },
    { label: 'In Progress', value: inProgressComplaints, icon: AlertCircle, color: 'bg-orange-500' },
    { label: 'Resolved', value: resolvedComplaints, icon: CheckCircle, color: 'bg-green-500' },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: 'Submit New Complaint',
      description: 'Report a new facility issue',
      path: '/submit-complaint',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Eye,
      label: 'View My Complaints',
      description: 'Check status of your complaints',
      path: '/my-complaints',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: MessageSquare,
      label: 'Provide Feedback',
      description: 'Rate resolved complaints',
      path: '/feedback',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const recentComplaints = studentComplaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your complaints and quick actions you can take.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.path}
                      className={`${action.color} text-white rounded-xl p-6 text-center hover:shadow-lg transition transform hover:scale-105`}
                    >
                      <Icon size={32} className="mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">{action.label}</h3>
                      <p className="text-white/90 text-sm">{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Complaints</h2>
            {recentComplaints.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No complaints yet</p>
                <Link
                  to="/submit-complaint"
                  className="text-blue-600 hover:text-blue-800 font-semibold mt-2 inline-block"
                >
                  Submit your first complaint →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{complaint.facilityType}</h4>
                        <p className="text-sm text-gray-600">{complaint.hostelName}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{complaint.issueDescription}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Link
                  to="/my-complaints"
                  className="block text-center text-blue-600 hover:text-blue-800 font-semibold mt-4"
                >
                  View All Complaints →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;