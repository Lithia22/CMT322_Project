import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PublicLayout from '@/components/layout/PublicLayout';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address')
    .refine((email) => email.endsWith('@student.usm.my'), {
      message: 'Only @student.usm.my emails are allowed for registration',
    }),
  matricNumber: z.string()
    .min(5, 'Matric number must be at least 5 characters')
    .regex(/^\d+$/, 'Matric number must contain only numbers'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  hostelName: z.string().min(1, 'Please select your hostel'),
  roomNumber: z.string().min(1, 'Room number is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { 
      name: '', 
      email: '', 
      matricNumber: '', 
      password: '', 
      confirmPassword: '',
      hostelName: '',
      roomNumber: ''
    },
  });

  const onSubmit = (data) => {
    const result = register(data);
    if (result.success) {
      navigate('/login');
    } else {
      form.setError('root', { message: result.error });
    }
  };

  const hostelOptions = [
    "Desasiswa Aman Damai",
    "Desasiswa Fajar Harapan",
    "Desasiswa Bakti Permai",
    "Desasiswa Cahaya Gemilang",
    "Desasiswa Indah Kembara",
    "Desasiswa Restu",
    "Desasiswa Saujana",
    "Desasiswa Tekun"
  ];

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border border-gray-200 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center justify-center rounded-lg">
                <img 
                  src="/USM.svg" 
                  alt="USM Logo" 
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
              <CardDescription className="text-gray-600">Join DesaFix System</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {form.formState.errors.root && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
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
                  name="matricNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Matric Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your matric number" 
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
                      <FormLabel className="text-gray-700">USM Student Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@student.usm.my" 
                          {...field} 
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be your @student.usm.my email
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hostelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Hostel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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

                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Room Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your room number" 
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          {...field}
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5"
                >
                  Create Account
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default SignUp;