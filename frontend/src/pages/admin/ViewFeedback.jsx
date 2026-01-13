import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Filter,
  Star,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  Award,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ViewFeedback = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    hostelStats: [],
  });
  const [topRatedStaff, setTopRatedStaff] = useState([]);

  // Fetch feedbacks from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('${API_URL}/api/feedbacks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Feedbacks loaded:', result.feedbacks);
            setFeedbacks(result.feedbacks || []);
            calculateStats(result.feedbacks);
            calculateTopRatedStaff(result.feedbacks);
          } else {
            toast.error(result.error || 'Failed to load feedbacks');
            setFeedbacks([]);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to load feedbacks');
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        toast.error('Failed to load feedbacks');
        setFeedbacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const calculateStats = feedbacksData => {
    const total = feedbacksData.length;

    // Calculate average rating
    const averageRating =
      total > 0
        ? parseFloat(
            (
              feedbacksData.reduce((sum, f) => sum + f.rating, 0) / total
            ).toFixed(1)
          )
        : 0;

    // Calculate rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacksData.forEach(f => {
      if (f.rating >= 1 && f.rating <= 5) {
        ratingDistribution[f.rating]++;
      }
    });

    // Calculate hostel stats
    const hostelMap = {};
    feedbacksData.forEach(f => {
      const hostelName = f.complaint_details?.hostel_name || 'Unknown Hostel';
      if (!hostelMap[hostelName]) {
        hostelMap[hostelName] = 0;
      }
      hostelMap[hostelName]++;
    });

    const hostelStats = Object.keys(hostelMap)
      .map(hostel => ({
        name: hostel,
        count: hostelMap[hostel],
      }))
      .sort((a, b) => b.count - a.count);

    setStats({
      total,
      averageRating,
      ratingDistribution,
      hostelStats,
    });
  };

  const calculateTopRatedStaff = feedbacksData => {
    const staffMap = {};

    feedbacksData.forEach(feedback => {
      const staffName =
        feedback.complaint_details?.assigned_maintenance_name ||
        'Unknown Staff';
      const staffId = feedback.complaint_details?.assigned_maintenance_id;

      if (!staffMap[staffId]) {
        staffMap[staffId] = {
          name: staffName,
          ratings: [],
          totalComplaints: 0,
        };
      }

      staffMap[staffId].ratings.push(feedback.rating);
    });

    // Calculate average rating for each staff
    const staffArray = Object.values(staffMap)
      .map(staff => ({
        ...staff,
        averageRating:
          staff.ratings.length > 0
            ? parseFloat(
                (
                  staff.ratings.reduce((a, b) => a + b, 0) /
                  staff.ratings.length
                ).toFixed(1)
              )
            : 0,
        feedbackCount: staff.ratings.length,
      }))
      .filter(staff => staff.feedbackCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    setTopRatedStaff(staffArray);
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const studentName = feedback.student_name || '';
    const comment = feedback.comment || '';
    const facilityType = feedback.complaint_details?.facility_type || '';
    const hostelName = feedback.complaint_details?.hostel_name || '';
    const staffName =
      feedback.complaint_details?.assigned_maintenance_name || '';

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // Format date
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Skeleton components
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32 bg-gray-200" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-4 w-8 bg-gray-200" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32 bg-gray-200" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-4 w-8 bg-gray-200" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const FeedbackCardSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <Skeleton className="h-5 w-16 bg-gray-200" />
            </div>
            <Skeleton className="h-3 w-24 bg-gray-200" />
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
          <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
          <Skeleton className="h-4 w-96 bg-gray-200" />
        </div>

        <StatsSkeleton />
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Skeleton className="h-9 flex-1 bg-gray-200" />
          <Skeleton className="h-9 w-[180px] bg-gray-200" />
          <Skeleton className="h-6 w-24 bg-gray-200" />
        </div>

        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <FeedbackCardSkeleton key={i} />
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
        <h1 className="text-3xl font-bold tracking-tight">Student Feedback</h1>
        <p className="text-white/90">
          Welcome back, {user?.name}. View ratings and comments from students
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Total Feedback
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">Total submissions</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
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
              {stats.averageRating}/5.0
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= Math.round(stats.averageRating)
                      ? 'fill-purple-600 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Top Rating
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.ratingDistribution[5]}
            </div>
            <p className="text-xs text-gray-600 mt-1">5-star ratings</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Positive Trend
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                ((stats.ratingDistribution[4] + stats.ratingDistribution[5]) /
                  stats.total) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-gray-600 mt-1">Positive (4-5 stars)</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Feedback by Hostel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.hostelStats.slice(0, 10).map((hostel, index) => (
                <div
                  key={hostel.name}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-gray-800">
                      {hostel.name.replace('Desasiswa ', '')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-purple-600">
                      {hostel.count}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                        style={{
                          width: `${(hostel.count / stats.total) * 100}%`,
                          maxWidth: '100%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div
                key={rating}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 w-4">{rating}</span>
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= rating
                            ? 'fill-purple-600 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-purple-600">
                    {stats.ratingDistribution[rating]}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        rating >= 4
                          ? 'bg-green-500'
                          : rating === 3
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(stats.ratingDistribution[rating] / stats.total) * 100}%`,
                        maxWidth: '100%',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Staff */}
      {topRatedStaff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Top Rated Maintenance Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topRatedStaff.map((staff, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-lg"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 mb-2 border-2 border-purple-300">
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                        {staff.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1">
                        <Award className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1 truncate w-full">
                    {staff.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-purple-600 text-yellow-400" />
                    <span className="font-bold text-purple-600 text-sm">
                      {staff.averageRating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {staff.feedbackCount} ratings
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          />
          <Input
            placeholder="Search by student, comment, facility, hostel, or staff..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="h-7">
          {filteredFeedbacks.length} of {feedbacks.length}
        </Badge>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">
              No Feedback Found
            </h3>
            <p className="text-gray-600">
              {feedbacks.length === 0
                ? 'No feedback has been submitted yet.'
                : 'Try adjusting your filters or search terms'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map(feedback => (
            <Card
              key={feedback.id}
              className="border border-gray-200 shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-sm text-black">
                            {feedback.student_name || 'Unknown Student'}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                            <Calendar size={10} />
                            <span>{formatDate(feedback.submitted_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={20}
                            className={
                              star <= feedback.rating
                                ? 'fill-purple-600 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {feedback.comment}
                    </p>

                    {feedback.complaint_details && (
                      <div className="bg-gray-50 rounded-lg p-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                          <div>
                            <span className="font-medium text-gray-700">
                              Facility:
                            </span>{' '}
                            <span className="text-gray-600">
                              {feedback.complaint_details.facility_type ||
                                'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              Hostel:
                            </span>
                            <span className="text-gray-600">
                              {feedback.complaint_details.hostel_name || 'N/A'}
                            </span>
                          </div>
                          {feedback.complaint_details
                            .assigned_maintenance_name && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Maintenance Staff:
                              </span>{' '}
                              <span className="text-purple-600">
                                {
                                  feedback.complaint_details
                                    .assigned_maintenance_name
                                }
                              </span>
                            </div>
                          )}
                          {feedback.complaint_details.maintenance_remarks && (
                            <div className="sm:col-span-2">
                              <span className="font-medium text-gray-700">
                                Staff Remarks:
                              </span>{' '}
                              <span className="text-blue-600 italic">
                                "
                                {feedback.complaint_details.maintenance_remarks}
                                "
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

export default ViewFeedback;
