# CareerPilot AI — AI-Powered Career Companion

CareerPilot AI is a web application designed to help job seekers analyze their resumes, match their skills with job descriptions, and practice mock interviews using AI.

## Features

- **AI Resume Analyzer:** Analyze your resume against a job description.
- **Job Match Analysis:** Understand skill gaps and identify areas for improvement.
- **AI Mock Interview:** Practice interview questions based on your job role and experience level.
- **Interview Results:** Review your interview performance and AI-generated feedback.
- **User Authentication:** Register and log in to access protected features.
- **Analysis History:** Access previously saved resume analyses.
- **Responsive UI:** Use the application across different screen sizes.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### AI Integration
- Google Gemini API
- Groq API fallback

## Project Structure

```text
CareerPilot-AI/
├── client/       # React frontend
└── server/       # Node.js and Express backend
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CareerPilot-AI
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Create a `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

Configure the required environment variables in `server/.env` using your own credentials. Never commit secret keys or database credentials to GitHub.

Start the backend using the start script defined in `server/package.json`:

```bash
npm start
```

## Environment Variables

Configure the following variables on your local machine or deployment platform as applicable:

- `VITE_API_URL` — Backend API base URL
- `PORT` — Backend server port
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `GEMINI_API_KEY` — Google Gemini API key
- `GROQ_API_KEY` — Groq API key

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Author

Developed as an AI-powered career assistance project to help job seekers improve their resumes and interview preparation.

