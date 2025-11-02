import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label'; 
import { CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { hostelOptions, facilityTypes } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const complaintSchema = z.object({
  hostelName: z.string().min(1, 'Please select a hostel'),
  roomNumber: z.string().min(1, 'Room number is required'),
  facilityType: z.string().min(1, 'Please select facility type'),
  issueDescription: z.string().min(10, 'Description must be at least 10 characters'),
  urgencyLevel: z.enum(['Low', 'Medium', 'High']),
  photo: z.any().optional(),
});

const SubmitComplaint = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      urgencyLevel: 'Medium',
    },
  });

  const onSubmit = (data) => {
    console.log('Complaint submitted:', {
      ...data,
      studentId: user.studentId,
      studentName: user.name,
      status: 'Pending',
      submittedDate: new Date().toLocaleDateString(),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Complaint Submitted Successfully!</h1>
          <p className="text-muted-foreground mt-2">
            Your complaint has been registered and will be reviewed by our maintenance team.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
            <CardDescription>Here's a summary of your submitted complaint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Complaint ID</p>
                <p className="font-semibold">#{Math.floor(Math.random() * 10000)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="outline">Pending Review</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                <p className="font-semibold">{user?.studentId}</p>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can track your complaint status in the "My Complaints" section.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <a href="/my-complaints">View My Complaints</a>
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit a Complaint</h1>
        <p className="text-muted-foreground">
          Report any hostel facility issues and we'll resolve them quickly
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>Fill in the form below to submit your facility complaint</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Info (Read-only) - Use regular Label here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input id="student-name" value={user?.name} disabled className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input id="student-id" value={user?.studentId} disabled className="bg-background" />
                </div>
              </div>

              {/* Hostel Selection */}
              <FormField
                control={form.control}
                name="hostelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostel Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your hostel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hostelOptions.map((hostel) => (
                          <SelectItem key={hostel} value={hostel}>
                            {hostel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Room Number */}
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A-101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Facility Type */}
              <FormField
                control={form.control}
                name="facilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              {/* Issue Description */}
              <FormField
                control={form.control}
                name="issueDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide as much detail as possible to help us resolve the issue quickly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Urgency Level */}
              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Urgency Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Low" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Low
                            </Badge>
                            <span className="ml-2">Minor issues that don't affect daily activities</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Medium
                            </Badge>
                            <span className="ml-2">Issues that cause inconvenience</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="High" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              High
                            </Badge>
                            <span className="ml-2">Urgent issues affecting safety or basic needs</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
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
                    <FormLabel>Upload Photo (Optional)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          className="hidden"
                          id="photo-upload"
                          {...fieldProps}
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <span className="text-primary hover:underline font-semibold">Choose a file</span>
                          <span className="text-muted-foreground"> or drag and drop</span>
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

              <Button type="submit" size="lg" className="w-full">
                Submit Complaint
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your complaint will be reviewed by our maintenance team within 24 hours. 
          You can track the status in the "My Complaints" section.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SubmitComplaint;