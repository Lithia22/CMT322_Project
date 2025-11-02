import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Edit, Save, X } from 'lucide-react';
import { mockComplaints } from '../data/mockData';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hostelFilter, setHostelFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [adminRemarks, setAdminRemarks] = useState('');

  // Get unique hostels
  const uniqueHostels = ['All', ...new Set(complaints.map(c => c.hostelName))];

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesHostel = hostelFilter === 'All' || complaint.hostelName === hostelFilter;

    return matchesSearch && matchesStatus && matchesHostel;
  });

  const startEditing = (complaint) => {
    setEditingId(complaint.id);
    setEditData({
      status: complaint.status,
      adminRemarks: complaint.adminRemarks || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = (complaintId) => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, ...editData }
          : complaint
      )
    );
    setEditingId(null);
    setEditData({});
  };

  const addAdminRemarks = (complaintId) => {
    if (adminRemarks.trim()) {
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint.id === complaintId
            ? { 
                ...complaint, 
                adminRemarks: adminRemarks,
                status: complaint.status === 'Pending' ? 'In Progress' : complaint.status
              }
            : complaint
        )
      );
      setAdminRemarks('');
    }
  };

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
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Complaints</h1>
          <p className="text-gray-600">Update complaint status and add admin remarks</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Results Count */}
            <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID & Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Facility & Issue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">#{complaint.id}</p>
                        <p className="text-sm text-gray-600">{complaint.studentName}</p>
                        <p className="text-xs text-gray-500">{complaint.studentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span>{complaint.hostelName}</span>
                      </div>
                      <p className="text-sm text-gray-600">Room {complaint.roomNumber}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        <span>{complaint.submittedDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{complaint.facilityType}</p>
                      <p className="text-sm text-gray-600 max-w-xs">{complaint.issueDescription}</p>
                      {complaint.adminRemarks && (
                        <p className="text-xs text-blue-600 mt-1">
                          <strong>Remarks:</strong> {complaint.adminRemarks}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(complaint.urgencyLevel)}`}>
                        {complaint.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === complaint.id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                          className="px-3 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === complaint.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEditing(complaint.id)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(complaint)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Complaints Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>

        {/* Add Remarks Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Admin Remarks</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter remarks for selected complaint..."
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                if (filteredComplaints.length > 0) {
                  addAdminRemarks(filteredComplaints[0].id);
                }
              }}
              disabled={!adminRemarks.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Add Remarks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageComplaints;