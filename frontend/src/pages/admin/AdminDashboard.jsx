import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertTriangle, FileText, Star, Users, TrendingUp, MessageSquare, Wrench, UserPlus } from 'lucide-react';
import { mockComplaints, mockFeedbacks, mockTechnicians } from '@/data/mockData';
import { ComplaintsTrendChart } from '@/components/charts/ComplaintsTrendChart';
import { HostelBarChart } from '@/components/charts/HostelBarChart';
import { FacilityPieChart } from '@/components/charts/FacilityPieChart';
import { CreateTechnicianModal } from '@/components/modal/CreateTechnicianModal';
import { AssignTechnicianModal } from '@/components/modal/AssignTechnicianModal';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTechnician, setShowCreateTechnician] = useState(false);
  const [showAssignTechnician, setShowAssignTechnician] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [technicians, setTechnicians] = useState(mockTechnicians);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  const stats = {
    totalComplaints: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    totalTechnicians: technicians.length,
    activeTechnicians: technicians.filter(t => t.status === 'Active').length,
  };

  const generateTimeSeriesData = () => {
    const complaintDates = complaints.map(c => c.submittedDate);
    
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
      
      const count = complaints.filter(complaint => 
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
  }, [timeRange, complaints]);

  const facilityData = [...new Set(complaints.map(c => c.facilityType))].map(type => ({
    name: type,
    value: complaints.filter(c => c.facilityType === type).length,
  }));

  const hostelData = [...new Set(complaints.map(c => c.hostelName))].map(hostel => ({
    hostel: hostel, 
    count: complaints.filter(c => c.hostelName === hostel).length,
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAssignTechnician = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignTechnician(true);
  };

  const getTechnicianName = (technicianId) => {
    const technician = technicians.find(t => t.id === technicianId);
    return technician ? technician.name : 'Unassigned';
  };

  // Handle creating a new technician
  const handleCreateTechnician = (technicianData) => {
    const newTechnician = {
      ...technicianData,
      id: Date.now().toString(),
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      assignedComplaints: [],
      completedComplaints: [],
      performance: {
        avgResolutionTime: "0 days",
        satisfactionRate: "0/5.0",
        totalResolved: 0
      }
    };
    
    setTechnicians(prev => [...prev, newTechnician]);
    setShowCreateTechnician(false);
  };

  // Handle assigning technician to complaint
  const handleAssignTechnicianToComplaint = (technicianId) => {
    if (selectedComplaint && technicianId) {
      const updatedComplaints = complaints.map(complaint => 
        complaint.id === selectedComplaint.id 
          ? { 
              ...complaint, 
              assignedTechnician: technicianId, 
              status: 'In Progress',
              adminRemarks: complaint.adminRemarks || `Assigned to technician on ${new Date().toLocaleDateString()}`
            }
          : complaint
      );
      
      setComplaints(updatedComplaints);
      
      // Update technician's assigned complaints count
      setTechnicians(prev => 
        prev.map(tech => 
          tech.id === technicianId 
            ? { 
                ...tech, 
                assignedComplaints: [...(tech.assignedComplaints || []), selectedComplaint.id] 
              }
            : tech
        )
      );
    }
    setShowAssignTechnician(false);
    setSelectedComplaint(null);
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

        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList>
            <Skeleton className="h-10 w-32 bg-gray-200" />
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
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-white/90">Overview of hostel complaints and system performance</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateTechnician(true)}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Technician
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Total Complaints */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Complaints</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalComplaints}</div>
            <p className="text-xs text-gray-600 mt-1">All submissions</p>
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
            <p className="text-xs text-gray-600 mt-1">Being resolved</p>
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

        {/* Total Technicians */}
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Technicians</CardTitle>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.totalTechnicians}</div>
            <p className="text-xs text-gray-600 mt-1">{stats.activeTechnicians} active</p>
          </CardContent>
        </Card>

        {/* Technician Performance */}
        <Card className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Avg. Resolution</CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">2.3d</div>
            <p className="text-xs text-gray-600 mt-1">Average time</p>
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
          <TabsTrigger 
            value="complaints"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Recent Complaints
          </TabsTrigger>
          <TabsTrigger 
            value="technicians"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Technicians
          </TabsTrigger>
          <TabsTrigger 
            value="feedback"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Recent Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {complaints.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-black">{complaint.facilityType}</p>
                      <p className="text-sm text-gray-600">
                        {complaint.studentName} • {complaint.matricNumber} • {complaint.hostelName}
                      </p>
                      <p className="text-xs text-gray-500">{complaint.issueDescription}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          Technician: {getTechnicianName(complaint.assignedTechnician)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(complaint.status)} text-xs`}>
                        {complaint.status}
                      </Badge>
                      {complaint.status === 'Pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAssignTechnician(complaint)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {technicians.map((technician) => (
                  <div key={technician.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-black">{technician.name}</p>
                      <p className="text-sm text-gray-600">{technician.email}</p>
                      <p className="text-sm text-gray-600">Specialty: {technician.specialty}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Assigned: {complaints.filter(c => c.assignedTechnician === technician.id).length}
                        </span>
                        <span className="text-xs text-gray-500">
                          Resolved: {complaints.filter(c => c.assignedTechnician === technician.id && c.status === 'Resolved').length}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={technician.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                        {technician.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Since {technician.joinDate}
                      </span>
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateTechnicianModal 
        open={showCreateTechnician}
        onClose={() => setShowCreateTechnician(false)}
        onSave={handleCreateTechnician}
      />

      <AssignTechnicianModal
        open={showAssignTechnician}
        onClose={() => setShowAssignTechnician(false)}
        complaint={selectedComplaint}
        technicians={technicians}
        onAssign={handleAssignTechnicianToComplaint}
      />
    </div>
  );
};

export default AdminDashboard;