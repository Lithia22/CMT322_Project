// frontend/src/pages/student/Feedback.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Send, ThumbsUp, Calendar, MessageSquare, MapPin } from 'lucide-react';
import { mockComplaints, mockFeedbacks } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please provide a rating').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

const Feedback = () => {
  const { user } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const resolvedComplaints = mockComplaints.filter(
    complaint => complaint.status === 'Resolved' && complaint.matricNumber === user?.matricNumber
  );

  const studentFeedbacks = mockFeedbacks.filter(
    feedback => feedback.matricNumber === user?.matricNumber
  );

  // Check which resolved complaints don't have feedback yet
  const complaintsWithoutFeedback = resolvedComplaints.filter(complaint => 
    !studentFeedbacks.some(feedback => feedback.complaintId === complaint.id)
  );

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = form.watch('rating');
  const [hoverRating, setHoverRating] = useState(0);

  const onSubmit = (data) => {
    if (!selectedComplaint) return;

    const newFeedback = {
      id: Date.now(),
      complaintId: selectedComplaint.id,
      matricNumber: user.matricNumber,
      studentName: user.name,
      ...data,
      submittedDate: new Date().toISOString().split('T')[0]
    };

    // Save to localStorage for demo purposes
    const existingFeedbacks = JSON.parse(localStorage.getItem('mockFeedbacks') || '[]');
    existingFeedbacks.push(newFeedback);
    localStorage.setItem('mockFeedbacks', JSON.stringify(existingFeedbacks));

    toast.success('Feedback submitted successfully!');
    setDialogOpen(false);
    form.reset();
    setSelectedComplaint(null);
  };

  const openFeedbackDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
    form.reset({ rating: 0, comment: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-xl p-6 text-white shadow-lg"
        style={{
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Feedback & Rating</h2>
        <p className="text-white/90">Share your experience with our complaint resolution service</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolved Complaints Available for Feedback */}
        <div>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-black">Resolved Complaints</CardTitle>
              <CardDescription className="text-gray-600">
                Provide feedback for your resolved issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complaintsWithoutFeedback.length === 0 ? (
                <div className="text-center py-8">
                  <ThumbsUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-black">No Pending Feedback</h3>
                  <p className="text-gray-600">
                    All your resolved complaints have been reviewed or no complaints are resolved yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaintsWithoutFeedback.map((complaint) => (
                    <Card key={complaint.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-black mb-1">{complaint.facilityType}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin size={14} />
                              <span>{complaint.hostelName} • Room {complaint.roomNumber}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{complaint.issueDescription}</p>
                          </div>
                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                            Resolved
                          </Badge>
                        </div>
                        
                        {complaint.adminRemarks && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                            <p className="text-sm font-medium text-blue-800 mb-1">Admin Remarks:</p>
                            <p className="text-sm text-blue-700">{complaint.adminRemarks}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <Calendar size={12} className="inline mr-1" />
                            Resolved on {complaint.submittedDate}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm"
                                onClick={() => openFeedbackDialog(complaint)}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Give Feedback
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Previous Feedbacks */}
        <div>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-black">Your Previous Feedbacks</CardTitle>
              <CardDescription className="text-gray-600">Your feedback history</CardDescription>
            </CardHeader>
            <CardContent>
              {studentFeedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No feedback submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentFeedbacks.map((feedback) => {
                    const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
                    return (
                      <Card key={feedback.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-black text-sm">
                                {complaint?.facilityType || 'Unknown Facility'}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {complaint?.hostelName} • Room {complaint?.roomNumber}
                              </p>
                            </div>
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
                          <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar size={12} className="mr-1" />
                            {feedback.submittedDate}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Alert className="mt-4 bg-purple-50 border-purple-200">
            <AlertDescription className="text-purple-800 text-sm">
              <strong>Note:</strong> You can only provide feedback for complaints marked as "Resolved" that you haven't reviewed yet.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-black">Provide Feedback</DialogTitle>
            <DialogDescription className="text-gray-600">
              Share your experience for: {selectedComplaint?.facilityType}
            </DialogDescription>
          </DialogHeader>
          
          {selectedComplaint && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Rate Our Service</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => field.onChange(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={32}
                                className={
                                  star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      {rating > 0 && (
                        <FormDescription>
                          {rating === 5 && '⭐ Excellent!'}
                          {rating === 4 && '⭐ Very Good!'}
                          {rating === 3 && '⭐ Good'}
                          {rating === 2 && '⭐ Fair'}
                          {rating === 1 && '⭐ Poor'}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Your Comments</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your experience with this complaint resolution..."
                          rows={4}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feedback;