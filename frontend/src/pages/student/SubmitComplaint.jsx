import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { facilityTypes } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const complaintSchema = z.object({
  facilityType: z.string().min(1, 'Please select a facility type'),
  issueDescription: z.string().min(10, 'Description must be at least 10 characters'),
  photo: z.any().optional(),
});

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      facilityType: '',
      issueDescription: '',
    },
  });

  const onSubmit = (data) => {
    // In a real app, you would send this to your backend
    const newComplaint = {
      id: Date.now(),
      matricNumber: user.matricNumber,
      studentName: user.name,
      hostelName: user.hostelName,
      roomNumber: user.roomNumber,
      facilityType: data.facilityType,
      issueDescription: data.issueDescription,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      photo: data.photo ? data.photo.name : null,
      adminRemarks: ''
    };

    // Save to localStorage for demo purposes
    const existingComplaints = JSON.parse(localStorage.getItem('mockComplaints') || '[]');
    existingComplaints.push(newComplaint);
    localStorage.setItem('mockComplaints', JSON.stringify(existingComplaints));

    toast.success('Complaint submitted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card className="border border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-yellow-500 text-white rounded-t-lg">
          <CardTitle>Submit New Complaint</CardTitle>
          <CardDescription className="text-white/90">
            Report an issue with your hostel facility
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Matric Number</label>
                  <p className="text-sm text-gray-900 font-semibold">{user?.matricNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hostel</label>
                  <p className="text-sm text-gray-900 font-semibold">{user?.hostelName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Room Number</label>
                  <p className="text-sm text-gray-900 font-semibold">{user?.roomNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900 font-semibold">{user?.name}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="facilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Facility Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="issueDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Issue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        className="min-h-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo Upload (Optional) */}
              <FormField
                control={form.control}
                name="photo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Upload Photo (Optional)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          className="hidden"
                          id="photo-upload"
                          {...fieldProps}
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <span className="text-purple-600 hover:underline font-semibold">Choose a file</span>
                          <span className="text-gray-500"> or drag and drop</span>
                        </label>
                        {value && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {value.name}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a photo to help us better understand the issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Submit Complaint
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitComplaint;