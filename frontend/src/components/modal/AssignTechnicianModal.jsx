import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export const AssignTechnicianModal = ({ open, onClose, complaint, technicians, onAssign }) => {
  const [selectedTechnician, setSelectedTechnician] = useState('');

  const availableTechnicians = technicians.filter(tech => tech.status === 'Active');

  const handleAssign = () => {
    if (selectedTechnician && complaint) {
      onAssign(selectedTechnician);
      setSelectedTechnician('');
    }
  };

  const getTechnicianWorkload = (technicianId) => {
    return technicians.find(t => t.id === technicianId)?.assignedComplaints?.length || 0;
  };

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Complaint Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Complaint Details:</h4>
            <p className="text-sm"><strong>Facility:</strong> {complaint.facilityType}</p>
            <p className="text-sm"><strong>Hostel:</strong> {complaint.hostelName}</p>
            <p className="text-sm"><strong>Issue:</strong> {complaint.issueDescription}</p>
            <p className="text-sm"><strong>Student:</strong> {complaint.studentName}</p>
          </div>

          {/* Technician Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Technician</label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a technician" />
              </SelectTrigger>
              <SelectContent>
                {availableTechnicians.map(technician => (
                  <SelectItem key={technician.id} value={technician.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{technician.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {technician.specialty}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getTechnicianWorkload(technician.id)} assigned
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTechnician && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">Selected Technician:</h4>
              <p className="text-sm">
                {availableTechnicians.find(t => t.id === selectedTechnician)?.name} - 
                Specializes in {availableTechnicians.find(t => t.id === selectedTechnician)?.specialty}
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
            disabled={!selectedTechnician}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Assign Technician
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};