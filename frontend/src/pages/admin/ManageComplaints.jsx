import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, ArrowUpDown, Edit } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';

// TanStack React Table
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm();

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

  // Updated columns - all content properly left-aligned
  const columns = [
    {
      accessorKey: "submittedDate",
      header: ({ column }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-transparent font-medium"
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div className="text-sm font-medium">
            {complaint.submittedDate}
          </div>
        );
      },
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-transparent font-medium"
            >
              Student
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div>
            <p className="font-medium">{complaint.studentName}</p>
            <p className="text-sm text-muted-foreground">{complaint.studentId}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "hostelName",
      header: "Location",
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div>
            <p className="font-medium">{complaint.hostelName}</p>
            <p className="text-sm text-muted-foreground">Room {complaint.roomNumber}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "facilityType",
      header: ({ column }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-transparent font-medium"
            >
              Facility & Issue
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div>
            <p className="font-medium">{complaint.facilityType}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{complaint.issueDescription}</p>
            {complaint.adminRemarks ? (
              <p className="text-xs text-blue-600 mt-1 font-medium">Remarks: {complaint.adminRemarks}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">No Remarks</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "urgencyLevel",
      header: "Urgency",
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <Badge 
            variant={getUrgencyVariant(complaint.urgencyLevel)} 
            className="w-20"
          >
            {complaint.urgencyLevel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <Badge 
            variant={getStatusVariant(complaint.status)} 
            className="w-24"
          >
            {complaint.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const complaint = row.original;

        return (
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 px-2"
            onClick={() => {
              setEditingComplaint(complaint);
              form.reset({ 
                status: complaint.status, 
                adminRemarks: complaint.adminRemarks || '' 
              });
              setDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: complaints,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleEditSubmit = (data) => {
    setComplaints(prev => prev.map(c => 
      c.id === editingComplaint.id ? { ...c, ...data } : c
    ));
    setDialogOpen(false);
    setEditingComplaint(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all hostel facility complaints in one place
          </p>
        </div>
      </div>

      {/* PUT THIS RIGHT AFTER THE HEADER SECTION */}
<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
    <Input
      placeholder="Search by facility, issue, or student..."
      value={(table.getColumn("facilityType")?.getFilterValue() ?? "")}
      onChange={(event) =>
        table.getColumn("facilityType")?.setFilterValue(event.target.value)
      }
      className="pl-10"
    />
  </div>
  
  <Select
    value={(table.getColumn("status")?.getFilterValue() ?? "all")}
    onValueChange={(value) => 
      table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
    }
  >
    <SelectTrigger className="w-[180px]">
      <Filter className="mr-2 h-4 w-4" />
      <SelectValue placeholder="Filter status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="Pending">Pending</SelectItem>
      <SelectItem value="In Progress">In Progress</SelectItem>
      <SelectItem value="Resolved">Resolved</SelectItem>
    </SelectContent>
  </Select>

  <Select
    value={(table.getColumn("urgencyLevel")?.getFilterValue() ?? "all")}
    onValueChange={(value) => 
      table.getColumn("urgencyLevel")?.setFilterValue(value === "all" ? "" : value)
    }
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Urgency level" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Urgency</SelectItem>
      <SelectItem value="High">High</SelectItem>
      <SelectItem value="Medium">Medium</SelectItem>
      <SelectItem value="Low">Low</SelectItem>
    </SelectContent>
  </Select>
</div>
      {/* Complaints Table - All content properly left-aligned */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground">
                    No complaints found matching your filters.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
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
    </div>
  );
};

export default ManageComplaints;