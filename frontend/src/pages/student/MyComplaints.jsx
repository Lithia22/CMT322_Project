import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Filter, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const MyComplaints = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const studentComplaints = mockComplaints.filter(
    complaint => complaint.studentId === user?.studentId
  );

  const filteredComplaints = studentComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h2 className="text-2xl font-bold">My Complaints</h2>
        <p className="text-muted-foreground">Track the status of your submitted complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search complaints..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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

            <div className="flex items-center justify-center bg-muted rounded-md px-3 text-sm">
              Showing {filteredComplaints.length} of {studentComplaints.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {studentComplaints.length === 0 ? 'No Complaints Yet' : 'No Complaints Found'}
            </h3>
            <p className="text-muted-foreground">
              {studentComplaints.length === 0 
                ? 'Submit your first complaint to get started!' 
                : 'Try adjusting your filters or search terms'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{complaint.facilityType}</h3>
                        <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
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
                      <Badge variant={getUrgencyVariant(complaint.urgencyLevel)}>
                        {complaint.urgencyLevel}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">{complaint.issueDescription}</p>

                    {complaint.adminRemarks && (
                      <Alert className="mb-4">
                        <AlertDescription>
                          <p className="font-semibold mb-1">Admin Remarks:</p>
                          <p className="text-sm">{complaint.adminRemarks}</p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-2">
                    <Badge variant={getStatusVariant(complaint.status)} className="text-sm px-3 py-1">
                      {complaint.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">ID: #{complaint.id}</p>
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