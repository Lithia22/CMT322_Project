import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Star,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    avgResolutionTime: 0,
    trend: 0
  });
  const [facilityStats, setFacilityStats] = useState([]);
  const [hostelStats, setHostelStats] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/complaints', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Complaints loaded:', result.complaints.length);
            setComplaints(result.complaints || []);
            
            // Calculate statistics
            calculateStats(result.complaints);
            calculateFacilityStats(result.complaints);
            calculateHostelStats(result.complaints);
            calculateTimeSeriesData(result.complaints);
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

  const calculateStats = (complaintsData) => {
    const total = complaintsData.length;
    const pending = complaintsData.filter(c => c.status === 'pending').length;
    const in_progress = complaintsData.filter(c => c.status === 'in_progress').length;
    const resolved = complaintsData.filter(c => c.status === 'resolved').length;
    
    // Calculate average resolution time
    const resolvedComplaints = complaintsData.filter(c => c.status === 'resolved' && c.resolution_date && c.submitted_at);
    let totalResolutionTime = 0;
    
    resolvedComplaints.forEach(complaint => {
      const submitted = new Date(complaint.submitted_at);
      const resolved = new Date(complaint.resolution_date);
      const diffDays = Math.ceil((resolved - submitted) / (1000 * 60 * 60 * 24));
      totalResolutionTime += diffDays;
    });
    
    const avgResolutionTime = resolvedComplaints.length > 0 
      ? Math.round(totalResolutionTime / resolvedComplaints.length) 
      : 0;
    
    // Calculate trend (comparing last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const recentComplaints = complaintsData.filter(c => 
      new Date(c.submitted_at) >= thirtyDaysAgo
    ).length;
    
    const previousComplaints = complaintsData.filter(c => 
      new Date(c.submitted_at) >= sixtyDaysAgo && new Date(c.submitted_at) < thirtyDaysAgo
    ).length;
    
    const trend = previousComplaints > 0 
      ? Math.round(((recentComplaints - previousComplaints) / previousComplaints) * 100)
      : recentComplaints > 0 ? 100 : 0;
    
    setStats({
      total,
      pending,
      in_progress,
      resolved,
      avgResolutionTime,
      trend
    });
  };

  const calculateFacilityStats = (complaintsData) => {
    const facilityMap = {};
    
    complaintsData.forEach(complaint => {
      const facilityType = complaint.facility_type || 'Unknown';
      if (!facilityMap[facilityType]) {
        facilityMap[facilityType] = 0;
      }
      facilityMap[facilityType]++;
    });
    
    const facilityArray = Object.keys(facilityMap).map(facility => ({
      name: facility,
      value: facilityMap[facility]
    })).sort((a, b) => b.value - a.value);
    
    setFacilityStats(facilityArray);
  };

  const calculateHostelStats = (complaintsData) => {
    const hostelMap = {};
    
    complaintsData.forEach(complaint => {
      const hostelName = complaint.hostel_name || 'Unknown Hostel';
      if (!hostelMap[hostelName]) {
        hostelMap[hostelName] = 0;
      }
      hostelMap[hostelName]++;
    });
    
    const hostelArray = Object.keys(hostelMap).map(hostel => ({
      hostel,
      count: hostelMap[hostel]
    })).sort((a, b) => b.count - a.count);
    
    setHostelStats(hostelArray);
  };

  const calculateTimeSeriesData = (complaintsData) => {
    const days = 30;
    const today = new Date();
    const data = [];
    
    // Create a map for last 30 days
    const complaintCountByDate = {};
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      complaintCountByDate[dateString] = 0;
    }
    
    // Count complaints by date
    complaintsData.forEach(complaint => {
      if (complaint.submitted_at) {
        const complaintDate = complaint.submitted_at.split('T')[0];
        if (complaintCountByDate.hasOwnProperty(complaintDate)) {
          complaintCountByDate[complaintDate]++;
        }
      }
    });
    
    // Convert to array format
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      data.push({
        date: dateString,
        complaints: complaintCountByDate[dateString] || 0,
      });
    }
    
    setTimeSeriesData(data);
  };

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

  const ChartSkeleton = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <Skeleton className="h-10 w-48 bg-gray-200" />
          <Skeleton className="h-80 w-full bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );

  const RecentActivitySkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32 bg-gray-200" />
            <Skeleton className="h-3 w-48 bg-gray-200" />
            <Skeleton className="h-3 w-64 bg-gray-200" />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
            <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
          <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
          <Skeleton className="h-4 w-96 bg-gray-200" />
        </div>

        <StatsSkeleton />
        <ChartSkeleton />

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList>
            <Skeleton className="h-10 w-32 bg-gray-200" />
          </TabsList>
          <TabsContent value="complaints">
            <Card>
              <CardContent className="pt-6">
                <RecentActivitySkeleton />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-white/90">
          Welcome back, {user?.name}. Overview of hostel complaints and system performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Complaints */}
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
            <div className="text-2xl font-bold text-black">
              {stats.total}
            </div>
            <p className="text-xs text-gray-600 mt-1">All submissions</p>
          </CardContent>
        </Card>

        {/* Pending */}
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

        {/* In Progress */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              In Progress
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.in_progress}
            </div>
            <p className="text-xs text-gray-600 mt-1">Being resolved</p>
          </CardContent>
        </Card>

        {/* Resolved */}
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

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Average Resolution Time
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.avgResolutionTime} days
            </div>
            <p className="text-xs text-gray-600 mt-1">Average time to resolve complaints</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Trend (30 days)
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              {stats.trend >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-600" /> : 
                <TrendingDown className="h-4 w-4 text-red-600" />
              }
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.trend >= 0 ? '+' : ''}{stats.trend}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Compared to previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Facility Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Complaints by Facility Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facilityStats.slice(0, 8).map((facility, index) => (
              <div key={facility.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-purple-700">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium">{facility.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">{facility.value}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                      style={{ 
                        width: `${(facility.value / stats.total) * 100}%`,
                        maxWidth: '100%'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

{/* Recent Activity Tabs */}
<Tabs defaultValue="complaints" className="space-y-4">
  <TabsList>
    <TabsTrigger
      value="complaints"
      className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
    >
      Recent Complaints
    </TabsTrigger>
  </TabsList>

  <TabsContent value="complaints">
    <Card>
      <CardContent className="pt-6">
        {complaints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">
              No Complaints Found
            </h3>
            <p className="text-gray-600">
              No complaints have been submitted yet.
            </p>
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
                    {/* Fixed: Use student_name and hostel_name */}
                    {complaint.student_name || 'Unknown Student'} • {complaint.hostel_name || 'Unknown Hostel'}
                    {/* Removed matric number since it's not in the complaint data */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {complaint.issue_description?.substring(0, 80)}...
                  </p>
                  {complaint.assigned_maintenance && (
                    <p className="text-xs text-purple-600">
                      Assigned to: {complaint.assigned_maintenance}
                    </p>
                  )}
                  {complaint.maintenance_remarks && (
                    <p className="text-xs text-blue-600 mt-1">
                      <span className="font-semibold">Remarks:</span> {complaint.maintenance_remarks}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={`${getStatusColor(complaint.status)} pointer-events-none text-xs`}
                  >
                    {getStatusDisplay(complaint.status)}
                  </Badge>
                  {complaint.priority && (
                    <Badge
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {complaint.priority}
                    </Badge>
                  )}
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

export default AdminDashboard;