import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export const UpdateComplaintModal = ({ open, onClose, complaint, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: '',
    remarks: '',
  });

  useEffect(() => {
    if (complaint) {
      setFormData({
        status: complaint.status,
        remarks: complaint.technicianRemarks || '',
      });
    }
  }, [complaint]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.status && complaint) {
      const updatedComplaint = {
        ...complaint,
        status: formData.status,
        technicianRemarks: formData.remarks,
        resolutionDate: formData.status === 'Resolved' ? new Date().toISOString().split('T')[0] : complaint.resolutionDate
      };
      onUpdate(updatedComplaint);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
                <span className="font-medium">Facility:</span> {complaint.facilityType}
              </div>
              <div>
                <span className="font-medium">Hostel:</span> {complaint.hostelName}
              </div>
              <div>
                <span className="font-medium">Room:</span> {complaint.roomNumber}
              </div>
              <div>
                <span className="font-medium">Student:</span> {complaint.studentName}
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">Issue:</span> {complaint.issueDescription}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Current Status:</span>
              <Badge className={
                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }>
                {complaint.status}
              </Badge>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-3">
            <Label htmlFor="status">Update Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {formData.status === 'Resolved' && "Setting status to 'Resolved' will automatically set today's date as resolution date."}
            </p>
          </div>

          {/* Technician Remarks */}
          <div className="space-y-3">
            <Label htmlFor="remarks">Technician Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Add your remarks about the repair, parts used, or any follow-up needed..."
              rows={4}
            />
            <p className="text-xs text-gray-500">
              These remarks will be visible to the admin and student.
            </p>
          </div>

          {/* Action Buttons */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.status}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Complaint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};