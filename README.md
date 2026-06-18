# TaskFlow Pro - MERN Task Management Dashboard

TaskFlow Pro is a full stack MERN task management dashboard built for teams that need to track projects, priorities, deadlines, and progress from one clean workspace.

## Highlights

- React dashboard with responsive layout, analytics cards, task board, filters, team panel, and project timeline.
- Express REST API with MongoDB models for users, projects, tasks, comments, and activity logs.
- JWT authentication middleware, validation, centralized error handling, and production-ready folder structure.
- Seed script with demo users, projects, and tasks.
- Polished UI built with Vite, React Router, Axios, Recharts, Lucide icons, and plain CSS.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Zod
- Tooling: ESLint-ready structure, dotenv, nodemon

## Quick Start

### 1. Install Dependencies

From the project root, you can install both apps:

```bash
npm run install:all
```

Or install them separately in two terminals.

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 2. Configure Environment

Copy the example env file:

```bash
cd server
copy .env.example .env
```

Update `server/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow_pro
JWT_SECRET=replace-this-with-a-long-secret
CLIENT_URL=http://localhost:5173
```

### 3. Seed Demo Data

Make sure MongoDB is running, then:

```bash
cd server
npm run seed
```

Demo login:

```text
Email: admin@taskflow.dev
Password: password123
```

### 4. Run The App

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev:client
```

Open `http://localhost:5173`.

## Project Structure

```text
mern-taskflow-pro/
  client/
    src/
      components/
      context/
      pages/
      services/
      styles/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      utils/
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/dashboard/summary`



```env
VITE_API_URL=https://your-backend-url.com/api
```

Then submit either your GitHub link or live link.
