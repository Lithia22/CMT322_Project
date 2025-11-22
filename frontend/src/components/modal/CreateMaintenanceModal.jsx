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
import { facilityTypes } from '@/data/mockData';

// Check if Select components exist, if not we'll use a native select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Validation schema
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
  const form = useForm({
    resolver: zodResolver(maintenanceStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      facilityTypes: [],
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

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

  const onSubmit = data => {
    try {
      // Remove confirmPassword before saving
      const { confirmPassword, ...staffData } = data;

      onSave({
        ...staffData,
        id: Date.now().toString(),
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        username: data.email.split('@')[0] + '_maintenance',
      });

      form.reset();
    } catch (error) {
      toast.error('Failed to create staff account. Please try again.');
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Check if Select components are available
  const hasSelectComponents =
    Select && SelectContent && SelectItem && SelectTrigger && SelectValue;

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
                    Full Name
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
                    Email Address
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
                    Phone Number
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

            {/* Facility Types - Select Dropdown */}
            <FormField
              control={form.control}
              name="facilityTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-white">
                    Facility Types
                  </FormLabel>
                  <div className="space-y-3">
                    {hasSelectComponents ? (
                      // Use Shadcn Select components if available
                      <Select onValueChange={addFacilityType}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                            <SelectValue placeholder="Select facility types" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {facilityTypes.map(type => (
                            <SelectItem
                              key={type}
                              value={type}
                              disabled={selectedFacilityTypes.includes(type)}
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      // Fallback to native select
                      <FormControl>
                        <select
                          onChange={e => {
                            if (e.target.value) {
                              addFacilityType(e.target.value);
                              e.target.value = ''; // Reset selection
                            }
                          }}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        >
                          <option value="">Select facility types</option>
                          {facilityTypes.map(type => (
                            <option
                              key={type}
                              value={type}
                              disabled={selectedFacilityTypes.includes(type)}
                            >
                              {type}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    )}

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
                    Temporary Password
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
                    Confirm Password
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
                  !form.formState.isValid || form.formState.isSubmitting
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
