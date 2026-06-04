# NextJob Portal

NextJob Portal is a modern full-stack job portal built with React, Tailwind CSS, Axios, React Router, Node.js, Express.js, MongoDB Atlas, and Mongoose.

- Public users can browse jobs and internships, open external apply links, use a resume builder, download resume templates, and generate AI interview questions.
- Admin users can sign in to manage jobs, internships, resume templates, and interview categories from a protected dashboard.

There is no public user login or registration system in this implementation. Authentication is required only for the admin dashboard.

## Highlights

- Responsive React frontend with dark/light mode and reusable components
- Express REST API with clean controller, route, and model separation
- MongoDB Atlas integration with Mongoose
- Multer-powered resume template uploads
- Admin-only JWT authentication for dashboard access and write operations
- AI interview question generation via the OpenAI Responses API with a fallback mode for local setup
- ATS-friendly PDF resume generation with `pdf-lib`
- Deployment-ready AWS EC2, PM2, and Nginx configuration
- Sample seed data for jobs, internships, templates, and AI interview categories

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios
- React Router
- pdf-lib

### Backend

- Node.js
- Express.js
- Mongoose
- Multer
- dotenv
- cors
- jsonwebtoken
- OpenAI Node SDK

### Database

- MongoDB Atlas

## Folder Structure

```text
nextjob/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- data/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   |-- uploads/
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- deployment/
|   |-- nginx/
|   |-- pm2/
|   `-- aws-ec2.md
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- .gitignore
|-- package-lock.json
|-- package.json
`-- README.md
```

## Core Features

### Public User Features

- View all admin-posted jobs
- View all admin-posted internships
- Open external apply links for jobs and internships
- Create ATS-friendly resumes and export them as PDF
- Preview and download admin-uploaded resume templates
- Generate AI interview questions for HR, technical, and aptitude rounds

### Admin Features

- Admin login page with JWT-protected dashboard access
- Add, edit, and delete jobs
- Add, edit, and delete internships
- Attach external apply URLs
- Upload and manage resume templates
- Manage AI interview categories used by the interview generator

## API Routes

### Authentication

- `POST /api/auth/login`
- `GET /api/auth/me`

### Jobs

- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` (admin only)
- `PUT /api/jobs/:id` (admin only)
- `DELETE /api/jobs/:id` (admin only)

### Internships

- `GET /api/internships`
- `GET /api/internships/:id`
- `POST /api/internships` (admin only)
- `PUT /api/internships/:id` (admin only)
- `DELETE /api/internships/:id` (admin only)

### Resume Templates

- `GET /api/resume-templates`
- `POST /api/resume-templates` (admin only)
- `PUT /api/resume-templates/:id` (admin only)
- `DELETE /api/resume-templates/:id` (admin only)

### AI Interview

- `GET /api/interviews/categories`
- `POST /api/interviews/categories` (admin only)
- `PUT /api/interviews/categories/:id` (admin only)
- `DELETE /api/interviews/categories/:id` (admin only)
- `POST /api/interviews/generate`

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Example values:

```env
# backend/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nextjob
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-admin-password
ADMIN_NAME=NextJob Admin
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=12h
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
UPLOADS_DIR=
```

```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Seed sample data

```bash
npm run seed
```

### 4. Run the apps

Backend:

```bash
npm run dev:backend
```

Frontend:

```bash
npm run dev:frontend
```

### 5. Admin login

- Open `/admin/login`
- Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`

## Production Build

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm run start
```

In production behind Nginx, set the frontend API base URL to `/api`.

## MongoDB Atlas Notes

- Create a MongoDB Atlas cluster
- Add the EC2 public IP to the Atlas network access list
- Create a dedicated database user with read/write access to the `nextjob` database
- Paste the resulting connection string into `backend/.env` as `MONGO_URI`

## OpenAI Notes

- The interview generator uses the OpenAI Node SDK
- If `OPENAI_API_KEY` is set, the backend calls the Responses API
- If no API key is present or the API call fails, the backend returns a structured fallback question set so the feature still works during local setup

## Admin Authentication Notes

- Admin sign-in uses `POST /api/auth/login` and returns a JWT
- The frontend stores the JWT in local storage and sends it as a Bearer token for protected admin actions
- Public browsing routes remain open, but admin write operations are blocked without a valid token
- Set a strong `JWT_SECRET` and a non-default `ADMIN_PASSWORD` before deployment

## File Upload Notes

- Resume template files are stored under `backend/uploads/templates`
- Uploaded files are exposed by the backend at `/uploads/templates/...`
- The sample seed includes SVG-based resume template previews so the UI works immediately after seeding

## Deployment

- PM2 config: [deployment/pm2/ecosystem.config.cjs](/C:/Users/mohit/Desktop/nextjob/deployment/pm2/ecosystem.config.cjs)
- Nginx config: [deployment/nginx/nextjob.conf](/C:/Users/mohit/Desktop/nextjob/deployment/nginx/nextjob.conf)
- AWS EC2 guide: [deployment/aws-ec2.md](/C:/Users/mohit/Desktop/nextjob/deployment/aws-ec2.md)

## Suggested Improvements

- Add pagination, filters, and saved searches for large job inventories
- Store uploaded files in S3 instead of local disk for multi-server deployments
- Replace single-admin env credentials with a database-backed admin user model and hashed passwords if you need multiple administrators
- Add analytics, audit logs, and validation middleware for stronger production controls
