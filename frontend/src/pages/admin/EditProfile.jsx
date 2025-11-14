import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Validation schema
const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
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
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async data => {
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

  const getInitials = name => {
    return (
      name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || 'A'
    );
  };

  // Skeleton components with gray background
  const HeaderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-8 w-64 bg-gray-200" />
      <Skeleton className="h-4 w-96 bg-gray-200" />
    </div>
  );

  const ProfileCardSkeleton = () => (
    <Card className="lg:col-span-1 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full bg-gray-200" />
          <div className="text-center space-y-2 w-full">
            <Skeleton className="h-6 w-32 mx-auto bg-gray-200" />
            <Skeleton className="h-4 w-40 mx-auto bg-gray-200" />
            <Skeleton className="h-6 w-24 mx-auto bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FormSkeleton = () => (
    <Card className="lg:col-span-2 border border-gray-200">
      <CardHeader>
        <Skeleton className="h-6 w-48 bg-gray-200" />
        <Skeleton className="h-4 w-64 bg-gray-200" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-gray-200" />
          <Skeleton className="h-10 w-full bg-gray-200" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-gray-200" />
          <Skeleton className="h-10 w-full bg-gray-200" />
        </div>
        <div className="flex justify-end space-x-3">
          <Skeleton className="h-10 w-20 bg-gray-200" />
          <Skeleton className="h-10 w-32 bg-gray-200" />
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Edit Profile
        </h1>
        <p className="text-gray-600">Update your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info - Big avatar with text below */}
        <Card className="lg:col-span-1 border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-gray-300 dark:border-purple-400">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="text-lg bg-gray-100 dark:bg-purple-900 text-gray-600 dark:text-purple-200">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {user?.name}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="pt-2">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Profile Information</CardTitle>
            <CardDescription className="text-gray-600">
              Update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
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
                      <FormLabel className="text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
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
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Saving
                      </>
                    ) : (
                      <>Save Changes</>
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
