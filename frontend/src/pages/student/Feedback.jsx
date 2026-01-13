import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, AlertCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = form.watch('rating');
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch resolved complaints without feedback
  useEffect(() => {
    const fetchResolvedComplaints = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        // Fetch user's complaints
        const response = await fetch(
          `${API_URL}/api/complaints/my-complaints`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Filter resolved complaints
            const resolved =
              result.complaints?.filter(c => c.status === 'resolved') || [];
            setResolvedComplaints(resolved);
          } else {
            toast.error(result.error || 'Failed to load complaints');
            setResolvedComplaints([]);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to load complaints');
          setResolvedComplaints([]);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load complaints: ' + error.message);
        setResolvedComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResolvedComplaints();
  }, []);

  // Fetch user's feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${API_URL}/api/feedbacks/my-feedbacks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setMyFeedbacks(result.feedbacks || []);
          } else {
            setMyFeedbacks([]);
          }
        } else {
          // If endpoint doesn't exist, create empty array
          setMyFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setMyFeedbacks([]);
      }
    };

    fetchFeedbacks();
  }, []);

  // Complaints without feedback (for Give Feedback tab)
  const complaintsWithoutFeedback = resolvedComplaints.filter(
    complaint =>
      !myFeedbacks.some(feedback => feedback.complaint_id === complaint.id)
  );

  // Complaints with feedback (for Feedback Done tab)
  const complaintsWithFeedback = myFeedbacks.map(feedback => {
    const complaint = resolvedComplaints.find(
      c => c.id === feedback.complaint_id
    );
    return { ...feedback, complaint };
  });

  const onSubmit = async data => {
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          complaint_id: selectedComplaint.id,
          rating: data.rating,
          comment: data.comment,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add new feedback to state
        const newFeedback = {
          ...result.feedback,
          complaint: selectedComplaint,
        };

        setMyFeedbacks(prev => [newFeedback, ...prev]);

        // Remove complaint from complaintsWithoutFeedback
        setResolvedComplaints(prev =>
          prev.filter(c => c.id !== selectedComplaint.id)
        );

        form.reset();
        setDialogOpen(false);
        setSelectedComplaint(null);
        toast.success('Feedback submitted successfully!');
      } else {
        toast.error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFeedbackDialog = complaint => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
    form.reset({ rating: 0, comment: '' });
  };

  // Skeleton components
  const HeaderSkeleton = () => (
    <div className="rounded-xl p-6 bg-white border-2 border-gray-100">
      <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const ComplaintCardSkeleton = () => (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-3/4 bg-gray-200" />
          <Skeleton className="h-8 w-full bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );

  const TabsSkeleton = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 bg-gray-200" />
        <Skeleton className="h-10 w-32 bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <ComplaintCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <TabsSkeleton />
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
        <h2 className="text-3xl font-bold tracking-tight">Feedback & Rating</h2>
        <p className="text-white/90">
          Share your experience with our complaint resolution service
        </p>
      </div>

      {/* Tabs for Give Feedback and Feedback Done */}
      <Tabs defaultValue="give-feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="give-feedback"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Give Feedback
          </TabsTrigger>
          <TabsTrigger
            value="feedback-done"
            className="data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white"
          >
            Feedback Done
          </TabsTrigger>
        </TabsList>

        {/* Give Feedback Tab */}
        <TabsContent value="give-feedback">
          {complaintsWithoutFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">
                  {resolvedComplaints.length === 0
                    ? 'No Resolved Issues Yet'
                    : 'All Resolved Issues Have Feedback'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {resolvedComplaints.length === 0
                    ? 'You can only provide feedback for complaints marked as Resolved.'
                    : 'You have provided feedback for all your resolved complaints.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaintsWithoutFeedback.map(complaint => (
                <Card
                  key={complaint.id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-black mb-1">
                          {complaint.facility_type || 'Unknown Facility'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Submitted: {complaint.submitted_date || 'N/A'}
                        </p>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Resolved
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {complaint.issue_description}
                    </p>

                    {complaint.maintenance_remarks ? (
                      <div className="bg-blue-50 border border-blue-100 rounded p-2 mb-3">
                        <p className="text-xs font-medium text-blue-800 mb-1">
                          📝 Maintenance Remarks:
                        </p>
                        <p className="text-xs text-blue-700">
                          {complaint.maintenance_remarks}
                        </p>
                        {complaint.assigned_maintenance && (
                          <p className="text-xs text-blue-600 mt-1">
                            <span className="font-medium">Fixed by:</span>{' '}
                            {complaint.assigned_maintenance}
                            {complaint.resolution_date && (
                              <span className="ml-2">
                                • On:{' '}
                                {new Date(
                                  complaint.resolution_date
                                ).toLocaleDateString('en-MY')}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-3">
                        No remarks from maintenance staff
                      </p>
                    )}
                    <div className="flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => openFeedbackDialog(complaint)}
                        className="bg-purple-600 hover:bg-purple-700 text-white h-8"
                      >
                        Give Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Feedback Done Tab */}
        <TabsContent value="feedback-done">
          {complaintsWithFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">
                  No Feedback Submitted Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't provided any feedback yet. Once you submit
                  feedback for resolved complaints, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaintsWithFeedback.map(feedbackItem => (
                <Card
                  key={feedbackItem.id}
                  className="border border-gray-200 shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-black mb-1">
                          {feedbackItem.complaint?.facility_type ||
                            'Unknown Facility'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Submitted:{' '}
                          {feedbackItem.submitted_at
                            ? new Date(
                                feedbackItem.submitted_at
                              ).toLocaleDateString('en-MY')
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= feedbackItem.rating
                                ? 'fill-purple-600 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {feedbackItem.comment}
                    </p>

                    {feedbackItem.complaint?.maintenance_remarks ? (
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                        <p className="text-xs font-medium text-gray-800 mb-1">
                          Maintenance Remarks:
                        </p>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {feedbackItem.complaint.maintenance_remarks}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-3">
                        No remarks from maintenance
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Feedback Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-black">Provide Feedback</DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedComplaint && (
                <>
                  Share your experience for:{' '}
                  <strong>{selectedComplaint.facility_type}</strong>
                  <br />
                  <span className="text-xs">
                    Issue:{' '}
                    {selectedComplaint.issue_description.substring(0, 50)}...
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Rating</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2 justify-center">
                          {[1, 2, 3, 4, 5].map(star => (
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
                                    ? 'fill-purple-600 text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        Your Comments
                      </FormLabel>
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
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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
