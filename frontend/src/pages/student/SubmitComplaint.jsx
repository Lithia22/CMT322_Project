import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { hostelOptions, facilityTypes, urgencyLevels } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentId: user?.studentId || '',
    hostelName: '',
    roomNumber: '',
    facilityType: '',
    issueDescription: '',
    urgencyLevel: 'Medium',
    photo: null
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file.name
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hostelName) {
      newErrors.hostelName = 'Please select a hostel';
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    if (!formData.facilityType) {
      newErrors.facilityType = 'Please select facility type';
    }
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = 'Please describe the issue';
    } else if (formData.issueDescription.trim().length < 10) {
      newErrors.issueDescription = 'Description should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In real app, this would send to backend
      console.log('Complaint submitted:', {
        ...formData,
        studentName: user?.name,
        status: 'Pending',
        submittedDate: new Date().toLocaleDateString()
      });
      setSubmitted(true);
      
      // Redirect to my complaints after 3 seconds
      setTimeout(() => {
        navigate('/my-complaints');
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Complaint Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your complaint has been registered. You can track its status in the "My Complaints" section.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Complaint ID:</strong> #{Math.floor(Math.random() * 10000)}
            </p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>Status:</strong> Pending Review
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Submit a Complaint</h1>
          <p className="text-gray-600">
            Report any hostel facility issues and we'll resolve them quickly
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Info (Auto-filled) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={user?.studentId || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Hostel Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hostel Name <span className="text-red-500">*</span>
              </label>
              <select
                name="hostelName"
                value={formData.hostelName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.hostelName ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your hostel</option>
                {hostelOptions.map((hostel, index) => (
                  <option key={index} value={hostel}>{hostel}</option>
                ))}
              </select>
              {errors.hostelName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.hostelName}
                </p>
              )}
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., A-101"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.roomNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.roomNumber}
                </p>
              )}
            </div>

            {/* Facility Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facility Type <span className="text-red-500">*</span>
              </label>
              <select
                name="facilityType"
                value={formData.facilityType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.facilityType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select facility type</option>
                {facilityTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              {errors.facilityType && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.facilityType}
                </p>
              )}
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the issue in detail..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.issueDescription ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.issueDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.issueDescription}
                </p>
              )}
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                {urgencyLevels.map((level) => (
                  <label key={level} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value={level}
                      checked={formData.urgencyLevel === level}
                      onChange={handleChange}
                      className="mr-2 w-4 h-4 text-blue-600"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      level === 'High' ? 'bg-red-100 text-red-800' :
                      level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-800 font-semibold">
                    Choose a file
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                {formData.photo && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.photo}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your complaint will be reviewed by our maintenance team within 24 hours. 
            You can track the status in the "My Complaints" section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;