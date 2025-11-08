import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const storedComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
  const allComplaints = storedComplaints.length > 0 ? storedComplaints : mockComplaints;
  
  const studentComplaints = allComplaints.filter(
    complaint => complaint.matricNumber === user?.matricNumber
  );

  const stats = {
    total: studentComplaints.length,
    pending: studentComplaints.filter(c => c.status === 'Pending').length,
    inProgress: studentComplaints.filter(c => c.status === 'In Progress').length,
    resolved: studentComplaints.filter(c => c.status === 'Resolved').length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'In Progress': return <AlertCircle className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-white/90">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Complaints</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">All submissions</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Pending</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.pending}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">In Progress</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.inProgress}</div>
            <p className="text-xs text-gray-600 mt-1">Being resolved</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Resolved</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.resolved}</div>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Facility</TableHead>
                <TableHead className="text-black">Issue</TableHead>
                <TableHead className="text-black">Date</TableHead>
                <TableHead className="text-black">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentComplaints.slice(0, 5).map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium text-black">{complaint.facilityType}</TableCell>
                  <TableCell className="text-gray-600">{complaint.issueDescription}</TableCell>
                  <TableCell className="text-gray-600">{complaint.submittedDate}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(complaint.status)} flex items-center gap-1 w-fit text-xs border`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {studentComplaints.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No complaints submitted yet. Go to "My Complaints" to submit your first complaint.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;