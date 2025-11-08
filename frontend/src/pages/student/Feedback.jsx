import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Send } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  });

  // Get stored complaints and merge with mock data
  const storedComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
  const allComplaints = [...mockComplaints, ...storedComplaints];

  const resolvedComplaints = allComplaints.filter(
    complaint => complaint.status === 'Resolved' && complaint.matricNumber === user?.matricNumber
  );

  // Get stored feedbacks and merge with mock data
  const storedFeedbacks = JSON.parse(localStorage.getItem('mockFeedbacks') || '[]');
  const allFeedbacks = [...mockFeedbacks, ...storedFeedbacks];

  const studentFeedbacks = allFeedbacks.filter(
    feedback => feedback.matricNumber === user?.matricNumber
  );

  // Complaints without feedback (for Give Feedback tab)
  const complaintsWithoutFeedback = resolvedComplaints.filter(complaint => 
    !studentFeedbacks.some(feedback => feedback.complaintId === complaint.id)
  );

  // Complaints with feedback (for Feedback Done tab)
  const complaintsWithFeedback = studentFeedbacks.map(feedback => {
    const complaint = allComplaints.find(c => c.id === feedback.complaintId);
    return { ...feedback, complaint };
  });

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

    const existingFeedbacks = JSON.parse(localStorage.getItem('mockFeedbacks') || '[]');
    existingFeedbacks.push(newFeedback);
    localStorage.setItem('mockFeedbacks', JSON.stringify(existingFeedbacks));

    toast.success('Feedback submitted successfully!');
    setDialogOpen(false);
    form.reset();
    setSelectedComplaint(null);
    window.location.reload();
  };

  const openFeedbackDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
    form.reset({ rating: 0, comment: '' });
  };

  // Skeleton components
  const HeaderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-64 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const TabsSkeleton = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 bg-gray-200" />
        <Skeleton className="h-10 w-32 bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-200" />
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
                </div>
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-8 w-full bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const EmptyStateSkeleton = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Skeleton className="h-12 w-12 mx-auto mb-4 bg-gray-200 rounded-full" />
        <Skeleton className="h-6 w-48 mx-auto mb-2 bg-gray-200" />
        <Skeleton className="h-4 w-64 mx-auto bg-gray-200" />
      </CardContent>
    </Card>
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
          background: 'linear-gradient(90deg, hsl(270, 76%, 53%), hsl(45, 93%, 47%))'
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Feedback & Rating</h2>
        <p className="text-white/90">Share your experience with our complaint resolution service</p>
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
                <h3 className="text-lg font-semibold mb-2 text-black">No Resolved Issues Yet</h3>
                <p className="text-gray-600">
                  You can only provide feedback for complaints marked as Resolved.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaintsWithoutFeedback.map((complaint) => (
                <Card key={complaint.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-black mb-1">{complaint.facilityType}</h4>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Resolved
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{complaint.issueDescription}</p>
                    
                    {complaint.adminRemarks ? (
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                        <p className="text-xs font-medium text-gray-800 mb-1">Admin Remarks:</p>
                        <p className="text-xs text-gray-700 line-clamp-2">{complaint.adminRemarks}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-3">No remarks</p>
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
                <h3 className="text-lg font-semibold mb-2 text-black">No Feedback Submitted Yet</h3>
                <p className="text-gray-600">
                  You haven't provided any feedback yet. Once you submit feedback for resolved complaints, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaintsWithFeedback.map((feedbackItem) => (
                <Card key={feedbackItem.id} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-black mb-1">
                          {feedbackItem.complaint?.facilityType || 'Unknown Facility'}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= feedbackItem.rating ? 'fill-purple-600 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{feedbackItem.comment}</p>
                    
                    {feedbackItem.complaint?.adminRemarks ? (
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                        <p className="text-xs font-medium text-gray-800 mb-1">Admin Remarks:</p>
                        <p className="text-xs text-gray-700 line-clamp-2">{feedbackItem.complaint.adminRemarks}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-3">No remarks</p>
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
        <DialogContent className="sm:max-md">
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
                                    ? 'fill-purple-600 text-yellow-400'
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