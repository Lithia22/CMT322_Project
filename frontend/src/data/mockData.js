// Mock users data
export const mockUsers = [
  {
    id: 1,
    email: "john@student.usm.my",
    password: "password",
    name: "John",
    role: "student",
    matricNumber: "163850",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "101"
  },
  {
    id: 2,
    email: "admin@usm.my", 
    password: "password",
    name: "Admin User",
    username: "admin",
    role: "admin"
  }
];

// Mock data for complaints
export const mockComplaints = [
  {
    id: 1,
    matricNumber: "163850",
    studentName: "John",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "101",
    facilityType: "Air Conditioner",
    issueDescription: "AC not cooling properly, making loud noise",
    status: "In Progress",
    submittedDate: "2024-10-28",
    photo: null,
    adminRemarks: "Technician assigned, will fix by tomorrow"
  },
  {
    id: 2,
    matricNumber: "163429",
    studentName: "Siti Nurhaliza",
    hostelName: "Desasiswa Indah Kembara",
    roomNumber: "205",
    facilityType: "Bathroom",
    issueDescription: "Water heater not working, no hot water",
    status: "Pending",
    submittedDate: "2024-10-29",
    photo: null,
    adminRemarks: ""
  },
  {
    id: 3,
    matricNumber: "163850",
    studentName: "Ahmad bin Ismail",
    hostelName: "Desasiswa Aman Damai",
    roomNumber: "310",
    facilityType: "Furniture",
    issueDescription: "Study table broken, drawer not opening",
    status: "Resolved",
    submittedDate: "2024-10-25",
    photo: null,
    adminRemarks: "Replaced with new table on 30th Oct"
  },
  {
    id: 4,
    matricNumber: "164201",
    studentName: "Lee Chen Wei",
    hostelName: "Desasiswa Restu",
    roomNumber: "402",
    facilityType: "Electrical",
    issueDescription: "Power socket not working in bedroom",
    status: "Resolved",
    submittedDate: "2024-10-20",
    photo: null,
    adminRemarks: "Fixed by electrician"
  },
  {
    id: 5,
    matricNumber: "163912",
    studentName: "Kumar Rajesh",
    hostelName: "Desasiswa Tekun",
    roomNumber: "105",
    facilityType: "Plumbing",
    issueDescription: "Toilet clogged, water overflowing",
    status: "In Progress",
    submittedDate: "2024-10-30",
    photo: null,
    adminRemarks: "Plumber on the way"
  },
  {
    id: 6,
    matricNumber: "164305",
    studentName: "Fatimah binti Abdullah",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "203",
    facilityType: "Door/Window",
    issueDescription: "Door lock jammed, cannot lock properly",
    status: "Pending",
    submittedDate: "2024-10-31",
    photo: null,
    adminRemarks: ""
  },
  {
    id: 7,
    matricNumber: "163788",
    studentName: "David Tan",
    hostelName: "Desasiswa Indah Kembara",
    roomNumber: "108",
    facilityType: "Lighting",
    issueDescription: "Ceiling light flickering and dim",
    status: "Resolved",
    submittedDate: "2024-10-18",
    photo: null,
    adminRemarks: "Replaced bulb"
  },
  {
    id: 8,
    matricNumber: "164112",
    studentName: "Nurul Huda",
    hostelName: "Desasiswa Aman Damai",
    roomNumber: "501",
    facilityType: "Air Conditioner",
    issueDescription: "AC remote control missing",
    status: "Pending",
    submittedDate: "2024-11-01",
    photo: null,
    adminRemarks: ""
  },
  {
    id: 9,
    matricNumber: "163645",
    studentName: "Megan Lim",
    hostelName: "Desasiswa Fajar Harapan",
    roomNumber: "306",
    facilityType: "Bathroom",
    issueDescription: "Shower head leaking",
    status: "Pending",
    submittedDate: "2024-11-02",
    photo: null,
    adminRemarks: ""
  },
  {
    id: 10,
    matricNumber: "164223",
    studentName: "Ramesh Kumar",
    hostelName: "Desasiswa Cahaya Gemilang",
    roomNumber: "409",
    facilityType: "Electrical",
    issueDescription: "Ceiling fan not working",
    status: "In Progress",
    submittedDate: "2024-11-01",
    photo: null,
    adminRemarks: "Electrician scheduled for tomorrow"
  }
];

export const mockFeedbacks = [
  {
    id: 1,
    complaintId: 3,
    matricNumber: "163850",
    studentName: "Ahmad bin Ismail",
    rating: 5,
    comment: "Very quick response! Table was replaced within 2 days. Thank you!",
    submittedDate: "2024-10-31"
  },
  {
    id: 2,
    complaintId: 4,
    matricNumber: "164201",
    studentName: "Lee Chen Wei",
    rating: 4,
    comment: "Good service, electrician was professional",
    submittedDate: "2024-10-22"
  },
  {
    id: 3,
    complaintId: 7,
    matricNumber: "163788",
    studentName: "David Tan",
    rating: 3,
    comment: "Took a while but eventually fixed",
    submittedDate: "2024-10-19"
  }
];

export const hostelOptions = [
  "Desasiswa Aman Damai",
  "Desasiswa Fajar Harapan",
  "Desasiswa Bakti Permai",
  "Desasiswa Cahaya Gemilang",
  "Desasiswa Indah Kembara",
  "Desasiswa Restu",
  "Desasiswa Saujana",
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

// FAQ data
export const faqData = [
  {
    question: "How do I submit a complaint?",
    answer: "Login to your account, go to 'My Complaints', click on the 'New Complaint' button and fill out the form with details about the issue, and submit. You'll receive a complaint ID for tracking."
  },
  {
    question: "How long does it take to resolve complaints?",
    answer: "Complaints are processed using FIFO (First-In-First-Out) method. The first person to submit gets priority regardless of issue type."
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