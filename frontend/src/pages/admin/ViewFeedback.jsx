import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Star, Calendar, User, MessageSquare, Building } from 'lucide-react';
import { mockFeedbacks, mockComplaints, hostelOptions } from '@/data/mockData';

const ViewFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  const feedbackWithDetails = mockFeedbacks.map(feedback => {
    const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
    return { ...feedback, complaintDetails: complaint };
  });

  const filteredFeedbacks = feedbackWithDetails.filter(feedback => {
    const matchesSearch = 
      feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.complaintDetails?.facilityType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRating = ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const totalFeedbacks = mockFeedbacks.length;
  const averageRating = mockFeedbacks.length > 0 
    ? (mockFeedbacks.reduce((sum, f) => sum + f.rating, 0) / mockFeedbacks.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: mockFeedbacks.filter(f => f.rating === 5).length,
    4: mockFeedbacks.filter(f => f.rating === 4).length,
    3: mockFeedbacks.filter(f => f.rating === 3).length,
    2: mockFeedbacks.filter(f => f.rating === 2).length,
    1: mockFeedbacks.filter(f => f.rating === 1).length
  };

  // Get all hostels with feedback counts (including 0)
  const feedbackByHostel = hostelOptions.map(hostel => ({
    name: hostel,
    count: mockFeedbacks.filter(feedback => {
      const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
      return complaint?.hostelName === hostel;
    }).length
  }));

  // Calculate positive feedback percentage (4-5 stars)
  const positiveFeedbackCount = mockFeedbacks.filter(f => f.rating >= 4).length;
  const positiveFeedbackRate = totalFeedbacks > 0 ? Math.round((positiveFeedbackCount / totalFeedbacks) * 100) : 0;

  // Skeleton components
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-4 w-8 bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32 bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 bg-muted" />
              <Skeleton className="h-4 w-8 bg-muted" />
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
          <Skeleton className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-muted" />
              <Skeleton className="h-5 w-16 bg-muted" />
            </div>
            <Skeleton className="h-3 w-24 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2 bg-muted" />
          <Skeleton className="h-4 w-96 bg-muted" />
        </div>

        <StatsSkeleton />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32 bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-4 w-8 bg-muted" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32 bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20 bg-muted" />
                  <Skeleton className="h-4 w-8 bg-muted" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Skeleton className="h-9 flex-1 bg-muted" />
          <Skeleton className="h-9 w-[180px] bg-muted" />
          <Skeleton className="h-6 w-24 bg-muted" />
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
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Student Feedback</h1>
        <p className="text-white/90">View ratings and comments from students</p>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Feedback by Hostel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedbackByHostel.map(({name, count}) => (
              <div key={name} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-4">{rating}</span>
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={star <= rating ? 'fill-purple-600 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <span className="font-semibold">{ratingDistribution[rating]}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search by student, comment, or facility..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
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
          {filteredFeedbacks.length} of {mockFeedbacks.length}
        </Badge>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Feedback Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-sm">{feedback.studentName}</h3>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <span>ID: {feedback.studentId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={star <= feedback.rating ? 'fill-purple-600 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-sm font-semibold ml-1">{feedback.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{feedback.comment}</p>

                    {feedback.complaintDetails && (
                      <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                          <div>
                            <span className="font-medium">Facility:</span> {feedback.complaintDetails.facilityType}
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
                            <span>{feedback.complaintDetails.issueDescription}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            <span>{feedback.complaintDetails.submittedDate}</span>
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

export default ViewFeedback;