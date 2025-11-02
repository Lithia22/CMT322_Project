import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { mockComplaints } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const MyComplaints = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter complaints for current student
  const studentComplaints = mockComplaints.filter(
    complaint => complaint.studentId === user?.studentId
  );

  // Filter complaints based on search and status
  const filteredComplaints = studentComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Complaints</h1>
          <p className="text-gray-600">Track the status of your submitted complaints</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search your complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg">
              Showing {filteredComplaints.length} of {studentComplaints.length} complaints
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {studentComplaints.length === 0 ? 'No Complaints Yet' : 'No Complaints Found'}
            </h3>
            <p className="text-gray-500">
              {studentComplaints.length === 0 
                ? 'Submit your first complaint to get started!' 
                : 'Try adjusting your filters or search terms'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {complaint.facilityType}
                        </h3>
                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {complaint.hostelName}
                          </span>
                          <span>Room {complaint.roomNumber}</span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {complaint.submittedDate}
                          </span>
                        </div>
                      </div>
                      
                      {/* Urgency Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(complaint.urgencyLevel)}`}>
                        {complaint.urgencyLevel} Priority
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">
                      {complaint.issueDescription}
                    </p>

                    {/* Admin Remarks */}
                    {complaint.adminRemarks && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Admin Remarks:</p>
                        <p className="text-sm text-blue-700">{complaint.adminRemarks}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Status */}
                  <div className="flex flex-col items-start lg:items-end gap-2">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <p className="text-xs text-gray-500">
                      ID: #{complaint.id}
                    </p>
                    {complaint.status === 'Resolved' && (
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        Provide Feedback →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;