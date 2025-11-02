import { useState } from 'react';
import { Star, Send, ThumbsUp, MessageCircle } from 'lucide-react';
import { mockComplaints, mockFeedbacks } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Feedback = () => {
  const { user } = useAuth();
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Only show resolved complaints for current student
  const resolvedComplaints = mockComplaints.filter(
    complaint => complaint.status === 'Resolved' && complaint.studentId === user?.studentId
  );

  // Filter feedback for current student
  const studentFeedbacks = mockFeedbacks.filter(
    feedback => feedback.studentId === user?.studentId
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedComplaintId && rating > 0 && comment.trim()) {
      // In real app, this would send to backend
      console.log('Feedback submitted:', {
        complaintId: selectedComplaintId,
        studentId: user?.studentId,
        studentName: user?.name,
        rating,
        comment,
        submittedDate: new Date().toLocaleDateString()
      });
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSelectedComplaintId('');
        setRating(0);
        setComment('');
        setSubmitted(false);
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ThumbsUp size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve our service quality and response time.
          </p>
          <div className="flex justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Feedback & Rating</h1>
          <p className="text-gray-600">
            Share your experience with our complaint resolution service
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MessageCircle className="mr-3 text-purple-600" size={28} />
                Submit Your Feedback
              </h2>

              {resolvedComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <ThumbsUp className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resolved Complaints</h3>
                  <p className="text-gray-600">
                    You can only provide feedback for complaints that have been resolved.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Select Resolved Complaint */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Resolved Complaint <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedComplaintId}
                      onChange={(e) => setSelectedComplaintId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a complaint...</option>
                      {resolvedComplaints.map((complaint) => (
                        <option key={complaint.id} value={complaint.id}>
                          #{complaint.id} - {complaint.facilityType} ({complaint.hostelName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Rate Our Service <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={40}
                            className={
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {rating === 5 && '⭐ Excellent!'}
                        {rating === 4 && '⭐ Very Good!'}
                        {rating === 3 && '⭐ Good'}
                        {rating === 2 && '⭐ Fair'}
                        {rating === 1 && '⭐ Poor'}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Comments <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="5"
                      placeholder="Tell us about your experience..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!selectedComplaintId || rating === 0 || !comment.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Send size={20} />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Previous Feedbacks Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Previous Feedbacks</h3>
              
              {studentFeedbacks.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No feedback submitted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {studentFeedbacks.map((feedback) => {
                    const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
                    return (
                      <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            Complaint #{feedback.complaintId}
                          </span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={
                                  star <= feedback.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {complaint && (
                          <p className="text-xs text-gray-600 mb-2">
                            {complaint.facilityType} - {complaint.hostelName}
                          </p>
                        )}
                        <p className="text-sm text-gray-700">{feedback.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">{feedback.submittedDate}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-purple-800">
                <strong>Note:</strong> You can only provide feedback for complaints that have been marked as "Resolved".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;