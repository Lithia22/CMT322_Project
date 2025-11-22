import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  MoreVertical,
  Calendar,
  Eye,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { mockComplaints, mockMaintenanceStaff } from '@/data/mockData';
import { UpdateComplaintModal } from '@/components/modal/UpdateComplaintModal';
import { useAuth } from '@/contexts/AuthContext';

const MaintenanceDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [viewComplaintDialogOpen, setViewComplaintDialogOpen] = useState(false);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const { user } = useAuth();

  // Get current maintenance staff based on user ID
  const currentStaff = mockMaintenanceStaff.find(
    staff => staff.id === user?.id || staff.id === user?.id?.toString()
  );

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  // Get complaints assigned to current maintenance staff (both Pending and In Progress)
  const assignedComplaints = useMemo(() => {
    if (!currentStaff) return [];
    return complaints.filter(
      complaint => complaint.assignedMaintenance === currentStaff.id
    );
  }, [complaints, currentStaff]);

  // Filter complaints for table view
  const filteredComplaints = useMemo(() => {
    return assignedComplaints.filter(complaint => {
      const matchesSearch =
        complaint.facilityType
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.hostelName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.roomNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.studentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.issueDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || complaint.status === statusFilter;
      const matchesFacility =
        facilityFilter === 'all' || complaint.facilityType === facilityFilter;

      return matchesSearch && matchesStatus && matchesFacility;
    });
  }, [assignedComplaints, searchQuery, statusFilter, facilityFilter]);

  // Calculate stats for assigned complaints
  const stats = {
    totalAssigned: assignedComplaints.length,
    pending: assignedComplaints.filter(c => c.status === 'Pending').length,
    inProgress: assignedComplaints.filter(c => c.status === 'In Progress')
      .length,
    resolved: assignedComplaints.filter(c => c.status === 'Resolved').length,
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleUpdateComplaint = complaint => {
    setSelectedComplaint(complaint);
    setShowUpdateModal(true);
  };

  const handleViewComplaint = complaint => {
    setSelectedComplaint(complaint);
    setViewComplaintDialogOpen(true);
  };

  const handleComplaintUpdate = updatedComplaint => {
    setComplaints(prevComplaints =>
      prevComplaints.map(complaint =>
        complaint.id === updatedComplaint.id ? updatedComplaint : complaint
      )
    );

    toast.success('Complaint updated successfully!');

    setShowUpdateModal(false);
    setSelectedComplaint(null);
  };

  // Skeleton Components
  const HeaderSkeleton = () => (
    <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
      <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const FiltersSkeleton = () => (
    <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Skeleton className="h-10 w-[250px] bg-gray-200" />
        <Skeleton className="h-10 w-[180px] bg-gray-200" />
        <Skeleton className="h-7 w-[80px] rounded-full bg-gray-200" />
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 pb-4 border-b last:border-0"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-200" />
                <Skeleton className="h-3 w-48 bg-gray-200" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
                <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
              </div>
              <Skeleton className="h-4 w-16 bg-gray-200" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />

        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[200px] bg-gray-200 rounded-md" />
            <Skeleton className="h-10 w-[180px] bg-gray-200 rounded-md" />
          </div>

          <FiltersSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-6 text-white shadow-lg"
        style={{
          background:
            'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))',
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Maintenance Dashboard
            </h1>
            <p className="text-white/90">
              Manage your assigned complaints efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Assigned */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Total Assigned
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.totalAssigned}
            </div>
            <p className="text-xs text-gray-600 mt-1">All assignments</p>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Pending
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.pending}</div>
            <p className="text-xs text-gray-600 mt-1">Not started yet</p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              In Progress
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.inProgress}
            </div>
            <p className="text-xs text-gray-600 mt-1">Being handled</p>
          </CardContent>
        </Card>

        {/* Resolved */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Resolved
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.resolved}
            </div>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Complaints Table Section */}
      {/* Search and Filters - Single Row */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        {/* Left side - Search, Filters, Count */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-gray-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={facilityFilter} onValueChange={setFacilityFilter}>
            <SelectTrigger className="w-[180px] border-gray-300 focus:border-purple-500 focus:ring-purple-500">
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              <SelectItem value="Air Conditioner">Air Conditioner</SelectItem>
              <SelectItem value="Bathroom">Bathroom</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="Door/Window">Door/Window</SelectItem>
              <SelectItem value="Lighting">Lighting</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="h-7">
            {filteredComplaints.length} of {assignedComplaints.length}
          </Badge>
        </div>
      </div>
      <Card>
        {/* Complaints Table - Responsive with horizontal scroll */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Complaint Date</TableHead>
                <TableHead className="min-w-[150px]">Facility Type</TableHead>
                <TableHead className="min-w-[200px]">Location</TableHead>
                <TableHead className="min-w-[200px]">
                  Issue Description
                </TableHead>
                <TableHead className="min-w-[150px]">Status</TableHead>
                <TableHead className="min-w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(complaint => (
                  <TableRow key={complaint.id}>
                    <TableCell className="text-sm text-gray-600">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar size={14} />
                        {complaint.submittedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {complaint.facilityType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-black whitespace-nowrap">
                          {complaint.hostelName}
                        </div>
                        <div className="text-gray-600 whitespace-nowrap">
                          Room {complaint.roomNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-[300px] truncate">
                        {complaint.issueDescription}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(complaint.status)} pointer-events-none`}
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewComplaint(complaint)}
                          >
                            View Complaint
                          </DropdownMenuItem>
                          {complaint.status !== 'Resolved' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateComplaint(complaint)}
                            >
                              Update Status
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-gray-600"
                  >
                    No complaints found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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

      {/* View Complaint Dialog */}
      <Dialog
        open={viewComplaintDialogOpen}
        onOpenChange={setViewComplaintDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Facility:</span>{' '}
                    {selectedComplaint.facilityType}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {selectedComplaint.submittedDate}
                  </div>
                  <div>
                    <span className="font-medium">Hostel:</span>{' '}
                    {selectedComplaint.hostelName}
                  </div>
                  <div>
                    <span className="font-medium">Room:</span>{' '}
                    {selectedComplaint.roomNumber}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Student:</span>{' '}
                    {selectedComplaint.studentName}
                  </div>
                </div>
                <div className="text-sm pt-2 border-t">
                  <span className="font-medium">Issue:</span>
                  <p className="text-gray-600 mt-1">
                    {selectedComplaint.issueDescription}
                  </p>
                </div>
                {selectedComplaint.maintenanceRemarks && (
                  <div className="text-sm pt-2 border-t">
                    <span className="font-medium">Your Remarks:</span>
                    <p className="text-gray-600 mt-1">
                      {selectedComplaint.maintenanceRemarks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceDashboard;
