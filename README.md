# DesaFix - USM Hostel Complaint Management System

A web-based complaint management system for Universiti Sains Malaysia hostel facilities, enabling students to report issues and track their resolution.

## Project Structure

```
CMT322_Project/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── config/
│   └── package.json
│
└── BACKEND/          # Express backend
    ├── src/
    │   ├── routes/
    │   ├── middleware/
    │   └── config/
    └── package.json
```

**Team Members:**

- Tejashree Laxmi A/P Kanthan (163506)
- Dershyani A/P B.Thessaruva (164062)
- Lithia A/P Kisnen (163850)
- Kavitashini A/P Seluvarajoo (164329)

## Features

### Public Features

- **Home Page** with system overview and features
- **FAQ Section** for common questions
- **Contact Section** for hostel contact information
- **Login/Registration System** with role-based access

### Student Features

- **Dashboard** with complaint statistics and recent activity
- **My Complaints** to submit and track complaint progress
- **Feedback System** to rate resolved complaints

### Admin Features

- **Dashboard** with system-wide statistics and analytics
- **Staff Management** to create and manage maintenance staff accounts
- **Staff Performance** to view ratings and performance metrics

### Maintenance Staff Features

- **Dashboard** to manage assigned complaints and update status
- **Feedback View** to see student ratings and comments

## Tech Stack

**Frontend:**

- React 18 with Vite
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod validation
- Recharts for data visualization

**Backend:**

- Node.js + Express.js
- JWT authentication
- bcrypt password hashing

**Database:**

- Supabase (PostgreSQL)

**Deployment:**

- Frontend: Vercel
- Backend: Render
- Database: Supabase Cloud

## Installation & Setup

### Prerequisites

- Node.js (v16+)
- npm
