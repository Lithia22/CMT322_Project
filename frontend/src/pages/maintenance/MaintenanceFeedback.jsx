import { useState } from 'react';
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
} from 'lucide-react';
import {
  mockFeedbacks,
  mockComplaints,
  mockMaintenanceStaff,
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const MaintenanceFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  // Get current maintenance staff
  const currentStaff = mockMaintenanceStaff.find(
    staff => staff.id === user?.id || staff.id === user?.id?.toString()
  );

  // Get feedback for current maintenance staff
  const staffFeedbacks = mockFeedbacks.filter(
    feedback => feedback.maintenanceId === currentStaff?.id
  );

  const feedbackWithDetails = staffFeedbacks.map(feedback => {
    const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
    return { ...feedback, complaintDetails: complaint };
  });

  const filteredFeedbacks = feedbackWithDetails.filter(feedback => {
    const matchesSearch =
      feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.complaintDetails?.facilityType
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const totalFeedbacks = staffFeedbacks.length;
  const averageRating =
    totalFeedbacks > 0
      ? (
          staffFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
        ).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: staffFeedbacks.filter(f => f.rating === 5).length,
    4: staffFeedbacks.filter(f => f.rating === 4).length,
    3: staffFeedbacks.filter(f => f.rating === 3).length,
    2: staffFeedbacks.filter(f => f.rating === 2).length,
    1: staffFeedbacks.filter(f => f.rating === 1).length,
  };

  // Skeleton components
  const HeaderSkeleton = () => (
    <div className="rounded-xl p-6 bg-white border-2 border-gray-100 dark:bg-slate-800 dark:border-gray-700">
      <Skeleton className="h-8 w-64 mb-2 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-96 bg-gray-200 dark:bg-gray-700" />
    </div>
  );

  const StatsCardSkeleton = () => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-4 w-8 bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const AverageRatingSkeleton = () => (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <Skeleton className="h-12 w-24 mb-4 bg-gray-200 dark:bg-gray-700" />
        <div className="flex space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
        <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
      </CardContent>
    </Card>
  );

  const FeedbackCardSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            </div>
            <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCardSkeleton />
          <AverageRatingSkeleton />
        </div>

        {/* Filters Skeletons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Skeleton className="h-9 flex-1 max-w-md bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-9 w-[180px] bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-7 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
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
        <h1 className="text-3xl font-bold tracking-tight">View Feedback</h1>
        <p className="text-white/90">
          View ratings and comments from students for your work
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Distribution Card */}
        <Card className="h-full border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
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
                  <span className="text-muted-foreground w-4">{rating}</span>
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
                <span className="font-semibold">
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Average Rating Card - Improved responsive alignment */}
        <Card className="h-full border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-purple-600">
                {averageRating}/5.0
              </div>
              <div className="flex justify-center space-x-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={24}
                    className={
                      star <= Math.round(averageRating)
                        ? 'fill-purple-600 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {totalFeedbacks} reviews
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Improved responsive layout */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Search by student, comment, or facility..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500 w-full"
          />
        </div>

        {/* Rating Filter and Count - Stack on mobile, row on larger screens */}
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
            {filteredFeedbacks.length} of {totalFeedbacks}
          </Badge>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Feedback Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map(feedback => (
            <Card key={feedback.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-sm">
                            {feedback.studentName}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <span>Matric: {feedback.matricNumber}</span>
                            <Calendar size={10} />
                            <span>{feedback.submittedDate}</span>
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

                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {feedback.comment}
                    </p>

                    {feedback.complaintDetails && (
                      <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                          <div>
                            <span className="font-medium">Facility:</span>{' '}
                            {feedback.complaintDetails.facilityType}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Hostel:</span>
                            <span>{feedback.complaintDetails.hostelName}</span>
                            <Badge variant="outline" className="h-4 text-xs">
                              Room {feedback.complaintDetails.roomNumber}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Issue:</span>
                            <span>
                              {feedback.complaintDetails.issueDescription}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Status:</span>
                            <Badge variant="outline" className="h-4 text-xs">
                              {feedback.complaintDetails.status}
                            </Badge>
                          </div>
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

export default MaintenanceFeedback;
