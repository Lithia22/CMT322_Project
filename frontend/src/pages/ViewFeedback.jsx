import { useState } from 'react';
import { Star, Search, Filter, Calendar, User, MessageSquare } from 'lucide-react';
import { mockFeedbacks, mockComplaints } from '../data/mockData';

const ViewFeedback = () => {
  const [feedbacks] = useState(mockFeedbacks);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Combine feedback with complaint details
  const feedbackWithDetails = feedbacks.map(feedback => {
    const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
    return {
      ...feedback,
      complaintDetails: complaint
    };
  });

  // Filter feedback
  const filteredFeedbacks = feedbackWithDetails.filter(feedback => {
    const matchesSearch = 
      feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.complaintDetails?.facilityType.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = ratingFilter === 'All' || feedback.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: feedbacks.filter(f => f.rating === 5).length,
    4: feedbacks.filter(f => f.rating === 4).length,
    3: feedbacks.filter(f => f.rating === 3).length,
    2: feedbacks.filter(f => f.rating === 2).length,
    1: feedbacks.filter(f => f.rating === 1).length
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return 'text-green-600 bg-green-100';
      case 4: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-orange-600 bg-orange-100';
      case 1: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Student Feedback</h1>
          <p className="text-gray-600">View ratings and comments from students</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <MessageSquare className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Total Feedback</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalFeedbacks}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Star className="text-yellow-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Average Rating</h3>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-3xl font-bold text-gray-800">{averageRating}</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{rating} stars</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{ratingDistribution[rating]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg">
              Showing {filteredFeedbacks.length} of {feedbacks.length} feedback entries
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Section - Rating and Student Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${getRatingColor(feedback.rating)}`}>
                          <User size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{feedback.studentName}</h3>
                          <p className="text-sm text-gray-600">Student ID: {feedback.studentId}</p>
                        </div>
                      </div>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-gray-800">
                          {feedback.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                    </div>

                    {/* Complaint Details */}
                    {feedback.complaintDetails && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Related Complaint</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Facility:</span> {feedback.complaintDetails.facilityType}
                          </div>
                          <div>
                            <span className="font-medium">Hostel:</span> {feedback.complaintDetails.hostelName}
                          </div>
                          <div>
                            <span className="font-medium">Room:</span> {feedback.complaintDetails.roomNumber}
                          </div>
                          <div>
                            <span className="font-medium">Issue:</span> {feedback.complaintDetails.issueDescription}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Date */}
                  <div className="lg:text-right">
                    <div className="flex items-center lg:justify-end space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar size={16} />
                      <span>{feedback.submittedDate}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Complaint ID: #{feedback.complaintId}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFeedback;