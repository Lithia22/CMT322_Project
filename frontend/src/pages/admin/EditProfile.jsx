import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { User, Mail, Shield, Save } from 'lucide-react';

// Validation schema - simplified without passwords
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate API loading
  useState(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  };

  // Skeleton components with gray background
  const HeaderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-64 bg-muted" />
      <Skeleton className="h-4 w-96 bg-muted" />
    </div>
  );

  const ProfileCardSkeleton = () => (
    <Card className="lg:col-span-1">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full bg-muted" />
          <div className="text-center space-y-2 w-full">
            <Skeleton className="h-6 w-32 mx-auto bg-muted" />
            <Skeleton className="h-4 w-40 mx-auto bg-muted" />
            <Skeleton className="h-6 w-24 mx-auto bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FormSkeleton = () => (
    <Card className="lg:col-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-48 bg-muted" />
        <Skeleton className="h-4 w-64 bg-muted" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-10 w-full bg-muted" />
        </div>
        <div className="flex justify-end space-x-3">
          <Skeleton className="h-10 w-20 bg-muted" />
          <Skeleton className="h-10 w-32 bg-muted" />
        </div>
      </CardContent>
    </Card>
  );

  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileCardSkeleton />
          <FormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info - Big avatar with text below */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-gray-300">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="text-lg bg-gray-100 text-gray-600">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="pt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your name and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Saving
                      </>
                    ) : (
                      <>
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;