// Mock users data
export const mockUsers = [
  {
    id: 1,
    email: "test@student.usm.my",
    password: "password",
    name: "Test",
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
    studentName: "Test",
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
    studentName: "Test",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "101",
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
  },
  {
    id: 11,
    matricNumber: "163850",
    studentName: "Test",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "101",
    facilityType: "Plumbing",
    issueDescription: "Sink is leaking water continuously",
    status: "Resolved",
    submittedDate: "2024-10-15",
    photo: null,
    adminRemarks: "Plumber fixed the leak, replaced old pipes"
  },
  {
    id: 12,
    matricNumber: "163850",
    studentName: "Test",
    hostelName: "Desasiswa Bakti Permai",
    roomNumber: "101",
    facilityType: "Lighting",
    issueDescription: "Bathroom light not working",
    status: "Resolved",
    submittedDate: "2024-10-22",
    photo: null,
    adminRemarks: "Electrician replaced the bulb and fixed wiring"
  },
  // Add these new complaints to your existing mockComplaints array:

{
  id: 13,
  matricNumber: "164418",
  studentName: "Aisha Rahman",
  hostelName: "Desasiswa Aman Damai",
  roomNumber: "215",
  facilityType: "Air Conditioner",
  issueDescription: "AC not turning on, no power",
  status: "Pending",
  submittedDate: "2024-11-03",
  photo: null,
  adminRemarks: ""
},
{
  id: 14,
  matricNumber: "163721",
  studentName: "Wei Jie Lim",
  hostelName: "Desasiswa Fajar Harapan",
  roomNumber: "312",
  facilityType: "Bathroom",
  issueDescription: "Toilet flush not working properly",
  status: "In Progress",
  submittedDate: "2024-11-02",
  photo: null,
  adminRemarks: "Maintenance team assigned"
},
{
  id: 15,
  matricNumber: "164509",
  studentName: "Priya Sharma",
  hostelName: "Desasiswa Cahaya Gemilang",
  roomNumber: "118",
  facilityType: "Furniture",
  issueDescription: "Bed frame making creaking noise",
  status: "Pending",
  submittedDate: "2024-11-04",
  photo: null,
  adminRemarks: ""
},
{
  id: 16,
  matricNumber: "163834",
  studentName: "Ahmad Firdaus",
  hostelName: "Desasiswa Indah Kembara",
  roomNumber: "407",
  facilityType: "Electrical",
  issueDescription: "Multiple power sockets not working",
  status: "In Progress",
  submittedDate: "2024-11-01",
  photo: null,
  adminRemarks: "Electrician will check tomorrow"
},
{
  id: 17,
  matricNumber: "164267",
  studentName: "Sarah Johnson",
  hostelName: "Desasiswa Restu",
  roomNumber: "224",
  facilityType: "Plumbing",
  issueDescription: "Water pressure very low in shower",
  status: "Pending",
  submittedDate: "2024-11-03",
  photo: null,
  adminRemarks: ""
},
{
  id: 18,
  matricNumber: "163956",
  studentName: "Raj Patel",
  hostelName: "Desasiswa Saujana",
  roomNumber: "109",
  facilityType: "Door/Window",
  issueDescription: "Window cannot close properly",
  status: "Resolved",
  submittedDate: "2024-10-28",
  photo: null,
  adminRemarks: "Window hinge replaced"
},
{
  id: 19,
  matricNumber: "164388",
  studentName: "Nurul Ain",
  hostelName: "Desasiswa Tekun",
  roomNumber: "503",
  facilityType: "Lighting",
  issueDescription: "Corridor light flickering",
  status: "Pending",
  submittedDate: "2024-11-04",
  photo: null,
  adminRemarks: ""
},
{
  id: 20,
  matricNumber: "163672",
  studentName: "James Wong",
  hostelName: "Desasiswa Aman Damai",
  roomNumber: "318",
  facilityType: "Air Conditioner",
  issueDescription: "AC leaking water",
  status: "In Progress",
  submittedDate: "2024-11-02",
  photo: null,
  adminRemarks: "AC technician scheduled"
},
{
  id: 21,
  matricNumber: "164445",
  studentName: "Mei Ling",
  hostelName: "Desasiswa Fajar Harapan",
  roomNumber: "206",
  facilityType: "Bathroom",
  issueDescription: "Bathroom drain clogged",
  status: "Resolved",
  submittedDate: "2024-10-29",
  photo: null,
  adminRemarks: "Drain cleared and cleaned"
},
{
  id: 22,
  matricNumber: "163789",
  studentName: "Ali Hassan",
  hostelName: "Desasiswa Bakti Permai",
  roomNumber: "415",
  facilityType: "Furniture",
  issueDescription: "Wardrobe door broken",
  status: "Pending",
  submittedDate: "2024-11-05",
  photo: null,
  adminRemarks: ""
},
{
  id: 23,
  matricNumber: "164332",
  studentName: "Emma Davis",
  hostelName: "Desasiswa Cahaya Gemilang",
  roomNumber: "321",
  facilityType: "Electrical",
  issueDescription: "Study lamp not working",
  status: "Resolved",
  submittedDate: "2024-10-27",
  photo: null,
  adminRemarks: "Lamp replaced"
},
{
  id: 24,
  matricNumber: "163901",
  studentName: "Khalid Ibrahim",
  hostelName: "Desasiswa Indah Kembara",
  roomNumber: "112",
  facilityType: "Plumbing",
  issueDescription: "Hot water not consistent",
  status: "In Progress",
  submittedDate: "2024-11-03",
  photo: null,
  adminRemarks: "Checking water heater system"
},
{
  id: 25,
  matricNumber: "164476",
  studentName: "Sophia Tan",
  hostelName: "Desasiswa Restu",
  roomNumber: "508",
  facilityType: "Door/Window",
  issueDescription: "Room door lock malfunctioning",
  status: "Pending",
  submittedDate: "2024-11-04",
  photo: null,
  adminRemarks: ""
},
{
  id: 26,
  matricNumber: "163745",
  studentName: "Deepak Kumar",
  hostelName: "Desasiswa Saujana",
  roomNumber: "217",
  facilityType: "Lighting",
  issueDescription: "Room lights too dim",
  status: "Resolved",
  submittedDate: "2024-10-30",
  photo: null,
  adminRemarks: "Upgraded to brighter bulbs"
},
{
  id: 27,
  matricNumber: "164523",
  studentName: "Nadia Ali",
  hostelName: "Desasiswa Tekun",
  roomNumber: "404",
  facilityType: "Air Conditioner",
  issueDescription: "AC remote not working",
  status: "Pending",
  submittedDate: "2024-11-05",
  photo: null,
  adminRemarks: ""
},
{
  id: 28,
  matricNumber: "163812",
  studentName: "Brian Chen",
  hostelName: "Desasiswa Aman Damai",
  roomNumber: "129",
  facilityType: "Bathroom",
  issueDescription: "Shower drainage slow",
  status: "In Progress",
  submittedDate: "2024-11-04",
  photo: null,
  adminRemarks: "Plumbing maintenance scheduled"
},
{
  id: 29,
  matricNumber: "164567",
  studentName: "Amirah Yusof",
  hostelName: "Desasiswa Fajar Harapan",
  roomNumber: "335",
  facilityType: "Furniture",
  issueDescription: "Chair leg broken",
  status: "Resolved",
  submittedDate: "2024-10-26",
  photo: null,
  adminRemarks: "Chair replaced"
},
{
  id: 30,
  matricNumber: "163699",
  studentName: "Daniel Lee",
  hostelName: "Desasiswa Bakti Permai",
  roomNumber: "228",
  facilityType: "Electrical",
  issueDescription: "Extension cord not working",
  status: "Pending",
  submittedDate: "2024-11-05",
  photo: null,
  adminRemarks: ""
}
];

export const mockFeedbacks = [
  {
    id: 1,
    complaintId: 3,
    matricNumber: "163850",
    studentName: "Test",
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