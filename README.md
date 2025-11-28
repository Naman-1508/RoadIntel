# RoadIntel - Traffic Accident Management System

A comprehensive full-stack web application for real-time traffic accident reporting, monitoring, and analysis. Built with React, Node.js, Express, MongoDB, and integrated with AI-powered features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)

## 🚀 Features

### Core Functionality
- **Real-time Accident Reporting** - Submit and track traffic incidents with geolocation
- **Interactive Maps** - Leaflet-based maps with markers and heatmap visualization
- **Live Updates** - Real-time incident tracking and status updates
- **User Authentication** - Secure authentication powered by Clerk
- **Role-based Access Control** - Separate dashboards for users and administrators
- **Multi-language Support** - Translation powered by Sarvam AI

### Advanced Features
- **AI-Powered Video Analysis** - YOLO object detection for traffic video analysis
- **Social Media Insights** - Twitter/X integration for real-time traffic updates
- **Severity Analysis** - AI-powered severity classification using Google Gemini
- **Dynamic Heatmaps** - Visualize accident-prone areas with real-time data
- **Report Management** - Comprehensive reporting system for accidents, traffic, construction, and road hazards

### Analytics & Visualization
- **Interactive Dashboards** - User and admin dashboards with real-time statistics
- **Traffic Metrics** - Comprehensive analytics with charts and graphs (Recharts)
- **Active Alerts System** - Real-time alert notifications with severity indicators
- **Incident Heatmaps** - Geographic visualization of incident density

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS with custom animations
- **Maps**: Leaflet + React Leaflet with heatmap support
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **Authentication**: Clerk React
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js with Express 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk Express SDK
- **AI/ML**: 
  - Google Generative AI (Gemini) for severity analysis
  - YOLO for video object detection
- **External APIs**:
  - Twitter/X API for social insights
  - Sarvam AI for translation
- **File Upload**: Multer
- **Validation**: Express Validator
- **Scheduled Tasks**: node-cron

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Python 3.x (for YOLO video analysis)
- npm or yarn

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Naman-1508/RoadIntel.git
cd Traffic_Accident
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_SEED_EMAIL=admin@example.com
GEMINI_API_KEY=your_gemini_api_key
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
SARVAM_API_KEY=your_sarvam_api_key
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Python Dependencies (for YOLO)
```bash
pip install ultralytics opencv-python numpy
```

## 🚀 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:3000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Application runs on `http://localhost:8080`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
Traffic_Accident/
├── backend/
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation middleware
│   ├── services/          # Business logic (AI, social insights)
│   ├── scripts/           # Utility scripts (YOLO, seeding)
│   └── index.js           # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route configuration
│   │   ├── utility/       # API client & utilities
│   │   └── main.tsx       # React entry point
│   └── public/            # Static assets
└── README.md
```

## 🔑 Key Components

### Frontend Components
- **LeafletMap** - Interactive map with markers and heatmap support
- **ActiveAlerts** - Real-time alert table with dynamic data
- **IncidentHeatmap** - Heatmap visualization of incidents
- **MapSection** - Main map display with overlays
- **Header** - Responsive navigation with authentication
- **UserDashboard** - User-specific dashboard
- **AdminDashboard** - Admin control panel

### Backend Routes
- `/api/auth` - Authentication endpoints
- `/api/accidents` - Accident reporting
- `/api/reports` - Multi-type report management
- `/api/admin` - Admin operations
- `/api/video` - Video analysis with YOLO
- `/api/social-insights` - Twitter/X integration
- `/api/translate` - Multi-language translation

## 🎨 Features in Detail

### Interactive Maps
- Real-time incident markers with popups
- Heatmap visualization based on incident density
- Severity-based color coding
- Dynamic data updates from backend API
- Geolocation support

### Report Types
1. **Accident Reports** - Vehicle accidents with severity levels
2. **Traffic Reports** - Congestion and traffic flow issues
3. **Construction Reports** - Road work and maintenance
4. **Road Hazard Reports** - Potholes, debris, and other hazards

### AI Integration
- **Gemini AI** - Analyzes social media posts for severity classification
- **YOLO Detection** - Processes traffic videos for object detection
- **Sarvam AI** - Provides multi-language translation support

## 🔒 Security Features
- Clerk-based authentication
- Role-based access control (User/Admin)
- Protected routes
- JWT token validation
- Input validation and sanitization

## 📊 Admin Features
- User management
- Report moderation
- Dashboard statistics
- System analytics
- Report status management

## 🌐 API Endpoints

### Reports
- `GET /api/reports` - Fetch all reports
- `POST /api/reports/accident` - Create accident report
- `POST /api/reports/traffic` - Create traffic report
- `POST /api/reports/construction` - Create construction report
- `POST /api/reports/hazard` - Create hazard report

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Dashboard statistics
- `PUT /api/admin/reports/:type/:id` - Update report status

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.

## 👨‍💻 Author
**Naman**
- GitHub: [@Naman-1508](https://github.com/Naman-1508)

## 🙏 Acknowledgments
- Clerk for authentication
- Leaflet for mapping
- Google Gemini for AI capabilities
- Radix UI & shadcn/ui for components
- Ultralytics YOLO for object detection

---

**Note**: Make sure to configure all environment variables before running the application. For production deployment, ensure proper security measures and use production-grade MongoDB instances.
