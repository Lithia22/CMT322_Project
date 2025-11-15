import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Star, Users, Award, Target, Zap } from 'lucide-react';
import {
  mockMaintenanceStaff,
  mockComplaints,
  mockFeedbacks,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const StaffPerformance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState('rating');

  // Calculate staff statistics
  const staffStats = useMemo(() => {
    return mockMaintenanceStaff.map(staff => {
      const assignedComplaints = mockComplaints.filter(
        c => c.assignedMaintenance === staff.id
      );
      const resolvedComplaints = assignedComplaints.filter(
        c => c.status === 'Resolved'
      );
      const pendingComplaints = assignedComplaints.filter(
        c => c.status === 'Pending'
      );
      const inProgressComplaints = assignedComplaints.filter(
        c => c.status === 'In Progress'
      );

      const staffFeedbacks = mockFeedbacks.filter(
        f => f.maintenanceId === staff.id
      );
      const averageRating =
        staffFeedbacks.length > 0
          ? staffFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
            staffFeedbacks.length
          : 0;

      const completionRate =
        assignedComplaints.length > 0
          ? (resolvedComplaints.length / assignedComplaints.length) * 100
          : 0;

      return {
        ...staff,
        totalAssigned: assignedComplaints.length,
        resolved: resolvedComplaints.length,
        pending: pendingComplaints.length,
        inProgress: inProgressComplaints.length,
        averageRating: averageRating.toFixed(1),
        completionRate: completionRate.toFixed(0),
        feedbackCount: staffFeedbacks.length,
      };
    });
  }, []);

  // Filter and sort staff
  const filteredStaff = useMemo(() => {
    let filtered = staffStats.filter(staff =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort based on selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'completion':
          return b.completionRate - a.completionRate;
        case 'resolved':
          return b.resolved - a.resolved;
        default:
          return 0;
      }
    });

    return filtered;
  }, [staffStats, searchQuery, sortBy]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalStaff = staffStats.length;
    const totalAssigned = staffStats.reduce(
      (sum, s) => sum + s.totalAssigned,
      0
    );
    const totalResolved = staffStats.reduce((sum, s) => sum + s.resolved, 0);
    const totalPending = staffStats.reduce((sum, s) => sum + s.pending, 0);
    const totalInProgress = staffStats.reduce(
      (sum, s) => sum + s.inProgress,
      0
    );
    const avgRating =
      staffStats.reduce((sum, s) => sum + parseFloat(s.averageRating), 0) /
      totalStaff;

    return {
      totalStaff,
      totalAssigned,
      totalResolved,
      totalPending,
      totalInProgress,
      avgRating: avgRating.toFixed(1),
      overallCompletion:
        totalAssigned > 0
          ? ((totalResolved / totalAssigned) * 100).toFixed(0)
          : 0,
    };
  }, [staffStats]);

  // Chart data for performance comparison - using staff initials
  const performanceChartData = filteredStaff.map(staff => ({
    name: staff.name.split(' ')[0],
    totalAssigned: staff.totalAssigned,
    Resolved: staff.resolved,
    'In Progress': staff.inProgress,
    Pending: staff.pending,
  }));

  // Pie chart data - Purple and Yellow theme
  const COLORS = [
    'hsl(270, 76%, 53%)', // Purple - for Resolved
    'hsl(270, 76%, 67%)', // Light Purple - for In Progress
    'hsl(45, 93%, 47%)', // Yellow - for Pending
  ];

  const statusDistributionData = [
    { name: 'Resolved', value: overallStats.totalResolved },
    { name: 'In Progress', value: overallStats.totalInProgress },
    { name: 'Pending', value: overallStats.totalPending },
  ];

  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

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
          Track maintenance staff performance and ratings
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
      <Card>
        <CardHeader>
          <CardTitle className="text-black flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Top Rated Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {filteredStaff.slice(0, 3).map((staff, index) => (
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
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-purple-600 text-yellow-400" />
                      <span className="text-lg font-bold text-purple-600">
                        {staff.averageRating}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search staff by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Staff List */}
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffPerformance;
