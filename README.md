# College Admission Portal

A full-stack college admission portal with application tracking, built with React, FastAPI, and MongoDB.

## Features

- **Student Features:**
  - User registration and login
  - Submit admission applications
  - Upload required documents (transcripts, certificates, etc.)
  - Track application status in real-time
  - View application timeline

- **Admin Features:**
  - View all applications
  - Update application statuses
  - Manage student documents
  - Dashboard with application overview

## Tech Stack

**Frontend:**
- React 19
- React Router v7
- Tailwind CSS
- Framer Motion (animations)
- Axios
- Shadcn/UI components
- Lucide React (icons)

**Backend:**
- FastAPI
- MongoDB with Motor (async driver)
- JWT Authentication with bcrypt
- Emergent Object Storage (for file uploads)
- Python 3.x

## Project Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui/            # Shadcn UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Apply.jsx
│   │   │   ├── Track.jsx
│   │   │   ├── Documents.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── design_guidelines.json     # UI/UX design specifications
└── README.md                  # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables in `.env`:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=admission_portal
   JWT_SECRET=your-secret-key-here
   ADMIN_EMAIL=admin@college.edu
   ADMIN_PASSWORD=admin123
   EMERGENT_LLM_KEY=your-emergent-key
   ```

4. Run the server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables in `.env`:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. Start the development server:
   ```bash
   yarn start
   ```

The application will be available at `http://localhost:3000`

## Default Credentials

**Admin Account:**
- Email: admin@college.edu
- Password: admin123

**Test Student Account:**
- Email: student@test.com
- Password: student123

## Application Workflow

1. **Submitted** - Initial application submission
2. **Under Review** - Application is being reviewed
3. **Document Verification** - Documents are being verified
4. **Approved/Rejected** - Final decision

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications/me` - Get user's application
- `GET /api/applications` - Get all applications (admin only)
- `PATCH /api/applications/{id}` - Update application status (admin only)

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/me` - Get user's documents
- `GET /api/documents/{id}/download` - Download document

## Design System

- **Fonts:** 
  - Headings: Cormorant Garamond (serif)
  - Body: Outfit (sans-serif)
  - Code: IBM Plex Mono

- **Colors:**
  - Primary: #002FA7 (Deep Blue)
  - Accent: #C8102E (Red)
  - Background: White/Light Gray

## Development Notes

- Backend runs on port 8001
- Frontend runs on port 3000
- MongoDB connection required
- Object storage uses Emergent integration for file uploads
- JWT tokens stored in httpOnly cookies for security

## License

MIT License
