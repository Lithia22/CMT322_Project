import { API_URL } from '@/config/api';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AssignMaintenanceModal } from '@/components/modal/AssignMaintenanceModal';
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
import { Search, MoreVertical, Calendar, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  mockComplaints,
  facilityTypes as mockFacilityTypes,
} from '@/data/mockData';
import { CreateMaintenanceModal } from '@/components/modal/CreateMaintenanceModal';
import { useAuth } from '@/contexts/AuthContext';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [pendingFacilityFilter, setPendingFacilityFilter] = useState('all');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [viewComplaintDialogOpen, setViewComplaintDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        // Fetch staff
        const staffResponse = await fetch('${API_URL}/api/auth/staff', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (staffResponse.ok) {
          const staffResult = await staffResponse.json();
          if (staffResult.success) {
            setStaff(staffResult.staff || []);
          }
        }

        // Fetch facility types
        const facilityResponse = await fetch(
          '${API_URL}/api/auth/facility-types',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (facilityResponse.ok) {
          const facilityResult = await facilityResponse.json();
          if (facilityResult.success) {
            setFacilityTypes(facilityResult.facility_types || []);
          }
        }

        // Fetch complaints
        const complaintsResponse = await fetch('${API_URL}/api/complaints', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (complaintsResponse.ok) {
          const complaintsResult = await complaintsResponse.json();
          if (complaintsResult.success) {
            setComplaints(complaintsResult.complaints || []);
          } else {
            setComplaints(mockComplaints); // Fallback
          }
        } else {
          setComplaints(mockComplaints); // Fallback
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        setComplaints(mockComplaints); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle create staff
  const handleCreateStaff = async staffData => {
    try {
      const token = localStorage.getItem('token');

      // Create name-to-ID mapping based on your facility_types table
      const nameToIdMap = {
        'Air Conditioner': 1,
        Bathroom: 2,
        Furniture: 3,
        Electrical: 4,
        Plumbing: 5,
        'Door/Window': 6,
        Lighting: 7,
        Others: 8,
      };

      // Convert facility type names to IDs
      const facilityTypeIds = staffData.facilityTypes.map(
        name => nameToIdMap[name]
      );

      const payload = {
        name: staffData.name,
        email: staffData.email,
        password: staffData.password,
        phone: staffData.phone,
        specialty: staffData.specialty || '',
        facility_type_ids: facilityTypeIds,
      };

      const response = await fetch('${API_URL}/api/auth/register-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Add new staff to state
        setStaff(prev => [result.staff, ...prev]);
        setShowCreateModal(false);
        toast.success('Staff account created successfully!');
      } else {
        toast.error(result.error || 'Failed to create staff');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error('Failed to create staff account');
    }
  };

  // Only show unassigned && pending complaints
  const unassignedComplaints = useMemo(() => {
    return complaints.filter(
      complaint =>
        (complaint.status === 'Pending' || complaint.status === 'pending') &&
        !complaint.assigned_maintenance_id
    );
  }, [complaints]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch =
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFacility =
        facilityFilter === 'all' ||
        member.facility_types?.includes(facilityFilter);

      return matchesSearch && matchesFacility;
    });
  }, [staff, searchQuery, facilityFilter]);

  // Filter for unassigned complaints only
  const filteredUnassignedComplaints = useMemo(() => {
    return unassignedComplaints.filter(complaint => {
      const matchesSearch =
        complaint.facility_type
          ?.toLowerCase()
          .includes(pendingSearchQuery.toLowerCase()) ||
        complaint.hostel_name
          ?.toLowerCase()
          .includes(pendingSearchQuery.toLowerCase()) ||
        (complaint.room_number?.toString() || '').includes(
          pendingSearchQuery.toLowerCase()
        ) ||
        complaint.student_name
          ?.toLowerCase()
          .includes(pendingSearchQuery.toLowerCase());

      const matchesFacility =
        pendingFacilityFilter === 'all' ||
        complaint.facility_type === pendingFacilityFilter;

      return matchesSearch && matchesFacility;
    });
  }, [unassignedComplaints, pendingSearchQuery, pendingFacilityFilter]);

  const getEligibleStaffForComplaint = complaint => {
    return staff
      .filter(member => {
        // Check if staff has the required facility type specialty
        return member.facility_types?.some(
          facilityType => facilityType === complaint.facility_type
        );
      })
      .map(member => {
        // Count current workload from backend data - FIXED LOGIC
        const assignedCount = complaints.filter(
          c =>
            c.assigned_maintenance_id === member.id &&
            (c.status === 'in_progress' || c.status === 'pending')
        ).length;

        return {
          ...member,
          assignedCount,
        };
      })
      .sort((a, b) => a.assignedCount - b.assignedCount);
  };

  const handleViewComplaint = complaint => {
    setSelectedComplaint(complaint);
    setViewComplaintDialogOpen(true);
  };

  const handleAssignComplaint = complaint => {
    setSelectedComplaint(complaint);
    setAssignmentDialogOpen(true);
  };

  const assignToStaff = async staffId => {
    if (selectedComplaint && staffId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${API_URL}/api/complaints/${selectedComplaint.id}/assign`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              assigned_maintenance_id: staffId,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Update complaints state
            setComplaints(prev =>
              prev.map(complaint =>
                complaint.id === selectedComplaint.id
                  ? result.complaint
                  : complaint
              )
            );

            const assignedStaff = staff.find(s => s.id === staffId);
            toast.success(
              result.message ||
                `Complaint assigned to ${assignedStaff?.name || 'staff member'}`
            );
            setAssignmentDialogOpen(false);
            setSelectedComplaint(null);
          } else {
            toast.error(result.error || 'Failed to assign complaint');
          }
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to assign complaint');
        }
      } catch (error) {
        console.error('Error assigning complaint:', error);
        toast.error('Failed to assign complaint');
      }
    }
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in progress':
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Calculate staff workload function
  const calculateStaffWorkload = staffId => {
    if (!staffId) return 0;

    return complaints.filter(
      complaint =>
        complaint.assigned_maintenance_id === staffId &&
        complaint.status !== 'resolved'
    ).length;
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

  // Get unique facility types for filter dropdown
  const allFacilityTypes = Array.from(
    new Set([...facilityTypes.map(ft => ft.name), ...mockFacilityTypes])
  ).sort();

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
          <TabsTrigger
            value="complaints"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Complaint Status (
            {complaints.filter(c => c.assigned_maintenance_id).length})
          </TabsTrigger>
        </TabsList>

        {/* Staff Management Tab */}
        <TabsContent value="staff">
          {/* Search and Filters */}
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
                  {allFacilityTypes.map(type => (
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

          {/* Staff Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">
                      Staff Member
                    </TableHead>
                    <TableHead className="min-w-[150px]">Contact</TableHead>
                    <TableHead className="min-w-[100px]">Specialty</TableHead>
                    <TableHead className="min-w-[200px]">
                      Facility Types
                    </TableHead>
                    <TableHead className="min-w-[100px]">Workload</TableHead>
                    <TableHead className="min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map(member => {
                      // FIXED: Calculate workload correctly
                      const assignedCount = calculateStaffWorkload(member.id);

                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-black whitespace-nowrap">
                                {member.name}
                                {member.status !== 'active' && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs"
                                  >
                                    {member.status}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 whitespace-nowrap">
                                {member.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 whitespace-nowrap">
                              {member.phone || 'Not set'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 whitespace-nowrap">
                              {member.specialty || 'General'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-nowrap overflow-x-auto">
                              {member.facility_types
                                ?.slice(0, 3)
                                .map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs whitespace-nowrap"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              {member.facility_types?.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs whitespace-nowrap"
                                >
                                  +{member.facility_types.length - 3}
                                </Badge>
                              )}
                              {(!member.facility_types ||
                                member.facility_types.length === 0) && (
                                <span className="text-xs text-gray-400">
                                  None
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-medium whitespace-nowrap ${
                                assignedCount === 0
                                  ? 'text-gray-500'
                                  : assignedCount <= 2
                                    ? 'text-green-600'
                                    : assignedCount <= 4
                                      ? 'text-amber-600'
                                      : 'text-red-600'
                              }`}
                            >
                              {assignedCount}{' '}
                              {assignedCount === 1 ? 'task' : 'tasks'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewComplaint(member)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
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
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
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
                  {allFacilityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="h-7">
                {filteredUnassignedComplaints.length} unassigned tasks
              </Badge>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Date</TableHead>
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
                              {complaint.submitted_date ||
                                complaint.submittedDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs whitespace-nowrap"
                            >
                              {complaint.facility_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-black whitespace-nowrap">
                                {complaint.hostel_name || complaint.hostelName}
                              </div>
                              <div className="text-gray-600 whitespace-nowrap">
                                Room{' '}
                                {complaint.room_number || complaint.roomNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-nowrap overflow-x-auto">
                              {eligibleStaff.length > 0 ? (
                                eligibleStaff.slice(0, 2).map(staffMember => (
                                  <Badge
                                    key={staffMember.id}
                                    variant="outline"
                                    className="text-xs whitespace-nowrap"
                                  >
                                    {staffMember.name} (
                                    {staffMember.assignedCount})
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

        {/* Complaint Timeline Tab */}
        <TabsContent value="complaints">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Select
                value={complaintStatusFilter}
                onValueChange={setComplaintStatusFilter}
              >
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="h-7">
                {complaints.filter(c => c.assigned_maintenance_id).length}{' '}
                assigned complaints
              </Badge>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Student</TableHead>
                    <TableHead className="min-w-[150px]">
                      Facility Type
                    </TableHead>
                    <TableHead className="min-w-[150px]">Assigned To</TableHead>
                    <TableHead className="min-w-[120px]">Contact</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints
                    .filter(
                      complaint =>
                        complaint.assigned_maintenance_id &&
                        (complaintStatusFilter === 'all' ||
                          complaint.status?.toLowerCase() ===
                            complaintStatusFilter.toLowerCase())
                    )
                    .map(complaint => {
                      const assignedStaff = staff.find(
                        s => s.id === complaint.assigned_maintenance_id
                      );

                      return (
                        <TableRow key={complaint.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-black whitespace-nowrap">
                                {complaint.student_name ||
                                  complaint.studentName}
                              </div>
                              <div className="text-sm text-gray-600 whitespace-nowrap">
                                {complaint.hostel_name || complaint.hostelName}{' '}
                                - Room{' '}
                                {complaint.room_number || complaint.roomNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {complaint.facility_type || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 whitespace-nowrap">
                              {assignedStaff?.name || 'Unassigned'}
                            </div>
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {assignedStaff?.specialty || ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 whitespace-nowrap">
                              {assignedStaff?.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(complaint.status)} pointer-events-none text-xs`}
                            >
                              {complaint.status === 'in_progress'
                                ? 'In Progress'
                                : complaint.status === 'pending'
                                  ? 'Pending'
                                  : complaint.status === 'resolved'
                                    ? 'Resolved'
                                    : complaint.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewComplaint(complaint)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Staff Modal */}
      <CreateMaintenanceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateStaff}
        facilityTypes={allFacilityTypes}
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
                    {selectedComplaint.facility_type ||
                      selectedComplaint.facilityType}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {selectedComplaint.submitted_date ||
                      selectedComplaint.submittedDate}
                  </div>
                  <div>
                    <span className="font-medium">Hostel:</span>{' '}
                    {selectedComplaint.hostel_name ||
                      selectedComplaint.hostelName}
                  </div>
                  <div>
                    <span className="font-medium">Room:</span>{' '}
                    {selectedComplaint.room_number ||
                      selectedComplaint.roomNumber}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Student:</span>{' '}
                    {selectedComplaint.student_name ||
                      selectedComplaint.studentName}
                  </div>
                </div>
                <div className="text-sm pt-2 border-t">
                  <span className="font-medium">Issue:</span>
                  <p className="text-gray-600 mt-1">
                    {selectedComplaint.issue_description ||
                      selectedComplaint.issueDescription}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog - Using the new modal */}
      <AssignMaintenanceModal
        open={assignmentDialogOpen}
        onClose={() => {
          setAssignmentDialogOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onAssign={updatedComplaint => {
          // Update complaints list
          setComplaints(prev =>
            prev.map(complaint =>
              complaint.id === updatedComplaint.id
                ? updatedComplaint
                : complaint
            )
          );
        }}
      />
    </div>
  );
};

export default StaffManagement;
