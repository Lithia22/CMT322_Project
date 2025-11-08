import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { mockComplaints, mockFeedbacks } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });
  
  // Get stored complaints and merge with mock data
  const storedComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
  const allComplaints = [...mockComplaints, ...storedComplaints];
  
  const studentComplaints = allComplaints.filter(
    complaint => complaint.matricNumber === user?.matricNumber
  );

  // Get stored feedbacks and merge with mock data
  const storedFeedbacks = JSON.parse(localStorage.getItem('mockFeedbacks') || '[]');
  const allFeedbacks = [...mockFeedbacks, ...storedFeedbacks];
  
  const studentFeedbacks = allFeedbacks.filter(
    feedback => feedback.matricNumber === user?.matricNumber
  );

  const stats = {
    total: studentComplaints.length,
    pending: studentComplaints.filter(c => c.status === 'Pending').length,
    inProgress: studentComplaints.filter(c => c.status === 'In Progress').length,
    resolved: studentComplaints.filter(c => c.status === 'Resolved').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Skeleton components
  const HeaderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-64 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const StatsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-2 border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20 bg-gray-200" />
            <Skeleton className="h-4 w-4 rounded-full bg-gray-200" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2 bg-gray-200" />
            <Skeleton className="h-3 w-24 bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TabsSkeleton = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 bg-gray-200" />
        <Skeleton className="h-10 w-32 bg-gray-200" />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-3 w-48 bg-gray-200" />
                  <Skeleton className="h-3 w-64 bg-gray-200" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <StatsSkeleton />
        <TabsSkeleton />
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-white/90">
            Welcome back, {user?.name}. Let's make {user?.hostelName} the best it can be!
          </p>
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

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList>
          <TabsTrigger 
            value="complaints"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Recent Complaints
          </TabsTrigger>
          <TabsTrigger 
            value="feedback"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            My Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <Card>
            <CardContent className="pt-6">
              {studentComplaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No complaints submitted yet. Go to "My Complaints" to submit your first complaint.
                </div>
              ) : (
                <div className="space-y-4">
                  {studentComplaints.slice(0, 5).map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium text-black">{complaint.facilityType}</p>
                        <p className="text-sm text-gray-600">
                          {complaint.hostelName} • Room {complaint.roomNumber}
                        </p>
                        <p className="text-xs text-gray-500">{complaint.issueDescription}</p>
                        {complaint.adminRemarks ? (
                          <p className="text-xs text-purple-700 mt-1">
                            <span className="font-semibold">Remarks:</span> {complaint.adminRemarks}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">No remarks</p>
                        )}
                      </div>
                      <div className="flex items-center justify-start w-24">
                        <Badge className={`${getStatusColor(complaint.status)} text-xs`}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardContent className="pt-6">
              {studentFeedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No feedback submitted yet. Go to "Feedback" to provide feedback on resolved complaints.
                </div>
              ) : (
                <div className="space-y-4">
                  {studentFeedbacks.map((feedback) => {
                    const complaint = allComplaints.find(c => c.id === feedback.complaintId);
                    return (
                      <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <p className="font-medium text-black">
                              {complaint?.facilityType || 'Unknown Facility'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {complaint?.hostelName || 'Unknown'} • Room {complaint?.roomNumber || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">{feedback.comment}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={20}
                                className={star <= feedback.rating ? 'fill-purple-600 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;