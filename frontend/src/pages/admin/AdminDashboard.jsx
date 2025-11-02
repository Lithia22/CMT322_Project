import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  MessageSquare,
  FileText,
  Download
} from 'lucide-react';
import { mockComplaints, mockFeedbacks, mockUsers } from '@/data/mockData';

const AdminDashboard = () => {
  const complaints = mockComplaints;
  const feedbacks = mockFeedbacks;
  const students = mockUsers.filter(u => u.role === 'student');

  // Statistics
  const stats = {
    totalComplaints: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    totalStudents: students.length,
    totalFeedbacks: feedbacks.length,
    avgRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0
  };

  // Facility type distribution
  const facilityDistribution = [...new Set(complaints.map(c => c.facilityType))].map(type => ({
    name: type,
    value: complaints.filter(c => c.facilityType === type).length
  }));

  // Urgency distribution
  const urgencyDistribution = ['High', 'Medium', 'Low'].map(level => ({
    name: level,
    value: complaints.filter(c => c.urgencyLevel === level).length
  }));

  const recentComplaints = complaints.slice(0, 5);
  const recentFeedbacks = feedbacks.slice(0, 5);

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

  // Simple chart components
  const BarChart = ({ data, title, color = 'bg-blue-500' }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const percentage = (item.value / maxValue) * 100;
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.name}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const DonutChart = ({ data, title }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">{title}</h4>
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">{item.name}</span>
          </div>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of the hostel complaint system
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComplaints}</div>
            <p className="text-xs text-muted-foreground">All time complaints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Complaint distribution and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <BarChart 
              data={facilityDistribution} 
              title="Complaints by Facility Type"
              color="bg-blue-500"
            />
            <BarChart 
              data={urgencyDistribution} 
              title="Complaints by Urgency Level" 
              color="bg-orange-500"
            />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Students</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Feedback</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalFeedbacks}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg. Rating</span>
                </div>
                <p className="text-2xl font-bold">{stats.avgRating}/5</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Resolution Rate</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.totalComplaints > 0 ? Math.round((stats.resolved / stats.totalComplaints) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="complaints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Latest complaint submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{complaint.facilityType}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.studentName} • {complaint.hostelName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-md">
                        {complaint.issueDescription}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getUrgencyVariant(complaint.urgencyLevel)}>
                        {complaint.urgencyLevel}
                      </Badge>
                      <Badge variant={getStatusVariant(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest student ratings and comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{feedback.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Complaint #{feedback.complaintId}
                        </p>
                        <p className="text-sm">{feedback.comment}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-3 h-3 rounded-full ${
                              star <= feedback.rating ? 'bg-yellow-400' : 'bg-muted'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium ml-1">{feedback.rating}.0</span>
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