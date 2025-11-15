# USM Hostel Complaint Management System - DesaFix

## Features

### Public Features

- **Home Page** with system overview and features
- **FAQ Section** for common questions
- **Contact Section** for each hostel's contact information
- **Login/SignUp System** with role-based access

### Student Features

- **Dashboard** with total complaints statistics, recent complaints, and feedback given
- **My Complaints** to track complaint progress and submit new complaints
- **Feedback** to provide feedback on resolved complaints

### Admin Features

- **Dashboard** with overall complaint statistics, charts, recent complaints, and recent feedback
- **Staff Management** to create maintenance staff accounts, assign tasks, and monitor complaint status
- **Staff Performance** to view staff rating analytics and top-rated staff members

### Maintenance Staff Features

- **Dashboard** to manage complaints, update status, and add remarks
- **View Feedback** to see feedback and star ratings given by students

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
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
