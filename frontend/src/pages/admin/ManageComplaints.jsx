import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, MapPin, Edit, Calendar } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm();

  const uniqueHostels = [...new Set(complaints.map(c => c.hostelName))];

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesHostel = hostelFilter === 'all' || complaint.hostelName === hostelFilter;
    return matchesSearch && matchesStatus && matchesHostel;
  });

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    form.reset({ status: complaint.status, adminRemarks: complaint.adminRemarks || '' });
    setDialogOpen(true);
  };

  const onSubmit = (data) => {
    setComplaints(prev => prev.map(c => 
      c.id === editingComplaint.id ? { ...c, ...data } : c
    ));
    setDialogOpen(false);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Resolved': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'outline';
    }
  };

  const getUrgencyVariant = (urgency) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Complaints</h2>
        <p className="text-muted-foreground">Update complaint status and add admin remarks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={hostelFilter} onValueChange={setHostelFilter}>
              <SelectTrigger>
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hostels</SelectItem>
                {uniqueHostels.map((hostel) => (
                  <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center bg-muted rounded-md px-3 text-sm">
              Showing {filteredComplaints.length} of {complaints.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID & Student</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Facility & Issue</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No complaints found
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">#{complaint.id}</p>
                        <p className="text-sm text-muted-foreground">{complaint.studentName}</p>
                        <p className="text-xs text-muted-foreground">{complaint.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{complaint.hostelName}</p>
                        <p className="text-sm text-muted-foreground">Room {complaint.roomNumber}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar size={12} className="mr-1" />
                          {complaint.submittedDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{complaint.facilityType}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{complaint.issueDescription}</p>
                      {complaint.adminRemarks && (
                        <p className="text-xs text-blue-600 mt-1">Remarks: {complaint.adminRemarks}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getUrgencyVariant(complaint.urgencyLevel)}>
                        {complaint.urgencyLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={dialogOpen && editingComplaint?.id === complaint.id} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setEditingComplaint(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(complaint)}>
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Complaint #{complaint.id}</DialogTitle>
                            <DialogDescription>Update status and add remarks</DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="adminRemarks"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Admin Remarks</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Add your remarks..." {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageComplaints;