import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { mockComplaints } from '../../data/mockData';

const ViewComplaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hostelFilter, setHostelFilter] = useState('All');

  // Get unique hostels
  const uniqueHostels = ['All', ...new Set(mockComplaints.map(c => c.hostelName))];

  // Filter complaints
  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesHostel = hostelFilter === 'All' || complaint.hostelName === hostelFilter;

    return matchesSearch && matchesStatus && matchesHostel;
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">View Complaints</h1>
          <p className="text-gray-600">
            Track and monitor all submitted hostel facility complaints
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search complaints..."
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

            {/* Hostel Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {uniqueHostels.map((hostel, index) => (
                  <option key={index} value={hostel}>{hostel === 'All' ? 'All Hostels' : hostel}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredComplaints.length}</span> of {mockComplaints.length} complaints
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Complaints Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {complaint.facilityType}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ID: #{complaint.id}
                    </p>
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

export default ViewComplaints;