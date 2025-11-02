import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  const studentComplaints = mockComplaints.filter(
    complaint => complaint.studentId === user?.studentId
  );

  const stats = [
    { 
      label: 'Total Complaints', 
      value: studentComplaints.length, 
      icon: TrendingUp,
      description: 'All your complaints'
    },
    { 
      label: 'Pending', 
      value: studentComplaints.filter(c => c.status === 'Pending').length, 
      icon: Clock,
      description: 'Awaiting review'
    },
    { 
      label: 'In Progress', 
      value: studentComplaints.filter(c => c.status === 'In Progress').length, 
      icon: AlertCircle,
      description: 'Being resolved'
    },
    { 
      label: 'Resolved', 
      value: studentComplaints.filter(c => c.status === 'Resolved').length, 
      icon: CheckCircle,
      description: 'Completed'
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: 'Submit Complaint',
      description: 'Report a new facility issue',
      path: '/submit-complaint',
      variant: 'default'
    },
    {
      icon: Eye,
      label: 'View Complaints', 
      description: 'Check your complaint status',
      path: '/my-complaints',
      variant: 'outline'
    },
    {
      icon: MessageSquare,
      label: 'Give Feedback',
      description: 'Rate resolved complaints',
      path: '/feedback',
      variant: 'outline'
    }
  ];

  const recentComplaints = studentComplaints.slice(0, 3);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Resolved': return 'default';
      case 'In Progress': return 'secondary';
      case 'Pending': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your complaints and quick actions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  className="h-auto p-4 justify-start"
                  asChild
                >
                  <Link to={action.path}>
                    <Icon className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">{action.label}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Your most recent submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentComplaints.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No complaints yet</p>
                <Button asChild variant="link" className="mt-2">
                  <Link to="/submit-complaint">Submit your first complaint</Link>
                </Button>
              </div>
            ) : (
              <>
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{complaint.facilityType}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.hostelName} • {complaint.roomNumber}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/my-complaints">View All Complaints</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;