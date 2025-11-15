import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Phone,
  Calendar,
  Plus,
  Eye,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  mockMaintenanceStaff,
  mockComplaints,
  facilityTypes,
} from '@/data/mockData';
import { CreateMaintenanceModal } from '@/components/modal/CreateMaintenanceModal';

const StaffManagement = () => {
  const [staff, setStaff] = useState(mockMaintenanceStaff);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [pendingFacilityFilter, setPendingFacilityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [viewComplaintDialogOpen, setViewComplaintDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  // FIXED: Only show unassigned pending complaints
  const unassignedComplaints = useMemo(() => {
    return complaints.filter(
      complaint =>
        complaint.status === 'Pending' && !complaint.assignedMaintenance
    );
  }, [complaints]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFacility =
        facilityFilter === 'all' ||
        member.facilityTypes?.includes(facilityFilter);

      return matchesSearch && matchesFacility;
    });
  }, [staff, searchQuery, facilityFilter]);

  // FIXED: Filter for unassigned complaints only
  const filteredUnassignedComplaints = useMemo(() => {
    return unassignedComplaints.filter(complaint => {
      const matchesSearch =
        complaint.facilityType
          .toLowerCase()
          .includes(pendingSearchQuery.toLowerCase()) ||
        complaint.hostelName
          .toLowerCase()
          .includes(pendingSearchQuery.toLowerCase()) ||
        complaint.roomNumber
          .toLowerCase()
          .includes(pendingSearchQuery.toLowerCase()) ||
        complaint.studentName
          .toLowerCase()
          .includes(pendingSearchQuery.toLowerCase());

      const matchesFacility =
        pendingFacilityFilter === 'all' ||
        complaint.facilityType === pendingFacilityFilter;

      return matchesSearch && matchesFacility;
    });
  }, [unassignedComplaints, pendingSearchQuery, pendingFacilityFilter]);

  const getEligibleStaffForComplaint = complaint => {
    return staff
      .filter(member => member.facilityTypes?.includes(complaint.facilityType))
      .map(member => {
        const assignedCount = complaints.filter(
          c => c.assignedMaintenance === member.id && c.status !== 'Resolved'
        ).length;

        return {
          ...member,
          assignedCount,
        };
      })
      .sort((a, b) => a.assignedCount - b.assignedCount);
  };

  const handleCreateStaff = staffData => {
    const newStaff = {
      ...staffData,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      assignedComplaints: [],
      completedComplaints: [],
    };

    setStaff(prev => [...prev, newStaff]);
    setShowCreateModal(false);
    toast.success('Staff account created successfully!');
  };

  const handleViewComplaint = complaint => {
    setSelectedComplaint(complaint);
    setViewComplaintDialogOpen(true);
  };

  const handleAssignComplaint = complaint => {
    setSelectedComplaint(complaint);
    setAssignmentDialogOpen(true);
  };

  // FIXED: Keep status as 'Pending' when assigning, just set assignedMaintenance
  const assignToStaff = staffId => {
    if (selectedComplaint && staffId) {
      // Find the staff member
      const assignedStaff = staff.find(s => s.id === staffId);

      console.log(
        'Before update:',
        complaints.find(c => c.id === selectedComplaint.id)
      );

      // FIXED: Status remains 'Pending', only assign maintenance
      setComplaints(prevComplaints => {
        const updated = prevComplaints.map(complaint =>
          complaint.id === selectedComplaint.id
            ? {
                ...complaint,
                status: 'Pending', // ← KEEP as Pending
                assignedMaintenance: staffId,
                assignedDate: new Date().toISOString().split('T')[0], // ← Add assignment date
              }
            : complaint
        );

        console.log(
          'After update:',
          updated.find(c => c.id === selectedComplaint.id)
        );
        return updated;
      });

      // Show success notification with staff name
      toast.success(
        `Complaint assigned to ${assignedStaff?.name || 'staff member'}`
      );

      setAssignmentDialogOpen(false);
      setSelectedComplaint(null);
    }
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
      <Skeleton className="h-10 w-[120px] bg-gray-200" />
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
              Staff Management
            </h1>
            <p className="text-white/90">
              Manage maintenance staff and assign unassigned tasks
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList>
          <TabsTrigger
            value="staff"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Maintenance Staff ({filteredStaff.length})
          </TabsTrigger>
          <TabsTrigger
            value="unassigned"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Unassigned Tasks ({filteredUnassignedComplaints.length})
          </TabsTrigger>
        </TabsList>

        {/* Staff Management Tab */}
        <TabsContent value="staff">
          {/* Search and Filters - Single Row */}
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            {/* Left side - Search, Filters, Count */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="h-7">
                {filteredStaff.length} of {staff.length}
              </Badge>
            </div>

            {/* Right side - Add Staff button */}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>

          {/* Staff Table - Responsive with horizontal scroll */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">
                      Staff Member
                    </TableHead>
                    <TableHead className="min-w-[150px]">Contact</TableHead>
                    <TableHead className="min-w-[200px]">
                      Facility Types
                    </TableHead>
                    <TableHead className="min-w-[100px]">Workload</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map(member => {
                      const assignedCount = complaints.filter(
                        c =>
                          c.assignedMaintenance === member.id &&
                          c.status !== 'Resolved'
                      ).length;

                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-black whitespace-nowrap">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-600 whitespace-nowrap">
                                {member.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                {member.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-nowrap overflow-x-auto">
                              {member.facilityTypes?.slice(0, 3).map(type => (
                                <Badge
                                  key={type}
                                  variant="outline"
                                  className="text-xs whitespace-nowrap"
                                >
                                  {type}
                                </Badge>
                              ))}
                              {member.facilityTypes?.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs whitespace-nowrap"
                                >
                                  +{member.facilityTypes.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-purple-600 whitespace-nowrap">
                              {assignedCount} tasks
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-sm text-gray-600"
                      >
                        No staff members found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Unassigned Tasks Tab */}
        <TabsContent value="unassigned">
          {/* Search and Filters - Single Row */}
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            {/* Left side - Search, Filters, Count */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search unassigned tasks..."
                  value={pendingSearchQuery}
                  onChange={e => setPendingSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <Select
                value={pendingFacilityFilter}
                onValueChange={setPendingFacilityFilter}
              >
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="h-7">
                {filteredUnassignedComplaints.length} tasks
              </Badge>
            </div>
            <div></div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">
                      Complaint Date
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      Facility Type
                    </TableHead>
                    <TableHead className="min-w-[200px]">Location</TableHead>
                    <TableHead className="min-w-[200px]">
                      Recommended Staff
                    </TableHead>
                    <TableHead className="min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnassignedComplaints.length > 0 ? (
                    filteredUnassignedComplaints.map(complaint => {
                      const eligibleStaff =
                        getEligibleStaffForComplaint(complaint);

                      return (
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
                            <div className="flex gap-1 flex-nowrap overflow-x-auto">
                              {eligibleStaff.length > 0 ? (
                                eligibleStaff.slice(0, 2).map(staff => (
                                  <Badge
                                    key={staff.id}
                                    variant="outline"
                                    className="text-xs whitespace-nowrap"
                                  >
                                    {staff.name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-amber-600 whitespace-nowrap">
                                  No matching staff
                                </span>
                              )}
                            </div>
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAssignComplaint(complaint)
                                  }
                                  disabled={eligibleStaff.length === 0}
                                >
                                  Assign Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-sm text-gray-600"
                      >
                        No unassigned tasks available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Staff Modal - Using the existing component */}
      <CreateMaintenanceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateStaff}
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Maintenance Staff</DialogTitle>
            <DialogDescription>
              Select the best staff member for this task
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Task Details</h4>
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
                    <span className="font-medium">Location:</span>{' '}
                    {selectedComplaint.hostelName}
                  </div>
                  <div>
                    <span className="font-medium">Room:</span>{' '}
                    {selectedComplaint.roomNumber}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Recommended Staff</h4>
                {getEligibleStaffForComplaint(selectedComplaint).map(staff => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {staff.assignedCount} tasks
                        </Badge>
                        {staff.facilityTypes?.slice(0, 2).map(type => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => assignToStaff(staff.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
