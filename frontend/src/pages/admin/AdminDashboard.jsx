import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, CheckCircle, AlertTriangle, FileText, Star } from 'lucide-react';
import { mockComplaints, mockFeedbacks } from '@/data/mockData';
import { ComplaintsTrendChart } from '@/components/charts/ComplaintsTrendChart';
import { HostelBarChart } from '@/components/charts/HostelBarChart';
import { FacilityPieChart } from '@/components/charts/FacilityPieChart';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  const stats = {
    totalComplaints: mockComplaints.length,
    pending: mockComplaints.filter(c => c.status === 'Pending').length,
    inProgress: mockComplaints.filter(c => c.status === 'In Progress').length,
    resolved: mockComplaints.filter(c => c.status === 'Resolved').length,
  };

  const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();
    const days = timeRange === "7d" ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        complaints: Math.floor(Math.random() * 12) + 3,
      });
    }
    return data;
  };

  const timeSeriesData = useMemo(() => generateTimeSeriesData(), [timeRange]);

  const facilityData = [...new Set(mockComplaints.map(c => c.facilityType))].map(type => ({
    name: type,
    value: mockComplaints.filter(c => c.facilityType === type).length,
  }));

  const hostelData = [...new Set(mockComplaints.map(c => c.hostelName))].map(hostel => ({
    hostel: hostel.replace('Desasiswa ', ''),
    count: mockComplaints.filter(c => c.hostelName === hostel).length,
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-50 text-green-700 hover:bg-green-50';
      case 'In Progress': return 'bg-blue-50 text-blue-700 hover:bg-blue-50';
      case 'Pending': return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
      default: return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
    }
  };

  // Skeleton components with gray background
  const StatsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20 bg-muted" />
            <Skeleton className="h-4 w-4 rounded-full bg-muted" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2 bg-muted" />
            <Skeleton className="h-3 w-24 bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ChartSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48 bg-muted" />
      <Skeleton className="h-80 w-full bg-muted" />
    </div>
  );

  const RecentActivitySkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32 bg-muted" />
            <Skeleton className="h-3 w-48 bg-muted" />
            <Skeleton className="h-3 w-64 bg-muted" />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Skeleton className="h-6 w-20 rounded-full bg-muted" />
            <Skeleton className="h-6 w-24 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2 bg-muted" />
          <Skeleton className="h-4 w-96 bg-muted" />
        </div>
        
        <StatsSkeleton />
        <ChartSkeleton />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList>
            <Skeleton className="h-10 w-32 bg-muted" />
            <Skeleton className="h-10 w-32 bg-muted" />
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of hostel complaints</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComplaints}</div>
            <p className="text-xs text-muted-foreground mt-1">All submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">Being resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <ComplaintsTrendChart 
        data={timeSeriesData} 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange} 
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <HostelBarChart data={hostelData} />
        <FacilityPieChart data={facilityData} total={stats.totalComplaints} />
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockComplaints.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium">{complaint.facilityType}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.studentName} • {complaint.hostelName}
                      </p>
                      <p className="text-xs text-muted-foreground">{complaint.issueDescription}</p>
                    </div>
<div className="flex items-center justify-start w-24">
  <Badge className={`${getStatusColor(complaint.status)} text-xs`}>
    {complaint.status}
  </Badge>
</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{feedback.studentName}</p>
                        <p className="text-sm mt-2">{feedback.comment}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;