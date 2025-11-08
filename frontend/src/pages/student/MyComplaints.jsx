import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, MapPin, Calendar, AlertCircle, Plus, Upload } from 'lucide-react';
import { mockComplaints, facilityTypes } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const complaintSchema = z.object({
  facilityType: z.string().min(1, 'Please select a facility type'),
  issueDescription: z.string().min(10, 'Description must be at least 10 characters'),
  photo: z.any().optional(),
});

const MyComplaints = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get stored complaints and merge with mock data
  const storedComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
  const allComplaints = [...mockComplaints, ...storedComplaints];
  
  const studentComplaints = allComplaints.filter(
    complaint => complaint.matricNumber === user?.matricNumber
  );

  const filteredComplaints = studentComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const form = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      facilityType: '',
      issueDescription: '',
    },
  });

  const onSubmit = (data) => {
    const newComplaint = {
      id: Date.now(),
      matricNumber: user.matricNumber,
      studentName: user.name,
      hostelName: user.hostelName,
      roomNumber: user.roomNumber,
      ...data,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      photo: data.photo ? data.photo.name : null,
      adminRemarks: ''
    };

    const existingComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
    existingComplaints.push(newComplaint);
    localStorage.setItem('mockComplaints', JSON.stringify(existingComplaints));

    toast.success('Complaint submitted successfully!');
    setDialogOpen(false);
    form.reset();
    window.location.reload(); // Refresh to show new complaint
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-xl p-6 text-white shadow-lg"
        style={{
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight">My Complaints</h2>
        <p className="text-white/90">Manage and track your submitted complaints</p>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <Input 
              placeholder="Search by facility, issue..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
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
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="secondary" className="h-7 whitespace-nowrap">
              {filteredComplaints.length} of {studentComplaints.length}
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
    <DialogTitle className="text-black">Submit New Complaint</DialogTitle>
    <DialogDescription className="text-gray-600">
      Report an issue with your hostel facility
    </DialogDescription>
  </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Student Info */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm">
    <div>
    <label className="font-medium text-gray-800">Student Name</label>
    <p className="text-gray-500">{user?.name}</p>
  </div>
  <div>
    <label className="font-medium text-gray-800">Matric Number</label>
    <p className="text-gray-500">{user?.matricNumber}</p>
  </div>
  <div>
    <label className="font-medium text-gray-800">Hostel</label>
    <p className="text-gray-500">{user?.hostelName}</p>
  </div>
  <div>
    <label className="font-medium text-gray-800">Room Number</label>
    <p className="text-gray-500">{user?.roomNumber}</p>
  </div>
</div>

                  <FormField
                    control={form.control}
                    name="facilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Facility Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                              <SelectValue placeholder="Select facility type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facilityTypes.map((type) => (
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
                    name="issueDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Issue Description</FormLabel>
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

                  {/* Photo Upload (Optional) */}
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="text-black">Upload Photo (Optional)</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              className="hidden"
                              id="photo-upload"
                              {...fieldProps}
                            />
                            <label htmlFor="photo-upload" className="cursor-pointer">
                              <span className="text-purple-600 hover:underline font-semibold">Choose a file</span>
                              <span className="text-gray-500"> or drag and drop</span>
                            </label>
                            {value && (
                              <p className="text-sm text-green-600 mt-2">
                                ✓ {value.name}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a photo to help us better understand the issue
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Submit Complaint
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
              {studentComplaints.length === 0 ? 'No Complaints Yet' : 'No Complaints Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {studentComplaints.length === 0 
                ? 'Get started by submitting your first complaint!' 
                : 'Try adjusting your filters or search terms'
              }
            </p>
            {studentComplaints.length === 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Your First Complaint
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle className="text-black">Submit New Complaint</DialogTitle>
    <DialogDescription className="text-gray-600">
      Report an issue with your hostel facility
    </DialogDescription>
  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm">
                        <div>
                          <label className="font-medium text-gray-700">Matric Number</label>
                          <p className="text-gray-900">{user?.matricNumber}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Hostel</label>
                          <p className="text-gray-900">{user?.hostelName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Room Number</label>
                          <p className="text-gray-900">{user?.roomNumber}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-700">Name</label>
                          <p className="text-gray-900">{user?.name}</p>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="facilityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black">Facility Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                                  <SelectValue placeholder="Select facility type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {facilityTypes.map((type) => (
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
                        name="issueDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black">Issue Description</FormLabel>
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
                        name="photo"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="text-black">Upload Photo (Optional)</FormLabel>
                            <FormControl>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => onChange(e.target.files?.[0])}
                                  className="hidden"
                                  id="photo-upload-2"
                                  {...fieldProps}
                                />
                                <label htmlFor="photo-upload-2" className="cursor-pointer">
                                  <span className="text-purple-600 hover:underline font-semibold">Choose a file</span>
                                  <span className="text-gray-500"> or drag and drop</span>
                                </label>
                                {value && (
                                  <p className="text-sm text-green-600 mt-2">
                                    ✓ {value.name}
                                  </p>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload a photo to help us better understand the issue
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Submit Complaint
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-black">{complaint.facilityType}</h3>
                        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
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
                      <Badge className={`${getStatusColor(complaint.status)} text-xs border`}>
                        {complaint.status}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4">{complaint.issueDescription}</p>

                    {complaint.adminRemarks ? (
                      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                        <p className="font-semibold mb-1 text-gray-800">Admin Remarks:</p>
                        <p className="text-sm text-gray-700">{complaint.adminRemarks}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No remarks</p>
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