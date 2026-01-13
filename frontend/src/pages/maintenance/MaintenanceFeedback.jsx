import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Home,
  Wrench,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MaintenanceFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    recentTrend: 0,
  });

  // Fetch feedbacks for current maintenance staff
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

        // Try to fetch feedbacks with complaint details
        const response = await fetch(
          `${API_URL}/api/feedbacks/maintenance-feedbacks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ Feedbacks loaded:', result.feedbacks);

            // Transform feedback data to include facility information
            const transformedFeedbacks =
              result.feedbacks?.map(feedback => {
                // Extract complaint details from feedback or related data
                const complaintDetails =
                  feedback.complaint || feedback.complaint_details || {};

                return {
                  ...feedback,
                  complaint_details: {
                    facility_type:
                      complaintDetails.facility_type ||
                      feedback.facility_type ||
                      'N/A',
                    hostel_name:
                      complaintDetails.hostel_name ||
                      feedback.hostel_name ||
                      'Unknown Hostel',
                    room_number:
                      complaintDetails.room_number || feedback.room_number,
                    issue_description:
                      complaintDetails.issue_description ||
                      feedback.issue_description,
                    maintenance_remarks:
                      complaintDetails.maintenance_remarks ||
                      feedback.maintenance_remarks,
                  },
                };
              }) || [];

            console.log('Transformed feedbacks:', transformedFeedbacks);
            setFeedbacks(transformedFeedbacks);
            calculateStats(transformedFeedbacks);
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

    // Only fetch if user is maintenance staff
    if (user?.id && user?.role === 'maintenance') {
      fetchFeedbacks();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, user?.role]);

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

    // Calculate recent trend (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentFeedbacks = feedbacksData.filter(
      f => new Date(f.submitted_at) >= thirtyDaysAgo
    ).length;

    const previousFeedbacks = feedbacksData.filter(
      f =>
        new Date(f.submitted_at) >= sixtyDaysAgo &&
        new Date(f.submitted_at) < thirtyDaysAgo
    ).length;

    const recentTrend =
      previousFeedbacks > 0
        ? Math.round(
            ((recentFeedbacks - previousFeedbacks) / previousFeedbacks) * 100
          )
        : recentFeedbacks > 0
          ? 100
          : 0;

    setStats({
      total,
      averageRating,
      ratingDistribution,
      recentTrend,
    });
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const studentName = feedback.student_name || '';
    const comment = feedback.comment || '';
    const facilityType = feedback.complaint_details?.facility_type || '';
    const hostelName = feedback.complaint_details?.hostel_name || '';

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostelName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // Format date
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get initials from name
  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Render stars
  const renderStars = rating => {
    return [1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={16}
        className={
          star <= rating ? 'fill-purple-600 text-purple-600' : 'text-gray-300'
        }
      />
    ));
  };

  // Skeleton components
  const HeaderSkeleton = () => (
    <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
      <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const StatsCardSkeleton = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32 bg-gray-200" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-gray-200" />
              <Skeleton className="h-4 w-24 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-8 bg-gray-200" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const FeedbackCardSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded bg-gray-200" />
                ))}
              </div>
            </div>
            <Skeleton className="h-3 w-24 bg-gray-200" />
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
            <Skeleton className="h-16 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />

        {/* Performance Overview Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32 bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2 bg-gray-200" />
              <Skeleton className="h-3 w-24 bg-gray-200" />
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32 bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2 bg-gray-200" />
              <Skeleton className="h-3 w-24 bg-gray-200" />
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32 bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2 bg-gray-200" />
              <Skeleton className="h-3 w-24 bg-gray-200" />
            </CardContent>
          </Card>
        </div>

        {/* Filters Skeletons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Skeleton className="h-9 flex-1 max-w-md bg-gray-200" />
          <Skeleton className="h-9 w-[180px] bg-gray-200" />
          <Skeleton className="h-7 w-24 rounded-full bg-gray-200" />
        </div>

        {/* Feedback List Skeletons */}
        <div className="space-y-4">
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
        <h1 className="text-3xl font-bold tracking-tight">My Feedback</h1>
        <p className="text-white/90">
          Welcome back, {user?.name}. View ratings and comments from students
          for your work
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Feedback Card */}
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
            <p className="text-xs text-gray-600 mt-1">Total reviews received</p>
          </CardContent>
        </Card>

        {/* Average Rating Card */}
        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Average Rating
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {stats.averageRating}/5.0
            </div>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trend Card */}
        <Card className="border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">
              Recent Trend
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              {stats.recentTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp
                  className="h-4 w-4 text-red-600"
                  style={{ transform: 'rotate(180deg)' }}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats.recentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {stats.recentTrend >= 0 ? '+' : ''}
              {stats.recentTrend}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Distribution Card */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
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
                  <div className="flex space-x-0.5">{renderStars(rating)}</div>
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
                        width:
                          stats.total > 0
                            ? `${(stats.ratingDistribution[rating] / stats.total) * 100}%`
                            : '0%',
                        maxWidth: '100%',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Summary Card */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-purple-600">
                {stats.averageRating}/5.0
              </div>
              <div className="flex justify-center space-x-0.5">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Based on <span className="font-semibold">{stats.total}</span>{' '}
                  reviews
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {stats.ratingDistribution[5] +
                      stats.ratingDistribution[4]}{' '}
                    positive
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    {stats.ratingDistribution[3]} neutral
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {stats.ratingDistribution[2] +
                      stats.ratingDistribution[1]}{' '}
                    needs improvement
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          />
          <Input
            placeholder="Search by student, comment, facility, or hostel..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500 w-full"
          />
        </div>

        {/* Rating Filter and Count */}
        <div className="flex flex-col xs:flex-row gap-3 items-stretch xs:items-center">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full xs:w-[180px] h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Ratings" />
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

          <Badge
            variant="secondary"
            className="h-7 flex items-center justify-center min-w-[80px]"
          >
            {filteredFeedbacks.length} of {stats.total}
          </Badge>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">
              {stats.total === 0 ? 'No Feedback Yet' : 'No Feedback Found'}
            </h3>
            <p className="text-gray-600">
              {stats.total === 0
                ? "You haven't received any feedback from students yet."
                : 'Try adjusting your filters or search terms'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map(feedback => (
            <Card
              key={feedback.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {getInitials(feedback.student_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
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
                        {renderStars(feedback.rating)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {feedback.comment || 'No comment provided'}
                    </p>

                    {/* Complaint Details Section */}
                    <div className="bg-gray-50 rounded-lg p-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                        {/* Facility Type */}
                        <div className="flex items-center gap-2">
                          <Wrench size={12} className="text-gray-500" />
                          <span className="font-medium text-gray-700">
                            Facility:
                          </span>
                          <Badge variant="outline" className="h-4 text-xs">
                            {feedback.complaint_details?.facility_type ||
                              'General Maintenance'}
                          </Badge>
                        </div>

                        {/* Hostel and Room */}
                        <div className="flex items-center gap-2">
                          <Home size={12} className="text-gray-500" />
                          <span className="font-medium text-gray-700">
                            Location:
                          </span>
                          <span className="text-gray-600">
                            {feedback.complaint_details?.hostel_name ||
                              'Unknown Hostel'}
                            {feedback.complaint_details?.room_number && (
                              <span className="ml-1">
                                (Room {feedback.complaint_details.room_number})
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Issue Description */}
                        {feedback.complaint_details?.issue_description && (
                          <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                            <span className="font-medium text-gray-700">
                              Issue Description:
                            </span>
                            <p className="text-gray-600 mt-1 text-xs italic">
                              "{feedback.complaint_details.issue_description}"
                            </p>
                          </div>
                        )}

                        {/* Maintenance Remarks */}
                        {feedback.complaint_details?.maintenance_remarks && (
                          <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                            <span className="font-medium text-blue-600">
                              Your Remarks:
                            </span>
                            <p className="text-blue-600 mt-1 text-xs italic">
                              "{feedback.complaint_details.maintenance_remarks}"
                            </p>
                          </div>
                        )}
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

export default MaintenanceFeedback;
