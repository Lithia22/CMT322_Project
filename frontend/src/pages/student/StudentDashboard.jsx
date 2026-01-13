import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/complaints/my-complaints`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Complaints loaded:', result.complaints);
            setComplaints(result.complaints || []);

            // Calculate stats
            const statsData = {
              total: result.complaints?.length || 0,
              pending:
                result.complaints?.filter(c => c.status === 'pending')
                  ?.length || 0,
              inProgress:
                result.complaints?.filter(c => c.status === 'in_progress')
                  ?.length || 0,
              resolved:
                result.complaints?.filter(c => c.status === 'resolved')
                  ?.length || 0,
            };
            setStats(statsData);
          } else {
            toast.error(result.error || 'Failed to load complaints');
            setComplaints([]);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to load complaints');
          setComplaints([]);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load complaints: ' + error.message);
        setComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Fetch feedbacks from backend (you'll need to create this endpoint)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        // This endpoint needs to be created in your backend
        const response = await fetch(`${API_URL}/api/feedbacks/my-feedbacks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Feedbacks loaded:', result.feedbacks);
            setFeedbacks(result.feedbacks || []);
          } else {
            toast.error(result.error || 'Failed to load feedbacks');
            setFeedbacks([]);
          }
        } else {
          // If endpoint doesn't exist yet, use empty array
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setFeedbacks([]);
      }
    };

    fetchFeedbacks();
  }, []);

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusDisplay = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  // Skeleton components
  const HeaderSkeleton = () => (
    <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
      <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
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
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
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
          background:
            'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))',
        }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-white/90">
            Welcome back, {user?.name}. Let's make your hostel the best it can
            be!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Total Complaints
            </CardTitle>
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
            <CardTitle className="text-sm font-medium text-black">
              Pending
            </CardTitle>
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
            <CardTitle className="text-sm font-medium text-black">
              In Progress
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.inProgress}
            </div>
            <p className="text-xs text-gray-600 mt-1">Being resolved</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Resolved
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.resolved}
            </div>
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
              {complaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No complaints submitted yet. Go to "My Complaints" to submit
                  your first complaint.
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.slice(0, 5).map(complaint => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="font-medium text-black">
                          {complaint.facility_type || 'Unknown Facility'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Submitted: {complaint.submitted_date || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {complaint.issue_description}
                        </p>
                        {complaint.maintenance_remarks ? (
                          <p className="text-xs text-purple-700 mt-1">
                            <span className="font-semibold">Remarks:</span>{' '}
                            {complaint.maintenance_remarks}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">
                            No remarks
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-start w-24">
                        <Badge
                          className={`${getStatusColor(complaint.status)} pointer-events-none text-xs`}
                        >
                          {getStatusDisplay(complaint.status)}
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
              {feedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No feedback submitted yet. Go to "Feedback" to provide
                  feedback on resolved complaints.
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map(feedback => (
                    <div
                      key={feedback.id}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-black">
                            Complaint #{feedback.complaint_id}
                          </p>
                          <p className="text-sm text-gray-600">
                            Submitted:{' '}
                            {feedback.submitted_at
                              ? new Date(
                                  feedback.submitted_at
                                ).toLocaleDateString('en-MY')
                              : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {feedback.comment}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={20}
                              className={
                                star <= feedback.rating
                                  ? 'fill-purple-600 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
