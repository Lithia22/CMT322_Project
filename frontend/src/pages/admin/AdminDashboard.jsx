import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, AlertTriangle, FileText, Star } from 'lucide-react';
import { mockComplaints, mockFeedbacks } from '@/data/mockData';
import { ComplaintsTrendChart } from '@/components/charts/ComplaintsTrendChart';
import { HostelBarChart } from '@/components/charts/HostelBarChart';
import { FacilityPieChart } from '@/components/charts/FacilityPieChart';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");

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
                    <div className="flex items-center gap-2 ml-4">
<Badge className={`${getUrgencyColor(complaint.urgencyLevel)} w-20 justify-center`}>
  {complaint.urgencyLevel}
</Badge>
<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 w-24 justify-center">
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