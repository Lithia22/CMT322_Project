// Mock users data
export const mockUsers = [
  {
    id: 1,
    email: "student@usm.my",
    password: "password",
    name: "Ahmad Student",
    role: "student",
    studentId: "STU001"
  },
  {
    id: 2,
    email: "admin@usm.my", 
    password: "password",
    name: "Admin User",
    role: "admin"
  }
];

// Mock data for complaints
export const mockComplaints = [
  {
    id: 1,
    studentId: "STU001",
    studentName: "Ahmad Student",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "A-101",
    facilityType: "Air Conditioner",
    issueDescription: "AC not cooling properly, making loud noise",
    urgencyLevel: "High",
    status: "In Progress",
    submittedDate: "2024-10-28",
    photo: null,
    adminRemarks: "Technician assigned, will fix by tomorrow"
  },
  {
    id: 2,
    studentId: "STU002",
    studentName: "Siti Student",
    hostelName: "Desasiswa Indah Kembara",
    roomNumber: "B-205",
    facilityType: "Bathroom",
    issueDescription: "Water heater not working, no hot water",
    urgencyLevel: "Medium",
    status: "Pending",
    submittedDate: "2024-10-29",
    photo: null,
    adminRemarks: ""
  },
  {
    id: 3,
    studentId: "STU001",
    studentName: "Ahmad Student",
    hostelName: "Desasiswa Aman Damai",
    roomNumber: "C-310",
    facilityType: "Furniture",
    issueDescription: "Study table broken, drawer not opening",
    urgencyLevel: "Low",
    status: "Resolved",
    submittedDate: "2024-10-25",
    photo: null,
    adminRemarks: "Replaced with new table on 30th Oct"
  }
];

export const mockFeedbacks = [
  {
    id: 1,
    complaintId: 3,
    studentId: "STU001",
    studentName: "Ahmad Student",
    rating: 5,
    comment: "Very quick response! Table was replaced within 2 days. Thank you!",
    submittedDate: "2024-10-31"
  }
];

export const hostelOptions = [
  "Desasiswa Bakti Permai",
  "Desasiswa Indah Kembara", 
  "Desasiswa Aman Damai",
  "Desasiswa Restu",
  "Desasiswa Tekun"
];

export const facilityTypes = [
  "Air Conditioner",
  "Bathroom",
  "Furniture",
  "Electrical",
  "Plumbing",
  "Door/Window",
  "Lighting",
  "Others"
];

export const urgencyLevels = ["Low", "Medium", "High"];

// FAQ data
export const faqData = [
  {
    question: "How do I submit a complaint?",
    answer: "Login to your account, go to 'Submit Complaint', fill out the form with details about the issue, and submit. You'll receive a complaint ID for tracking."
  },
  {
    question: "How long does it take to resolve complaints?",
    answer: "Urgent issues (High priority) are addressed within 24 hours. Medium priority within 3 days, and Low priority within 7 days."
  },
  {
    question: "Can I track my complaint status?",
    answer: "Yes! After logging in, go to 'My Complaints' to see the current status and any admin remarks."
  },
  {
    question: "What facilities can I report issues for?",
    answer: "You can report issues for AC, bathroom, furniture, electrical, plumbing, doors/windows, lighting, and other hostel facilities."
  },
  {
    question: "How do I provide feedback?",
    answer: "Once your complaint is marked as 'Resolved', you can provide feedback and rating in the 'Feedback' section."
  }
];