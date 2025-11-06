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
  const [urgencyTab, setUrgencyTab] = useState('all');
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
  const highPriorityCount = complaints.filter(c => c.urgencyLevel === 'High').length;
  const mediumPriorityCount = complaints.filter(c => c.urgencyLevel === 'Medium').length;
  const lowPriorityCount = complaints.filter(c => c.urgencyLevel === 'Low').length;

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
        complaint.hostelName?.toLowerCase().includes(searchQuery.toLowerCase());
      
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
      case 'High': return 'bg-red-500 hover:bg-red-500';
      case 'Medium': return 'bg-amber-500 hover:bg-amber-500';
      case 'Low': return 'bg-green-500 hover:bg-green-500';
      default: return 'bg-gray-500 hover:bg-gray-500';
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

  // Skeleton components with gray background
  const HeaderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-64 bg-muted" />
      <Skeleton className="h-4 w-96 bg-muted" />
    </div>
  );

  const SearchSkeleton = () => (
    <Skeleton className="h-10 w-full max-w-md bg-muted" />
  );

  const TabsSkeleton = () => (
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-32 bg-muted" />
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Table Header Skeleton */}
          <div className="flex gap-4 border-b pb-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1 bg-muted" />
            ))}
          </div>
          
          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
              {[...Array(7)].map((_, cellIndex) => (
                <div key={cellIndex} className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full bg-muted" />
                  {cellIndex === 1 || cellIndex === 2 || cellIndex === 3 ? (
                    <Skeleton className="h-3 w-3/4 bg-muted" />
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
        <Skeleton key={i} className="h-10 w-10 bg-muted" />
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
        <p className="text-muted-foreground">Manage and track hostel facility complaints</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by facility, issue, student, or hostel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Urgency Tabs */}
      <Tabs value={urgencyTab} onValueChange={setUrgencyTab}>
        <TabsList>
          <TabsTrigger value="all">
            All <span className="ml-1.5 text-xs">({totalComplaints})</span>
          </TabsTrigger>
          <TabsTrigger value="High">
            High <span className="ml-1.5 text-xs">({highPriorityCount})</span>
          </TabsTrigger>
          <TabsTrigger value="Medium">
            Medium <span className="ml-1.5 text-xs">({mediumPriorityCount})</span>
          </TabsTrigger>
          <TabsTrigger value="Low">
            Low <span className="ml-1.5 text-xs">({lowPriorityCount})</span>
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
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Date <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('studentName')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Student <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('hostelName')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Location <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('facilityType')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Issue <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-24">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('urgencyLevel')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Priority <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-28">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
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
<TableCell className="text-sm text-muted-foreground">
  {new Date(complaint.submittedDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })}
</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{complaint.studentName}</div>
                      <div className="text-xs text-muted-foreground">{complaint.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{complaint.hostelName}</div>
                      <div className="text-xs text-muted-foreground">Room {complaint.roomNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium">{complaint.facilityType}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {complaint.issueDescription}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getUrgencyColor(complaint.urgencyLevel)} text-white text-xs`}>
                      {complaint.urgencyLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(complaint.status)} text-xs`}>
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedImage(complaint.photo);
                            setImageDialogOpen(true);
                          }}
                        >
                          View Image
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteComplaint(complaint)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
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

      {/* Edit Complaint Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Complaint</DialogTitle>
            <DialogDescription>
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add your remarks or update about the complaint resolution"
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={form.handleSubmit(handleEditSubmit)}>Save</Button>
              </div>
            </div>
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
                <Image className="h-12 w-12" />
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