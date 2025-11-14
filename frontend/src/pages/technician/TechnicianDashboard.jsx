import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, AlertTriangle, FileText, TrendingUp, User, Wrench, MessageSquare, Star } from 'lucide-react';
import { mockComplaints, mockTechnicians, mockFeedbacks } from '@/data/mockData';
import { UpdateComplaintModal } from '@/components/modal/UpdateComplaintModal';
import { ComplaintsTrendChart } from '@/components/charts/ComplaintsTrendChart';
import { HostelBarChart } from '@/components/charts/HostelBarChart';
import { FacilityPieChart } from '@/components/charts/FacilityPieChart';

const TechnicianDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [complaints, setComplaints] = useState(mockComplaints);
  
  // In a real app, this would come from authentication context
  const currentTechnicianId = "3"; // Ahmad bin Ismail
  const currentTechnician = mockTechnicians.find(tech => tech.id === currentTechnicianId);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  // Get complaints assigned to current technician
  const assignedComplaints = useMemo(() => {
    return complaints.filter(complaint => complaint.assignedTechnician === currentTechnicianId);
  }, [complaints, currentTechnicianId]);

  const stats = {
    totalAssigned: assignedComplaints.length,
    pending: assignedComplaints.filter(c => c.status === 'Pending').length,
    inProgress: assignedComplaints.filter(c => c.status === 'In Progress').length,
    resolved: assignedComplaints.filter(c => c.status === 'Resolved').length,
    completionRate: assignedComplaints.length > 0 
      ? Math.round((assignedComplaints.filter(c => c.status === 'Resolved').length / assignedComplaints.length) * 100)
      : 0,
  };

  const recentComplaints = assignedComplaints
    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    .slice(0, 10);

  // Generate time series data for charts
  const generateTimeSeriesData = () => {
    const complaintDates = assignedComplaints.map(c => c.submittedDate);
    
    if (complaintDates.length === 0) {
      return [];
    }
    
    const sortedDates = complaintDates.sort();
    const earliestDate = new Date(sortedDates[0]);
    const latestDate = new Date(sortedDates[sortedDates.length - 1]);
    
    let startDate;
    if (timeRange === "7d") {
      startDate = new Date(latestDate);
      startDate.setDate(startDate.getDate() - 6);
    } else {
      startDate = new Date(latestDate);
      startDate.setDate(startDate.getDate() - 29);
    }
    
    if (startDate < earliestDate) {
      startDate = earliestDate;
    }
    
    const data = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= latestDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      
      const count = assignedComplaints.filter(complaint => 
        complaint.submittedDate === dateString
      ).length;
      
      data.push({
        date: dateString,
        complaints: count,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const timeSeriesData = useMemo(() => {
    const data = generateTimeSeriesData();
    return data;
  }, [timeRange, assignedComplaints]);

  const facilityData = [...new Set(assignedComplaints.map(c => c.facilityType))].map(type => ({
    name: type,
    value: assignedComplaints.filter(c => c.facilityType === type).length,
  }));

  const hostelData = [...new Set(assignedComplaints.map(c => c.hostelName))].map(hostel => ({
    hostel: hostel, 
    count: assignedComplaints.filter(c => c.hostelName === hostel).length,
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleUpdateComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowUpdateModal(true);
  };

  const handleComplaintUpdate = (updatedComplaint) => {
    setComplaints(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === updatedComplaint.id ? updatedComplaint : complaint
      )
    );
    setShowUpdateModal(false);
    setSelectedComplaint(null);
  };

  // Get feedback for current technician
  const technicianFeedbacks = mockFeedbacks.filter(feedback => 
    feedback.technicianId === currentTechnicianId
  );

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
        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
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

        <Tabs defaultValue="assigned" className="space-y-4">
          <TabsList>
            <Skeleton className="h-10 w-32 bg-gray-200" />
            <Skeleton className="h-10 w-32 bg-gray-200" />
          </TabsList>
          <TabsContent value="assigned">
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
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technician Dashboard</h1>
            <p className="text-white/90">
              Welcome back, {currentTechnician?.name} • {currentTechnician?.specialty} Specialist
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Performance Score</p>
            <p className="text-2xl font-bold">{currentTechnician?.performance?.satisfactionRate || '4.8/5.0'}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Assigned */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Assigned</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalAssigned}</div>
            <p className="text-xs text-gray-600 mt-1">Your workload</p>
          </CardContent>
        </Card>

        {/* Pending */}
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

        {/* In Progress */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">In Progress</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.inProgress}</div>
            <p className="text-xs text-gray-600 mt-1">Being worked on</p>
          </CardContent>
        </Card>

        {/* Resolved */}
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

      {/* Charts */}
      <ComplaintsTrendChart 
        data={timeSeriesData} 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange} 
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <HostelBarChart data={hostelData} />
        <FacilityPieChart data={facilityData} total={stats.totalAssigned} />
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger 
            value="assigned"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Assigned Complaints
          </TabsTrigger>
          <TabsTrigger 
            value="feedback"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            My Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {assignedComplaints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No complaints assigned to you yet.</p>
                  </div>
                ) : (
                  assignedComplaints.slice(0, 5).map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium text-black">{complaint.facilityType}</p>
                        <p className="text-sm text-gray-600">
                          {complaint.studentName} • {complaint.matricNumber} • {complaint.hostelName}
                        </p>
                        <p className="text-xs text-gray-500">{complaint.issueDescription}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Submitted: {complaint.submittedDate}
                          </span>
                          {complaint.technicianRemarks && (
                            <span className="text-xs text-gray-500">
                              Your Remarks: {complaint.technicianRemarks}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(complaint.status)} text-xs`}>
                          {complaint.status}
                        </Badge>
                        {complaint.status !== 'Resolved' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateComplaint(complaint)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Update
                          </Button>
                        )}
                        {complaint.status === 'Resolved' && complaint.resolutionDate && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            Resolved on {complaint.resolutionDate}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {technicianFeedbacks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No feedback received yet.</p>
                  </div>
                ) : (
                  technicianFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-black">{feedback.studentName}</p>
                          <p className="text-sm text-gray-600">{feedback.matricNumber}</p>
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Complaint Modal */}
      <UpdateComplaintModal
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onUpdate={handleComplaintUpdate}
      />
    </div>
  );
};

export default TechnicianDashboard;