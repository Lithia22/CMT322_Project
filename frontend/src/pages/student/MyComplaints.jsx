import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, MapPin, Calendar, AlertCircle, Plus } from 'lucide-react';
import { mockComplaints, facilityTypes } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const complaintSchema = z.object({
  facilityType: z.string().min(1, 'Please select a facility type'),
  issueDescription: z.string().min(10, 'Description must be at least 10 characters'),
});

const MyComplaints = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get complaints from localStorage first, then fallback to mockData
  const storedComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
  const allComplaints = storedComplaints.length > 0 ? storedComplaints : mockComplaints;
  
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
      photo: null,
      adminRemarks: ''
    };

    // Save to localStorage
    const existingComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
    existingComplaints.push(newComplaint);
    localStorage.setItem('mockComplaints', JSON.stringify(existingComplaints));

    toast.success('Complaint submitted successfully!');
    setDialogOpen(false);
    form.reset();
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Complaints</h2>
            <p className="text-white/90">Manage and track your submitted complaints</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-black">Submit New Complaint</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Report an issue with your hostel facility
                </DialogDescription>
              </DialogHeader>
              
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm">
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

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            className="min-h-24 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-2">
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

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Filters</CardTitle>
          <CardDescription className="text-gray-600">Search and filter your complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input 
                placeholder="Search by facility, issue, or hostel..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500" 
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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

            <div className="flex items-center justify-center bg-purple-50 rounded-md px-3 text-sm text-purple-700 font-medium border border-purple-100">
              Showing {filteredComplaints.length} of {studentComplaints.length}
            </div>
          </div>
        </CardContent>
      </Card>

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
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-black">Submit New Complaint</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Report an issue with your hostel facility
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Student Info */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm">
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

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                className="min-h-24 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3 pt-2">
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

                    {complaint.adminRemarks && (
                      <Alert className="mb-4 bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-800">
                          <p className="font-semibold mb-1">Admin Remarks:</p>
                          <p className="text-sm">{complaint.adminRemarks}</p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-2">
                    <p className="text-xs text-gray-500">ID: #{complaint.id}</p>
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