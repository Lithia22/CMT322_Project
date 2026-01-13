import { API_URL } from '@/config/api';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export const AssignMaintenanceModal = ({
  open,
  onClose,
  complaint,
  onAssign,
}) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [recommendedStaff, setRecommendedStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && complaint?.id) {
      fetchRecommendedStaff();
    }
  }, [open, complaint?.id]);

  const fetchRecommendedStaff = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/api/complaints/${complaint.id}/recommended-staff`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecommendedStaff(result.recommended_staff || []);
        } else {
          toast.error(result.error || 'Failed to load recommended staff');
        }
      }
    } catch (error) {
      console.error('Error fetching recommended staff:', error);
      toast.error('Failed to load recommended staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (selectedStaff && complaint) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(
          `${API_URL}/api/complaints/${complaint.id}/assign`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              assigned_maintenance_id: selectedStaff,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            toast.success(result.message || 'Task assigned successfully!');
            onAssign(result.complaint);
            onClose();
            setSelectedStaff('');
          } else {
            toast.error(result.error || 'Failed to assign task');
          }
        }
      } catch (error) {
        console.error('Error assigning task:', error);
        toast.error('Failed to assign task');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Maintenance Staff</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Complaint Details */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Complaint Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Facility:</span>{' '}
                {complaint.facility_type || complaint.facilityType}
              </div>
              <div>
                <span className="font-medium">Date:</span>{' '}
                {complaint.submitted_date || complaint.submittedDate}
              </div>
              <div>
                <span className="font-medium">Hostel:</span>{' '}
                {complaint.hostel_name || complaint.hostelName}
              </div>
              <div>
                <span className="font-medium">Room:</span>{' '}
                {complaint.room_number || complaint.roomNumber}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Issue:</span>{' '}
                {complaint.issue_description || complaint.issueDescription}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Student:</span>{' '}
                {complaint.student_name || complaint.studentName}
              </div>
            </div>
          </div>

          {/* Staff Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Select Maintenance Staff
            </label>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <Select
                  value={selectedStaff}
                  onValueChange={setSelectedStaff}
                  disabled={recommendedStaff.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        recommendedStaff.length === 0
                          ? 'No qualified staff available'
                          : 'Choose maintenance staff'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {recommendedStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{staff.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {staff.assigned_count} tasks
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Staff Details List */}
                {recommendedStaff.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <p className="text-xs text-gray-500">
                      Recommended staff (sorted by workload):
                    </p>
                    {recommendedStaff.map(staff => (
                      <div
                        key={staff.id}
                        className={`p-3 border rounded-lg transition-colors ${
                          selectedStaff === staff.id
                            ? 'bg-purple-50 border-purple-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedStaff(staff.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-xs text-gray-600">
                                {staff.specialty || 'General'}
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-600">
                                {staff.phone || 'No phone'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {staff.facility_types
                                ?.slice(0, 3)
                                .map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                staff.assigned_count === 0
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {staff.assigned_count} current tasks
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {recommendedStaff.length === 0 && !isLoading && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                ⚠️ No maintenance staff qualified for this facility type. Please
                add staff with{' '}
                {complaint.facility_type || complaint.facilityType} specialty.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={
              !selectedStaff || isLoading || recommendedStaff.length === 0
            }
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Assigning...' : 'Assign Staff'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
