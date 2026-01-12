import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Star, Users, Award, Target, Zap, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const StaffPerformance = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalStaff: 0,
    avgRating: 0,
    overallCompletion: 0,
    totalAssigned: 0,
    totalResolved: 0,
    totalPending: 0,
    totalInProgress: 0
  });

  // Fetch staff and their performance data
  useEffect(() => {
    const fetchStaffPerformance = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        // Fetch all staff
        const staffResponse = await fetch('http://localhost:5000/api/auth/staff', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (staffResponse.ok) {
          const staffResult = await staffResponse.json();
          if (staffResult.success) {
            const staffMembers = staffResult.staff || [];
            
            // Fetch all complaints to calculate performance
            const complaintsResponse = await fetch('http://localhost:5000/api/complaints', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (complaintsResponse.ok) {
              const complaintsResult = await complaintsResponse.json();
              const allComplaints = complaintsResult.success ? complaintsResult.complaints || [] : [];
              
              // Fetch all feedbacks for ratings
              const feedbacksResponse = await fetch('http://localhost:5000/api/feedbacks', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              const allFeedbacks = feedbacksResponse.ok ? 
                await feedbacksResponse.json().then(r => r.success ? r.feedbacks || [] : []) : [];
              
              // Calculate performance for each staff member
              const staffWithPerformance = staffMembers.map(staff => {
                const assignedComplaints = allComplaints.filter(
                  c => c.assigned_maintenance_id === staff.id
                );
                const resolvedComplaints = assignedComplaints.filter(
                  c => c.status === 'resolved'
                );
                const pendingComplaints = assignedComplaints.filter(
                  c => c.status === 'pending'
                );
                const inProgressComplaints = assignedComplaints.filter(
                  c => c.status === 'in_progress'
                );

                // Get feedbacks for this staff
                const staffFeedbacks = allFeedbacks.filter(
                  f => f.maintenance_id === staff.id
                );
                
                const averageRating = staffFeedbacks.length > 0
                  ? parseFloat((staffFeedbacks.reduce((sum, f) => sum + f.rating, 0) / staffFeedbacks.length).toFixed(1))
                  : 0;

                const completionRate = assignedComplaints.length > 0
                  ? parseFloat(((resolvedComplaints.length / assignedComplaints.length) * 100).toFixed(0))
                  : 0;

                return {
                  ...staff,
                  totalAssigned: assignedComplaints.length,
                  resolved: resolvedComplaints.length,
                  pending: pendingComplaints.length,
                  inProgress: inProgressComplaints.length,
                  averageRating,
                  completionRate,
                  feedbackCount: staffFeedbacks.length,
                  facility_types: staff.facility_types || [],
                  email: staff.email || '',
                  phone: staff.phone || ''
                };
              });
              
              setStaffList(staffWithPerformance);
              
              // Calculate overall statistics
              calculateOverallStats(staffWithPerformance);
            } else {
              toast.error('Failed to load complaints for performance data');
            }
          } else {
            toast.error(staffResult.error || 'Failed to load staff');
          }
        } else {
          const errorData = await staffResponse.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to load staff data');
        }
      } catch (error) {
        console.error('Error fetching staff performance:', error);
        toast.error('Failed to load staff performance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffPerformance();
  }, []);

  const calculateOverallStats = (staffData) => {
    const totalStaff = staffData.length;
    const totalAssigned = staffData.reduce((sum, s) => sum + s.totalAssigned, 0);
    const totalResolved = staffData.reduce((sum, s) => sum + s.resolved, 0);
    const totalPending = staffData.reduce((sum, s) => sum + s.pending, 0);
    const totalInProgress = staffData.reduce((sum, s) => sum + s.inProgress, 0);
    
    // Calculate average rating (only for staff with ratings)
    const staffWithRatings = staffData.filter(s => s.feedbackCount > 0);
    const avgRating = staffWithRatings.length > 0
      ? parseFloat((staffWithRatings.reduce((sum, s) => sum + s.averageRating, 0) / staffWithRatings.length).toFixed(1))
      : 0;
    
    const overallCompletion = totalAssigned > 0
      ? parseFloat(((totalResolved / totalAssigned) * 100).toFixed(0))
      : 0;

    setOverallStats({
      totalStaff,
      avgRating,
      overallCompletion,
      totalAssigned,
      totalResolved,
      totalPending,
      totalInProgress
    });
  };

  // Filter staff based on search
  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.phone.includes(searchQuery)
  );

  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-2 border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-4 rounded-full bg-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 mb-2 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
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
        <h1 className="text-3xl font-bold tracking-tight">
          Staff Performance Overview
        </h1>
        <p className="text-white/90">
          Welcome back, {user?.name}. Track maintenance staff performance and ratings
        </p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Total Staff
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {overallStats.totalStaff}
            </div>
            <p className="text-xs text-gray-600 mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Average Rating
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {overallStats.avgRating}/5.0
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= Math.round(overallStats.avgRating)
                      ? 'fill-purple-600 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Completion Rate
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {overallStats.overallCompletion}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {overallStats.totalResolved} of {overallStats.totalAssigned}{' '}
              resolved
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Active Tasks
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {overallStats.totalInProgress + overallStats.totalPending}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {overallStats.totalInProgress} in progress,{' '}
              {overallStats.totalPending} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Section */}
      {filteredStaff.filter(s => s.feedbackCount > 0).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Top Rated Staff Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {filteredStaff
                .filter(s => s.feedbackCount > 0)
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3)
                .map((staff, index) => (
                  <Card
                    key={staff.id}
                    className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 relative"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        {index === 0 && (
                          <div className="absolute top-2 right-2">
                            <Award className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                        <Avatar className="h-16 w-16 mb-3 border-2 border-purple-300">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-bold">
                            {getInitials(staff.name)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-black mb-1">
                          {staff.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">{staff.specialty || 'Maintenance Staff'}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-purple-600 text-yellow-400" />
                          <span className="text-lg font-bold text-purple-600">
                            {staff.averageRating}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({staff.feedbackCount} reviews)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full text-xs">
                          <div className="bg-white p-2 rounded">
                            <p className="text-gray-600">Resolved</p>
                            <p className="font-bold text-purple-600">
                              {staff.resolved}
                            </p>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <p className="text-gray-600">Rate</p>
                            <p className="font-bold text-purple-600">
                              {staff.completionRate}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-xs">
                          {staff.email && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail size={12} />
                              <span className="truncate max-w-[100px]">{staff.email}</span>
                            </div>
                          )}
                          {staff.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone size={12} />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search staff by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Staff List */}
      {filteredStaff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">
              No Staff Members Found
            </h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : 'No maintenance staff registered yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map(staff => (
            <Card
              key={staff.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-purple-200">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                      {getInitials(staff.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-1">
                      {staff.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{staff.email}</p>
                    {staff.specialty && (
                      <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block mb-2">
                        {staff.specialty}
                      </p>
                    )}

                    {staff.facility_types && staff.facility_types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {staff.facility_types.slice(0, 3).map((type, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {type}
                          </span>
                        ))}
                        {staff.facility_types.length > 3 && (
                          <span className="text-xs text-gray-500">+{staff.facility_types.length - 3} more</span>
                        )}
                      </div>
                    )}

                    {staff.feedbackCount > 0 ? (
                      <>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= Math.round(staff.averageRating)
                                  ? 'fill-purple-600 text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                          <span className="text-sm font-semibold text-purple-600 ml-1">
                            {staff.averageRating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({staff.feedbackCount} reviews)
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-semibold text-purple-600">
                              {staff.completionRate}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                              style={{ width: `${staff.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 italic mb-3">
                        No ratings yet
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{staff.totalAssigned}</div>
                        <div className="text-gray-600">Assigned</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{staff.resolved}</div>
                        <div className="text-gray-600">Resolved</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-amber-600">{staff.pending + staff.inProgress}</div>
                        <div className="text-gray-600">Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPerformance;