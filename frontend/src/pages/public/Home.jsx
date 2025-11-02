import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import PublicLayout from '@/components/layout/PublicLayout';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalComplaints = mockComplaints.length;
  const pendingComplaints = mockComplaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = mockComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = mockComplaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label: 'Total Complaints', value: totalComplaints, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Pending', value: pendingComplaints, icon: Clock, color: 'text-yellow-600' },
    { label: 'In Progress', value: inProgressComplaints, icon: AlertCircle, color: 'text-orange-600' },
    { label: 'Resolved', value: resolvedComplaints, icon: CheckCircle, color: 'text-green-600' },
  ];

  const features = [
    { icon: FileText, title: 'Submit Complaints', description: 'Easily report any hostel facility issues with our simple form.' },
    { icon: Eye, title: 'Track Status', description: 'Monitor your complaint progress in real-time with transparent updates.' },
    { icon: MessageSquare, title: 'Provide Feedback', description: 'Rate and comment on resolved complaints to help us improve.' },
  ];

  const filteredComplaints = mockComplaints.filter(complaint =>
    complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">USM Hostel Care System</h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Your centralized platform for reporting and tracking hostel facility issues.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input type="text" placeholder="Search common complaints..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/login"><FileText className="mr-2 h-5 w-5" />Submit Complaint</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" asChild>
              <Link to="/faq"><ShieldCheck className="mr-2 h-5 w-5" />View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Complaints */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{searchTerm ? 'Search Results' : 'Recent Complaints'}</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{searchTerm ? 'No complaints found.' : 'No complaints to display.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => (
                    <div key={complaint.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{complaint.facilityType}</h4>
                          <p className="text-sm text-muted-foreground">{complaint.hostelName} - Room {complaint.roomNumber}</p>
                          <p className="text-sm text-muted-foreground mt-1">{complaint.issueDescription}</p>
                        </div>
                        <Badge variant={complaint.status === 'Resolved' ? 'default' : complaint.status === 'In Progress' ? 'secondary' : 'outline'}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;