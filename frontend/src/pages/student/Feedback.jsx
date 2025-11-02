import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, Send, ThumbsUp, Calendar } from 'lucide-react';
import { mockComplaints, mockFeedbacks } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const feedbackSchema = z.object({
  complaintId: z.string().min(1, 'Please select a complaint'),
  rating: z.number().min(1, 'Please provide a rating').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

const Feedback = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const resolvedComplaints = mockComplaints.filter(
    complaint => complaint.status === 'Resolved' && complaint.studentId === user?.studentId
  );

  const studentFeedbacks = mockFeedbacks.filter(
    feedback => feedback.studentId === user?.studentId
  );

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { complaintId: '', rating: 0, comment: '' },
  });

  const rating = form.watch('rating');

  const onSubmit = (data) => {
    console.log('Feedback submitted:', data);
    setSubmitted(true);
    setTimeout(() => {
      form.reset();
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ThumbsUp size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Thank You for Your Feedback!</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback helps us improve our service quality and response time.
            </p>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Feedback & Rating</h2>
        <p className="text-muted-foreground">Share your experience with our complaint resolution service</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Feedback</CardTitle>
              <CardDescription>Help us improve by sharing your experience</CardDescription>
            </CardHeader>
            <CardContent>
              {resolvedComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <ThumbsUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Resolved Complaints</h3>
                  <p className="text-muted-foreground">
                    You can only provide feedback for complaints that have been resolved.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="complaintId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Resolved Complaint</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a complaint..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {resolvedComplaints.map((complaint) => (
                                <SelectItem key={complaint.id} value={complaint.id.toString()}>
                                  #{complaint.id} - {complaint.facilityType} ({complaint.hostelName})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate Our Service</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
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
                          <FormLabel>Your Comments</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your experience..." 
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Previous Feedbacks</CardTitle>
              <CardDescription>Feedback history</CardDescription>
            </CardHeader>
            <CardContent>
              {studentFeedbacks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No feedback submitted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {studentFeedbacks.map((feedback) => {
                    const complaint = mockComplaints.find(c => c.id === feedback.complaintId);
                    return (
                      <Card key={feedback.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              Complaint #{feedback.complaintId}
                            </span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
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
                            <p className="text-xs text-muted-foreground mb-2">
                              {complaint.facilityType} - {complaint.hostelName}
                            </p>
                          )}
                          <p className="text-sm mb-2">{feedback.comment}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
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

          <Alert className="mt-4">
            <AlertDescription className="text-sm">
              <strong>Note:</strong> You can only provide feedback for complaints marked as "Resolved".
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default Feedback;