import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter, Wrench } from 'lucide-react';
import { mockComplaints, mockTechnicians, facilityTypes, hostelOptions } from '@/data/mockData';
import { UpdateComplaintModal } from '@/components/modal/UpdateComplaintModal';
import { useAuth } from '@/contexts/AuthContext';

const TechnicianComplaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [complaints, setComplaints] = useState(mockComplaints);
  
  // In a real app, this would come from authentication context
  const currentTechnicianId = "3";
  const currentTechnician = mockTechnicians.find(tech => tech.id === currentTechnicianId);

  // Get complaints assigned to current technician
  const assignedComplaints = useMemo(() => {
    return complaints.filter(complaint => complaint.assignedTechnician === currentTechnicianId);
  }, [complaints, currentTechnicianId]);

  // Filter complaints based on search and filters
  const filteredComplaints = useMemo(() => {
    return assignedComplaints.filter(complaint => {
      const matchesSearch = 
        complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesFacility = facilityFilter === 'all' || complaint.facilityType === facilityFilter;
      
      return matchesSearch && matchesStatus && matchesFacility;
    });
  }, [assignedComplaints, searchTerm, statusFilter, facilityFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUpdateComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowUpdateModal(true);
  };

  const handleComplaintUpdate = (updatedComplaint) => {
    setComplaints(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === updatedComplaint.id ? updatedComplaint : complaint
      )
    );
    setShowUpdateModal(false);
    setSelectedComplaint(null);
  };

  const stats = {
    total: assignedComplaints.length,
    pending: assignedComplaints.filter(c => c.status === 'Pending').length,
    inProgress: assignedComplaints.filter(c => c.status === 'In Progress').length,
    resolved: assignedComplaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assigned Complaints</h1>
          <p className="text-gray-600">Manage and update complaints assigned to you</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome, {currentTechnician?.name}</p>
            <p className="text-xs text-gray-500">{currentTechnician?.specialty} Specialist</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-sm text-gray-600">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Facilities</option>
              {facilityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Complaints ({filteredComplaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No complaints found matching your criteria.</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-lg">{complaint.facilityType}</p>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {complaint.studentName} • {complaint.matricNumber} • {complaint.hostelName} (Room {complaint.roomNumber})
                      </p>
                      <p className="text-gray-700">{complaint.issueDescription}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Submitted: {complaint.submittedDate}</span>
                        {complaint.technicianRemarks && (
                          <span>Remarks: {complaint.technicianRemarks}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {complaint.status !== 'Resolved' && (
                        <Button 
                          onClick={() => handleUpdateComplaint(complaint)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Update
                        </Button>
                      )}
                      {complaint.status === 'Resolved' && complaint.resolutionDate && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Resolved on {complaint.resolutionDate}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Update Complaint Modal */}
      <UpdateComplaintModal
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onUpdate={handleComplaintUpdate}
      />
    </div>
  );
};

export default TechnicianComplaints;