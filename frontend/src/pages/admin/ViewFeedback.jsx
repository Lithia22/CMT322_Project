import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Star, Calendar, User, MessageSquare } from 'lucide-react';
import { mockFeedbacks, mockComplaints } from '@/data/mockData';

const ViewFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Student Feedback</h2>
        <p className="text-muted-foreground">View ratings and comments from students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedbacks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{averageRating}</div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">{rating}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={10}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
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

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search feedback..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
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

            <div className="flex items-center justify-center bg-muted rounded-md px-3 text-sm">
              Showing {filteredFeedbacks.length} of {mockFeedbacks.length}
            </div>
          </div>
        </CardContent>
      </Card>

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
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          <User size={20} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{feedback.studentName}</h3>
                            <p className="text-sm text-muted-foreground">Student ID: {feedback.studentId}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                            <span className="ml-2 text-sm font-semibold">{feedback.rating}.0</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">{feedback.comment}</p>

                        {feedback.complaintDetails && (
                          <Card className="bg-muted/50">
                            <CardContent className="pt-4">
                              <h4 className="font-semibold text-sm mb-2">Related Complaint</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div><span className="font-medium">Facility:</span> {feedback.complaintDetails.facilityType}</div>
                                <div><span className="font-medium">Hostel:</span> {feedback.complaintDetails.hostelName}</div>
                                <div><span className="font-medium">Room:</span> {feedback.complaintDetails.roomNumber}</div>
                                <div><span className="font-medium">Issue:</span> {feedback.complaintDetails.issueDescription}</div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 text-sm text-muted-foreground mb-2">
                      <Calendar size={14} />
                      <span>{feedback.submittedDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Complaint ID: #{feedback.complaintId}</p>
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