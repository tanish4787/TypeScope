# TypeScope MERN App

A modern typing analysis application built with **MongoDB + Express + React + Node.js**.

## Features
- Paste any paragraph and start a typing session.
- Real-time net WPM, accuracy, error count, and backspace tracking.
- AI-style insights after session completion.
- Premium glassmorphism UI with subtle animations and iconography.
- MongoDB persistence when `MONGODB_URI` is configured, with in-memory fallback.

## Project Structure
- `server/` – Express + Mongoose API.
- `client/` – React + Vite frontend.
- `docs/` – PRD and frontend blueprint.

## Run Locally

### 1) Backend
```bash
cd server
npm install
npm run start
```

Optional `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/typescope
```

### 2) Frontend
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.
