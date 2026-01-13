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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const UpdateComplaintModal = ({
  open,
  onClose,
  complaint,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    status: '',
    maintenance_remarks: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form when complaint changes
  useEffect(() => {
    if (complaint) {
      setFormData({
        status: complaint.status || '',
        maintenance_remarks: complaint.maintenance_remarks || '',
      });
    }
  }, [complaint]);

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = status => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.status || !complaint) {
      toast.error('Please select a status');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      let endpoint = '';
      let body = {};

      if (formData.status === 'resolved') {
        // Call resolve endpoint
        endpoint = `${API_URL}/api/complaints/${complaint.id}/resolve`;
        body = {
          maintenance_remarks: formData.maintenance_remarks || null,
        };
      } else {
        // Call general update endpoint
        endpoint = `${API_URL}/api/complaints/${complaint.id}`;
        body = {
          status: formData.status,
          maintenance_remarks: formData.maintenance_remarks || null,
        };
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success(result.message || 'Complaint updated successfully!');
          onUpdate(result.complaint);
          onClose();
        } else {
          toast.error(result.error || 'Failed to update complaint');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to update complaint');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Update Complaint Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complaint Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm">Complaint Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Facility:</span>{' '}
                {complaint.facility_type || complaint.facilityType}
              </div>
              <div>
                <span className="font-medium">Hostel:</span>{' '}
                {complaint.hostel_name || complaint.hostelName}
              </div>
              <div>
                <span className="font-medium">Room:</span>{' '}
                {complaint.room_number || complaint.roomNumber}
              </div>
              <div>
                <span className="font-medium">Student:</span>{' '}
                {complaint.student_name || complaint.studentName}
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">Issue:</span>{' '}
              {complaint.issue_description || complaint.issueDescription}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Current Status:</span>
              <Badge className={getStatusColor(complaint.status)}>
                {getStatusDisplay(complaint.status)}
              </Badge>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-3">
            <Label htmlFor="status">Update Status *</Label>
            <Select
              value={formData.status}
              onValueChange={value => handleChange('status', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {formData.status === 'resolved' &&
                "Setting status to 'Resolved' will mark this complaint as completed and record today's date as resolution date."}
            </p>
          </div>

          {/* Maintenance Remarks */}
          <div className="space-y-3">
            <Label htmlFor="remarks">Maintenance Staff Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.maintenance_remarks}
              onChange={e =>
                handleChange('maintenance_remarks', e.target.value)
              }
              placeholder="Add your remarks about the repair, parts used, time spent, or any follow-up needed..."
              rows={4}
            />
            <p className="text-xs text-gray-500">
              These remarks will be visible to the admin and student.
            </p>
          </div>

          {/* Action Buttons */}
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
              type="submit"
              disabled={isLoading || !formData.status}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Updating...' : 'Update Complaint'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
