import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Updated validation schema for Supabase
const maintenanceStaffSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .refine(email => email.endsWith('@usm.my'), {
        message: 'Only @usm.my emails are allowed for staff accounts',
      }),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters')
      .regex(/^\+?[\d\s-]+$/, 'Please enter a valid phone number'),
    specialty: z.string().optional(),
    facilityTypes: z
      .array(z.string())
      .min(1, 'Please select at least one facility type'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const CreateMaintenanceModal = ({ open, onClose, onSave }) => {
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  const form = useForm({
    resolver: zodResolver(maintenanceStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      facilityTypes: [],
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Fetch facility types from Supabase
  // In CreateMaintenanceModal.jsx - update the useEffect that fetches facility types
  useEffect(() => {
    const fetchFacilityTypes = async () => {
      if (!open) return;

      try {
        setLoadingFacilities(true);
        const token = localStorage.getItem('token');
        const response = await fetch(' ${API_URL}/api/auth/facility-types', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setFacilityOptions(result.facility_types || []);
            console.log('✅ Facility types loaded:', result.facility_types);
          } else {
            console.error('Failed to load facility types:', result.error);
            toast.error('Failed to load facility types');
            // Fallback to mock data
            setFacilityOptions([
              {
                id: 1,
                name: 'Air Conditioner',
                created_at: new Date().toISOString(),
              },
              { id: 2, name: 'Bathroom', created_at: new Date().toISOString() },
              {
                id: 3,
                name: 'Furniture',
                created_at: new Date().toISOString(),
              },
              {
                id: 4,
                name: 'Electrical',
                created_at: new Date().toISOString(),
              },
              { id: 5, name: 'Plumbing', created_at: new Date().toISOString() },
              {
                id: 6,
                name: 'Door/Window',
                created_at: new Date().toISOString(),
              },
              { id: 7, name: 'Lighting', created_at: new Date().toISOString() },
              { id: 8, name: 'Others', created_at: new Date().toISOString() },
            ]);
          }
        } else {
          console.error('HTTP error:', response.status);
          toast.error('Failed to load facility types');
          // Fallback to mock data
          setFacilityOptions([
            {
              id: 1,
              name: 'Air Conditioner',
              created_at: new Date().toISOString(),
            },
            { id: 2, name: 'Bathroom', created_at: new Date().toISOString() },
            { id: 3, name: 'Furniture', created_at: new Date().toISOString() },
            { id: 4, name: 'Electrical', created_at: new Date().toISOString() },
            { id: 5, name: 'Plumbing', created_at: new Date().toISOString() },
            {
              id: 6,
              name: 'Door/Window',
              created_at: new Date().toISOString(),
            },
            { id: 7, name: 'Lighting', created_at: new Date().toISOString() },
            { id: 8, name: 'Others', created_at: new Date().toISOString() },
          ]);
        }
      } catch (error) {
        console.error('Error fetching facility types:', error);
        toast.error('Failed to load facility types');
        // Fallback to mock data
        setFacilityOptions([
          {
            id: 1,
            name: 'Air Conditioner',
            created_at: new Date().toISOString(),
          },
          { id: 2, name: 'Bathroom', created_at: new Date().toISOString() },
          { id: 3, name: 'Furniture', created_at: new Date().toISOString() },
          { id: 4, name: 'Electrical', created_at: new Date().toISOString() },
          { id: 5, name: 'Plumbing', created_at: new Date().toISOString() },
          { id: 6, name: 'Door/Window', created_at: new Date().toISOString() },
          { id: 7, name: 'Lighting', created_at: new Date().toISOString() },
          { id: 8, name: 'Others', created_at: new Date().toISOString() },
        ]);
      } finally {
        setLoadingFacilities(false);
      }
    };

    fetchFacilityTypes();
  }, [open]);

  const selectedFacilityTypes = form.watch('facilityTypes') || [];

  const addFacilityType = type => {
    if (type && !selectedFacilityTypes.includes(type)) {
      const newTypes = [...selectedFacilityTypes, type];
      form.setValue('facilityTypes', newTypes, { shouldValidate: true });
    }
  };

  const removeFacilityType = typeToRemove => {
    const newTypes = selectedFacilityTypes.filter(
      type => type !== typeToRemove
    );
    form.setValue('facilityTypes', newTypes, { shouldValidate: true });
  };

  // In CreateMaintenanceModal.jsx - onSubmit function
  const onSubmit = async data => {
    try {
      // Prepare the staff data for backend
      const staffData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        specialty: data.specialty || '',
        facilityTypes: data.facilityTypes, // Send names, backend will convert to IDs
      };

      await onSave(staffData);

      // Reset form on success
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to create staff. Please try again.');
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Staff Account</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter staff's full name"
                      {...field}
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="staff.name@usm.my"
                      {...field}
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be your @usm.my email
                  </p>
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Phone Number *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+6012-345 6789"
                      {...field}
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specialty (Optional) */}
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Specialty (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Electrical, Plumbing, HVAC"
                      {...field}
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Facility Types - Select Dropdown */}
            <FormField
              control={form.control}
              name="facilityTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Facility Types *
                  </FormLabel>
                  <div className="space-y-3">
                    {loadingFacilities ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        <span className="text-sm text-gray-500">
                          Loading facility types...
                        </span>
                      </div>
                    ) : facilityOptions.length === 0 ? (
                      <p className="text-sm text-amber-600 py-2">
                        No facility types available. Please add facility types
                        to the database first.
                      </p>
                    ) : (
                      <>
                        <Select onValueChange={addFacilityType}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                              <SelectValue placeholder="Select facility types" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facilityOptions.map(facility => (
                              <SelectItem
                                key={facility.id}
                                value={facility.name}
                                disabled={selectedFacilityTypes.includes(
                                  facility.name
                                )}
                              >
                                {facility.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Selected Types Display */}
                        {selectedFacilityTypes.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Selected Types:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedFacilityTypes.map(type => (
                                <Badge
                                  key={type}
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-3 py-1 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700"
                                  onClick={() => removeFacilityType(type)}
                                >
                                  {type}
                                  <span className="ml-1 text-xs">×</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select facility types this staff can handle. Click on badges
                    to remove.
                  </p>
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Temporary Password *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter temporary password"
                      {...field}
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and
                    number
                  </p>
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Confirm Password *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm temporary password"
                      {...field}
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  loadingFacilities ||
                  facilityOptions.length === 0
                }
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenanceModal;
