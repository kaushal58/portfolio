# Kaushal Mayani — MERN Portfolio

A full-stack portfolio built with the **MERN stack**:

- **M**ongoDB — portfolio content & contact messages
- **E**xpress — REST API
- **R**eact — Vite + TypeScript frontend
- **N**ode.js — API server

## Project structure

```
├── client/          # React frontend (Vite)
├── server/          # Express + MongoDB API
└── package.json     # Root scripts to run both
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally, or a MongoDB Atlas connection string

## Setup

1. **Install dependencies**

   ```bash
   npm run install:all
   ```

2. **Configure environment**

   ```bash
   cp server/.env.example server/.env
   ```

   Edit `server/.env` if needed (default connects to `mongodb://127.0.0.1:27017/portfolio`).

3. **Seed the database** (first time only)

   ```bash
   npm run seed
   ```

4. **Add images** (optional)

   Place portfolio images in `client/public/assets/`:
   - `profile.jpg`
   - `proj-plant.jpg`
   - `proj-ecom.jpg`
   - `proj-sms.jpg`

5. **Start development**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - API: http://localhost:5000

## API endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/health`    | Health check             |
| GET    | `/api/portfolio` | Full portfolio data      |
| POST   | `/api/contact`   | Submit contact form      |
| GET    | `/api/contact`   | List contact messages    |

## Production

```bash
npm run build
NODE_ENV=production npm start
```

The Express server serves the built React app from `client/dist`.

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Framer Motion, TanStack Query
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
