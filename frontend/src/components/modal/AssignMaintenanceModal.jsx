import { useState } from 'react';
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

export const AssignMaintenanceModal = ({
  open,
  onClose,
  complaint,
  maintenanceStaff,
  onAssign,
}) => {
  const [selectedStaff, setSelectedStaff] = useState('');

  const availableStaff = maintenanceStaff.filter(
    staff => staff.status === 'Active'
  );

  const handleAssign = () => {
    if (selectedStaff && complaint) {
      onAssign(selectedStaff);
      setSelectedStaff('');
    }
  };

  const getStaffWorkload = staffId => {
    return (
      maintenanceStaff.find(s => s.id === staffId)?.assignedComplaints
        ?.length || 0
    );
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Complaint Details:</h4>
            <p className="text-sm">
              <strong>Facility:</strong> {complaint.facilityType}
            </p>
            <p className="text-sm">
              <strong>Hostel:</strong> {complaint.hostelName}
            </p>
            <p className="text-sm">
              <strong>Issue:</strong> {complaint.issueDescription}
            </p>
            <p className="text-sm">
              <strong>Student:</strong> {complaint.studentName}
            </p>
          </div>

          {/* Staff Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Select Maintenance Staff
            </label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Choose maintenance staff" />
              </SelectTrigger>
              <SelectContent>
                {availableStaff.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{staff.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {staff.specialty}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getStaffWorkload(staff.id)} assigned
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStaff && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">Selected Staff:</h4>
              <p className="text-sm">
                {availableStaff.find(s => s.id === selectedStaff)?.name} -
                Specializes in{' '}
                {availableStaff.find(s => s.id === selectedStaff)?.specialty}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!selectedStaff}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Assign Staff
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
