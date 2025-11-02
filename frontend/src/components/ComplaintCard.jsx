import { Calendar, MapPin } from 'lucide-react';

const ComplaintCard = ({ complaint }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{complaint.facilityType}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
            <span className="flex items-center">
              <MapPin size={14} className="mr-1" />
              {complaint.hostelName}
            </span>
            <span>Room {complaint.roomNumber}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-3">{complaint.issueDescription}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center">
          <Calendar size={12} className="mr-1" />
          {complaint.submittedDate}
        </span>
        <span className="text-gray-400">ID: #{complaint.id}</span>
      </div>
    </div>
  );
};

export default ComplaintCard;