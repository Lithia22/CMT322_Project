# USM Hostel Complaint Management System - DesaFix

## Features

### Public Features

- **Home Page** with system overview and features
- **FAQ Section** for common questions
- **Contact Section** for each hostel's contact information
- **Login/SignUp System** with role-based access

### Student Features

- **Personal Dashboard** with complaint statistics
- **Submit Complaints** with facility details and photo upload
- **Track Complaint Status** with maintenance staff updates and remarks
- **Provide Feedback** on resolved complaints with star ratings

### Maintenance Staff Features

- **Maintenance Dashboard** with assigned tasks overview
- **Task Management** - update complaint status from Pending → In Progress → Resolved
- **Add Maintenance Remarks** for each complaint
- **View Feedback** - see ratings and comments from students
- **Workload Tracking** - monitor assigned vs completed tasks

### Admin Features

- **Admin Dashboard** with charts
- **Staff Management** - create and manage maintenance staff accounts
- **Complaint Assignment** - assign unassigned tasks to appropriate maintenance staff

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **State Management**: React Context API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

## Installation & Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lithia22/CMT322.git
   cd CMT322

   ```

2. **Navigate to frontend directory**

   ```bash
   cd frontend

   ```

3. **Install dependencies**

   ```bash
   npm install

   ```

4. **Start development server**

   ```bash
   npm run dev

   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Demo Credentials

### Student Login

- **Email**: `test@student.usm.my`
- **Password**: `password`

### Admin Login

- **Email**: `admin@usm.my`
- **Password**: `password`

### Maintenance Staff Login

- **Email**: `ahmad@usm.my`
- **Password**: `password123`
