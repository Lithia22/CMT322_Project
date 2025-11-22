import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MoreVertical, Edit, Trash, Image, ArrowUpDown } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { toast } from 'sonner';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm();

  const loadComplaints = () => {
    setIsLoading(true);
    setTimeout(() => {
      setComplaints(mockComplaints);
      setIsLoading(false);
    }, 1500);
  };

  useState(() => {
    loadComplaints();
  });

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredComplaints = complaints
    .filter(complaint => {
      const matchesSearch = 
        complaint.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.facilityType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.issueDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.hostelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.matricNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-50 text-green-700 hover:bg-green-50';
      case 'In Progress': return 'bg-blue-50 text-blue-700 hover:bg-blue-50';
      case 'Pending': return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
      default: return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
    }
  };

  // Skeleton components
  const HeaderSkeleton = () => (
      <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
        <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
        <Skeleton className="h-4 w-96 bg-gray-200" />
      </div>
  );

  const SearchSkeleton = () => (
    <Skeleton className="h-10 w-full max-w-md bg-gray-200" />
  );

  const TabsSkeleton = () => (
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-32 bg-gray-200" />
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4 border-b pb-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1 bg-gray-200" />
            ))}
          </div>
          
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
              {[...Array(6)].map((_, cellIndex) => (
                <div key={cellIndex} className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  {cellIndex === 1 || cellIndex === 2 || cellIndex === 3 ? (
                    <Skeleton className="h-3 w-3/4 bg-gray-200" />
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const PaginationSkeleton = () => (
    <div className="flex justify-end gap-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-10 bg-gray-200" />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <SearchSkeleton />
        <TabsSkeleton />
        <TableSkeleton />
        <PaginationSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-xl p-6 text-white shadow-lg"
        style={{
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
        <p className="text-white/90">Manage and track hostel facility complaints</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by facility, issue, student, matric, or hostel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger 
            value="all"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            All <span className="ml-1.5 text-xs">({totalComplaints})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Pending"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Pending <span className="ml-1.5 text-xs">({pendingCount})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="In Progress"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            In Progress <span className="ml-1.5 text-xs">({inProgressCount})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Resolved"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Resolved <span className="ml-1.5 text-xs">({resolvedCount})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Complaints Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('submittedDate')}
                  className="h-auto p-0 font-medium hover:bg-transparent text-black"
                >
                  Date <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('studentName')}
                  className="h-auto p-0 font-medium hover:bg-transparent text-black"
                >
                  Student <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('hostelName')}
                  className="h-auto p-0 font-medium hover:bg-transparent text-black"
                >
                  Location <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('facilityType')}
                  className="h-auto p-0 font-medium hover:bg-transparent text-black"
                >
                  Issue <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-28">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 font-medium hover:bg-transparent text-black"
                >
                  Status <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(complaint.submittedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm text-black">{complaint.studentName}</div>
                      <div className="text-xs text-gray-600">{complaint.matricNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-black">{complaint.hostelName}</div>
                      <div className="text-xs text-gray-600">Room {complaint.roomNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-black">{complaint.facilityType}</div>
                      <div className="text-xs text-gray-600 line-clamp-1">
                        {complaint.issueDescription}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(complaint.status)} text-xs border`}>
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-purple-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingComplaint(complaint);
                            form.reset({
                              status: complaint.status,
                              adminRemarks: complaint.adminRemarks || ''
                            });
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedImage(complaint.photo);
                            setImageDialogOpen(true);
                          }}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          View Image
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:bg-red-50 focus:text-red-700"
                          onClick={() => handleDeleteComplaint(complaint)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-gray-600">
                  No complaints found
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
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-purple-700 hover:text-purple-900"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer ${
                      currentPage === page 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'text-purple-700 hover:text-purple-900'
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer text-purple-700 hover:text-purple-900"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Complaint Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Update Complaint</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update status and remarks for this complaint
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue />
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
                    <FormLabel className="text-black">Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add your remarks or update about the complaint resolution"
                        className="min-h-24 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={form.handleSubmit(handleEditSubmit)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-black">
              <Trash className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-4 text-gray-600">
              This action cannot be undone and will permanently remove the complaint from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
            <DialogTitle className="text-black">Complaint Image</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Complaint" 
                className="max-w-full max-h-[500px] rounded-lg object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <Image className="h-12 w-12" />
                <p>No image available for this complaint</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageComplaints;