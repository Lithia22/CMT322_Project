import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, MoreVertical, Edit, Trash, ImageIcon, ArrowUpDown } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { toast } from 'sonner';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyTab, setUrgencyTab] = useState('all');
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 items per page

  const form = useForm();

  // Count by urgency
  const totalComplaints = complaints.length;
  const highPriorityCount = complaints.filter(c => c.urgencyLevel === 'High').length;
  const mediumPriorityCount = complaints.filter(c => c.urgencyLevel === 'Medium').length;
  const lowPriorityCount = complaints.filter(c => c.urgencyLevel === 'Low').length;

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter(complaint => {
      const matchesSearch = 
        complaint.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.facilityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.hostelName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUrgency = urgencyTab === 'all' || complaint.urgencyLevel === urgencyTab;

      return matchesSearch && matchesUrgency;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const handleEditSubmit = (data) => {
    setComplaints(prev => prev.map(c => 
      c.id === editingComplaint.id ? { ...c, ...data } : c
    ));
    setDialogOpen(false);
    setEditingComplaint(null);
    toast.success('Complaint updated successfully!');
  };

  const handleDeleteComplaint = (complaint) => {
    setComplaintToDelete(complaint);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (complaintToDelete) {
      setComplaints(prev => prev.filter(c => c.id !== complaintToDelete.id));
      toast.success('Complaint deleted successfully!');
      setDeleteDialogOpen(false);
      setComplaintToDelete(null);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-500 text-white hover:bg-red-500';
      case 'Medium': return 'bg-yellow-500 text-white hover:bg-yellow-500';
      case 'Low': return 'bg-green-500 text-white hover:bg-green-500';
      default: return 'bg-gray-500 text-white hover:bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
        <p className="text-muted-foreground">Manage and track all hostel facility complaints</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by facility, issue, student, or hostel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="space-y-4">
        <Tabs value={urgencyTab} onValueChange={setUrgencyTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Complaints <span className="ml-2 text-xs text-muted-foreground">{totalComplaints}</span>
            </TabsTrigger>
            <TabsTrigger value="High">
              High Priority <span className="ml-2 text-xs text-muted-foreground">{highPriorityCount}</span>
            </TabsTrigger>
            <TabsTrigger value="Medium">
              Medium Priority <span className="ml-2 text-xs text-muted-foreground">{mediumPriorityCount}</span>
            </TabsTrigger>
            <TabsTrigger value="Low">
              Low Priority <span className="ml-2 text-xs text-muted-foreground">{lowPriorityCount}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('submittedDate')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('studentName')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Student
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('hostelName')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('facilityType')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Facility & Issue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('urgencyLevel')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Urgency
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('status')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="text-sm font-medium">
                      {complaint.submittedDate}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{complaint.studentName}</p>
                      <p className="text-sm text-muted-foreground">{complaint.studentId}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{complaint.hostelName}</p>
                      <p className="text-sm text-muted-foreground">Room {complaint.roomNumber}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{complaint.facilityType}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {complaint.issueDescription}
                      </p>
                    </TableCell>
                    <TableCell>
                      {complaint.adminRemarks ? (
                        <p className="text-sm">{complaint.adminRemarks}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No remarks</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getUrgencyColor(complaint.urgencyLevel)} w-20 justify-center`}>
                        {complaint.urgencyLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 w-24 justify-center">
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => {
                              setEditingComplaint(complaint);
                              form.reset({
                                status: complaint.status,
                                adminRemarks: complaint.adminRemarks || ''
                              });
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => {
                              setSelectedImage(complaint.photo);
                              setImageDialogOpen(true);
                            }}
                          >
                            <ImageIcon className="h-4 w-4" />
                            View Image
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteComplaint(complaint)}
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="text-muted-foreground">
                      No complaints found matching your filters.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

{/* Pagination */}
{filteredComplaints.length > itemsPerPage && (
  <div className="w-full">
    <Pagination className="w-full flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              isActive={currentPage === page}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
)}

</div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>
              Update the status and add remarks for {editingComplaint?.studentName}'s complaint
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
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
                      <Textarea
                        placeholder="Add your remarks or update about the complaint resolution..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-4">
              This action cannot be undone and will permanently remove the complaint from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Complaint
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Complaint Image</DialogTitle>
            <DialogDescription>
              Image uploaded by {selectedImage ? 'student' : 'No image available'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Complaint" 
                className="max-w-full max-h-[500px] rounded-lg object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
                <p>No image available for this complaint</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setImageDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageComplaints;