import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertCircle,
  Plus,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const complaintSchema = z.object({
  facility_type_id: z.string().min(1, 'Please select a facility type'),
  issue_description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  photo_url: z.any().optional(),
  priority: z.string().optional(),
});

// Facility type mapping based on your database
const facilityTypeMapping = {
  'Air Conditioner': 1,
  Bathroom: 2,
  Furniture: 3,
  Electrical: 4,
  Plumbing: 5,
  'Door/Window': 6,
  Lighting: 7,
  Others: 8,
};

// Reverse mapping for display
const idToFacilityType = {
  1: 'Air Conditioner',
  2: 'Bathroom',
  3: 'Furniture',
  4: 'Electrical',
  5: 'Plumbing',
  6: 'Door/Window',
  7: 'Lighting',
  8: 'Others',
};

// Facility types for the dropdown (sorted alphabetically)
const facilityTypes = [
  'Air Conditioner',
  'Bathroom',
  'Door/Window',
  'Electrical',
  'Furniture',
  'Lighting',
  'Plumbing',
  'Others',
];

const MyComplaints = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [hostelInfo, setHostelInfo] = useState(null);
  const [loadingHostel, setLoadingHostel] = useState(false);

  // Fetch hostel information based on user's hostel_id
  useEffect(() => {
    const fetchHostelInfo = async () => {
      if (!user?.hostel_id) {
        console.log('No hostel_id found for user');
        return;
      }

      try {
        setLoadingHostel(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${API_URL}/api/hostels/${user.hostel_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Hostel info loaded:', result.hostel);
            setHostelInfo(result.hostel);
          } else {
            console.warn('Failed to load hostel info:', result.error);
          }
        }
      } catch (error) {
        console.error('Error fetching hostel info:', error);
      } finally {
        setLoadingHostel(false);
      }
    };

    fetchHostelInfo();
  }, [user?.hostel_id]);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/complaints/my-complaints`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Complaints loaded:', result.complaints);
            setComplaints(result.complaints || []);
          } else {
            toast.error(result.error || 'Failed to load complaints');
            setComplaints([]);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to load complaints');
          setComplaints([]);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load complaints: ' + error.message);
        setComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      (complaint.facility_type || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (complaint.issue_description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (complaint.status &&
        complaint.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const form = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      facility_type_id: '',
      issue_description: '',
      priority: 'medium',
    },
  });

  const onSubmit = async data => {
    setIsSubmitting(true);

    try {
      // Get facility type ID from mapping
      const facilityTypeId = facilityTypeMapping[data.facility_type_id] || 8;

      console.log('🔍 Selected facility type:', data.facility_type_id);
      console.log('🔍 Mapped to ID:', facilityTypeId);

      // Prepare complaint data for API
      const complaintData = {
        issue_description: data.issue_description,
        facility_type_id: facilityTypeId,
        priority: data.priority || 'medium',
        photo_url: null, // You can implement file upload later
      };

      console.log('📤 Sending to API:', complaintData);

      // Send to backend API
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(complaintData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Complaint saved to database:', result.complaint);

        // Add new complaint to state
        const newComplaint = {
          ...result.complaint,
          facility_type:
            idToFacilityType[result.complaint.facility_type_id] || 'Unknown',
          submitted_date: result.complaint.submitted_at
            ? new Date(result.complaint.submitted_at).toLocaleDateString(
                'en-MY'
              )
            : 'N/A',
        };

        setComplaints(prev => [newComplaint, ...prev]);
        toast.success('Complaint submitted successfully!');
      } else {
        console.error('API error:', result.error);
        toast.error(result.error || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit complaint. Please try again.');
    }

    form.reset();
    setDialogOpen(false);
    setIsSubmitting(false);
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusDisplay = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  // Function to display hostel information
  const getHostelDisplay = () => {
    if (loadingHostel) {
      return 'Loading...';
    }

    if (hostelInfo?.name) {
      return hostelInfo.name;
    }

    if (user?.hostel_id) {
      return `Hostel ID: ${user.hostel_id}`;
    }

    return 'Not assigned';
  };

  // Skeleton Components
  const HeaderSkeleton = () => (
    <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
      <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const SearchSkeleton = () => (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <Skeleton className="h-9 flex-1 max-w-lg bg-gray-200" />
      <div className="flex gap-3 items-center w-full sm:w-auto justify-between sm:justify-start">
        <Skeleton className="h-9 w-[180px] bg-gray-200" />
        <Skeleton className="h-7 w-24 bg-gray-200" />
      </div>
      <Skeleton className="h-9 w-32 bg-gray-200" />
    </div>
  );

  const ComplaintCardSkeleton = () => (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-gray-200" />
                <Skeleton className="h-4 w-48 bg-gray-200" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-full mb-4 bg-gray-200" />
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <SearchSkeleton />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ComplaintCardSkeleton key={i} />
          ))}
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
        <h2 className="text-3xl font-bold tracking-tight">My Complaints</h2>
        <p className="text-white/90">
          Manage and track your submitted complaints
        </p>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:max-w-lg">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={16}
            />
            <Input
              placeholder="Search by facility, issue..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500 w-full"
            />
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto justify-between sm:justify-start">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="secondary" className="h-7 whitespace-nowrap">
              {filteredComplaints.length} of {complaints.length}
            </Badge>
          </div>
        </div>

        <div className="sm:ml-auto w-full sm:w-auto">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 text-white hover:bg-purple-700 h-9 whitespace-nowrap w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-black">
                  Submit New Complaint
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Report an issue with your hostel facility
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Student Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm">
                    <div>
                      <label className="font-medium text-gray-800">
                        Student Name
                      </label>
                      <p className="text-gray-500">
                        {user?.name || 'Not available'}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-800">
                        Matric Number
                      </label>
                      <p className="text-gray-500">
                        {user?.matricNumber ||
                          user?.matric_num ||
                          'Not available'}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-800">
                        Hostel
                      </label>
                      <p className="text-gray-500">{getHostelDisplay()}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-800">
                        Room Number
                      </label>
                      <p className="text-gray-500">
                        {user?.room_number || 'Not available'}
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="facility_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          Facility Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                              <SelectValue placeholder="Select facility type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facilityTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issue_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          Issue Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the issue in detail..."
                            className="min-h-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          Priority Level
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How urgent is this issue?
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">
              {complaints.length === 0
                ? 'No Complaints Yet'
                : 'No Complaints Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {complaints.length === 0
                ? 'Get started by submitting your first complaint!'
                : 'Try adjusting your filters or search terms'}
            </p>
            {complaints.length === 0 && (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit First Complaint
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map(complaint => (
            <Card
              key={complaint.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-black">
                          {complaint.facility_type || 'Unknown Facility'}
                        </h3>
                        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {complaint.submitted_date || 'N/A'}
                          </span>
                          {complaint.priority && (
                            <Badge variant="outline" className="text-xs">
                              Priority: {complaint.priority}
                            </Badge>
                          )}
                          {complaint.hostel_name && (
                            <span className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {complaint.hostel_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusColor(complaint.status)} pointer-events-none text-xs border`}
                      >
                        {getStatusDisplay(complaint.status)}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {complaint.issue_description}
                    </p>

                    {complaint.maintenance_remarks ? (
                      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                        <p className="font-semibold mb-1 text-gray-800">
                          Maintenance Remarks:
                        </p>
                        <p className="text-sm text-gray-700">
                          {complaint.maintenance_remarks}
                        </p>
                      </div>
                    ) : null}

                    {complaint.assigned_maintenance && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Assigned to:</span>{' '}
                        {complaint.assigned_maintenance}
                        {complaint.assigned_maintenance_phone && (
                          <span className="ml-2">
                            📞 {complaint.assigned_maintenance_phone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
