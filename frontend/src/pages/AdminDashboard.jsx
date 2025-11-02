import { useState } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Users, MessageSquare, PieChart, BarChart } from 'lucide-react';
import { mockComplaints, mockFeedbacks, mockUsers } from '../data/mockData';

const AdminDashboard = () => {
  const [complaints] = useState(mockComplaints);
  const [feedbacks] = useState(mockFeedbacks);
  const [students] = useState(mockUsers.filter(u => u.role === 'student'));

  // Calculate statistics
  const stats = {
    totalComplaints: complaints.length,
    pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
    inProgressComplaints: complaints.filter(c => c.status === 'In Progress').length,
    resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
    totalStudents: students.length,
    totalFeedbacks: feedbacks.length,
    avgRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0
  };

  // Chart data - Complaint Status Distribution
  const statusData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [stats.pendingComplaints, stats.inProgressComplaints, stats.resolvedComplaints],
        backgroundColor: ['#fbbf24', '#f97316', '#10b981'],
      }
    ]
  };

  // Chart data - Facility Type Distribution
  const facilityData = {
    labels: [...new Set(complaints.map(c => c.facilityType))],
    datasets: [
      {
        label: 'Complaints by Facility',
        data: [...new Set(complaints.map(c => c.facilityType))].map(type => 
          complaints.filter(c => c.facilityType === type).length
        ),
        backgroundColor: '#3b82f6',
      }
    ]
  };

  // Chart data - Urgency Level Distribution
  const urgencyData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Complaints by Urgency',
        data: [
          complaints.filter(c => c.urgencyLevel === 'High').length,
          complaints.filter(c => c.urgencyLevel === 'Medium').length,
          complaints.filter(c => c.urgencyLevel === 'Low').length
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      }
    ]
  };

  const statsCards = [
    { 
      label: 'Total Complaints', 
      value: stats.totalComplaints, 
      icon: BarChart3, 
      color: 'bg-blue-500',
      description: 'All time complaints'
    },
    { 
      label: 'Pending', 
      value: stats.pendingComplaints, 
      icon: Clock, 
      color: 'bg-yellow-500',
      description: 'Awaiting action'
    },
    { 
      label: 'In Progress', 
      value: stats.inProgressComplaints, 
      icon: AlertTriangle, 
      color: 'bg-orange-500',
      description: 'Being resolved'
    },
    { 
      label: 'Resolved', 
      value: stats.resolvedComplaints, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      description: 'Completed'
    },
    { 
      label: 'Total Students', 
      value: stats.totalStudents, 
      icon: Users, 
      color: 'bg-purple-500',
      description: 'Registered students'
    },
    { 
      label: 'Avg Rating', 
      value: stats.avgRating, 
      icon: MessageSquare, 
      color: 'bg-pink-500',
      description: 'Student satisfaction'
    }
  ];

  const quickActions = [
    {
      icon: BarChart3,
      label: 'Manage Complaints',
      description: 'View and update complaint status',
      path: '/manage-complaints',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      label: 'View Feedback',
      description: 'See student ratings and comments',
      path: '/view-feedback',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: PieChart,
      label: 'Reports',
      description: 'Generate system reports',
      path: '#',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Simple chart components (since we're not using a chart library)
  const PieChartDisplay = ({ data, title }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.labels.map((label, index) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
              ></div>
              <span className="text-sm text-gray-700">{label}</span>
            </div>
            <span className="font-semibold text-gray-800">{data.datasets[0].data[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const BarChartDisplay = ({ data, title }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.labels.map((label, index) => {
          const maxValue = Math.max(...data.datasets[0].data);
          const percentage = (data.datasets[0].data[index] / maxValue) * 100;
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{label}</span>
                <span className="font-semibold text-gray-800">{data.datasets[0].data[index]}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: data.datasets[0].backgroundColor?.[index] || '#3b82f6'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of the hostel complaint system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.path}
                className={`bg-gradient-to-r ${action.color} text-white rounded-xl p-6 hover:shadow-xl transition transform hover:scale-105`}
              >
                <Icon size={32} className="mb-3" />
                <h3 className="text-lg font-semibold mb-2">{action.label}</h3>
                <p className="text-white/90 text-sm">{action.description}</p>
              </a>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PieChartDisplay data={statusData} title="Complaint Status" />
          <BarChartDisplay data={facilityData} title="Facility Type Distribution" />
          <BarChartDisplay data={urgencyData} title="Urgency Level Distribution" />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Complaints</h3>
            <div className="space-y-3">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{complaint.facilityType}</p>
                    <p className="text-sm text-gray-600">{complaint.studentName} - {complaint.hostelName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h3>
            <div className="space-y-3">
              {feedbacks.slice(0, 5).map((feedback) => (
                <div key={feedback.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{feedback.studentName}</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-3 h-3 rounded-full ${
                            star <= feedback.rating ? 'bg-yellow-400' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;