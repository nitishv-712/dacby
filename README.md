# HN Stories — MERN Stack App

A full-stack web application that scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com), displays them with pagination, and lets authenticated users bookmark their favourite stories.

**Live Demo:** [https://dacby.vercel.app](https://dacby.vercel.app)

---

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend  | Node.js, Express 5                          |
| Database | MongoDB, Mongoose                           |
| Auth     | JWT via HTTP-only cookies                   |
| Scraper  | Axios + Cheerio                             |

---

## Features

- Scrapes top 10 stories from Hacker News on server start and on demand
- Stories sorted by points (descending) with pagination
- JWT authentication stored in HTTP-only cookies
- Bookmark toggle persisted to MongoDB per user
- Protected `/bookmarks` page — redirects to login if unauthenticated
- Auth state managed via React Context API

---

## Project Structure

```
Dacby/
├── README.md
├── dev.sh                    # Starts both servers concurrently
└── frontend/
    ├── server/               # Express backend
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── scraper.js
    │   │   └── storyController.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── Story.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── scrape.js
    │   │   └── stories.js
    │   ├── .env.example
    │   └── server.js
    └── src/                  # React frontend
        ├── api/
        │   └── axios.ts
        ├── components/
        │   ├── Navbar.tsx
        │   ├── ProtectedRoute.tsx
        │   └── StoryCard.tsx
        ├── context/
        │   └── AuthContext.tsx
        └── pages/
            ├── Bookmarks.tsx
            ├── Home.tsx
            ├── Login.tsx
            └── Register.tsx
```

---

## Local Setup

### Prerequisites

- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/nitishv-712/dacby.git
cd dacby
```

### 2. Configure backend environment

```bash
cp frontend/server/.env.example frontend/server/.env
```

Edit `frontend/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hn_scraper
JWT_SECRET=<your_strong_random_secret>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Configure frontend environment

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_API_TARGET=http://localhost:5000
```

### 4. Install dependencies

```bash
# Backend
cd frontend/server && npm install

# Frontend
cd .. && npm install
```

### 5. Run the app

From the project root:

```bash
chmod +x dev.sh
./dev.sh
```

| Service  | URL                   |
| -------- | --------------------- |
| Backend  | http://localhost:5000 |
| Frontend | http://localhost:5173 |

> Press `Ctrl+C` to stop both servers.

---

## Environment Variables

### Backend (`frontend/server/.env`)

| Variable     | Description                              | Example                        |
| ------------ | ---------------------------------------- | ------------------------------ |
| `PORT`       | Port the Express server listens on       | `5000`                         |
| `MONGO_URI`  | MongoDB connection string                | `mongodb://localhost:27017/hn` |
| `JWT_SECRET` | Secret key used to sign JWT tokens       | `<your_strong_random_secret>`  |
| `NODE_ENV`   | Environment (`development`/`production`) | `development`                  |
| `CLIENT_URL` | Frontend origin allowed by CORS          | `http://localhost:5173`        |

### Frontend (`frontend/.env`)

| Variable          | Description                | Example                 |
| ----------------- | -------------------------- | ----------------------- |
| `VITE_API_TARGET` | Backend URL for Vite proxy | `http://localhost:5000` |

---

## API Reference

### Auth

| Method | Endpoint             | Description     | Auth |
| ------ | -------------------- | --------------- | ---- |
| POST   | `/api/auth/register` | Register a user | No   |
| POST   | `/api/auth/login`    | Login           | No   |
| POST   | `/api/auth/logout`   | Logout          | No   |

### Stories

| Method | Endpoint                       | Description                       | Auth     |
| ------ | ------------------------------ | --------------------------------- | -------- |
| GET    | `/api/stories?page=1&limit=10` | Get paginated stories (by points) | No       |
| GET    | `/api/stories/:id`             | Get a single story                | No       |
| GET    | `/api/stories/bookmarks`       | Get current user's bookmarks      | Required |
| POST   | `/api/stories/:id/bookmark`    | Toggle bookmark on a story        | Required |

### Scraper

| Method | Endpoint      | Description                | Auth |
| ------ | ------------- | -------------------------- | ---- |
| POST   | `/api/scrape` | Manually trigger HN scrape | No   |

---

## Scripts

### Backend (`frontend/server/`)

```bash
npm run dev   # Start with nodemon (hot reload)
npm start     # Start with node
```

### Frontend (`frontend/`)

```bash
npm run dev     # Start Vite dev server
npm run build   # Production build
npm run preview # Preview production build
```

---

## Deployment

The app is deployed on Vercel:

- **Frontend:** [https://dacby.vercel.app](https://dacby.vercel.app)
- **Backend:** [https://dacby-server.vercel.app](https://dacby-server.vercel.app)

A `vercel.json` in the frontend root proxies all `/api/*` requests to the backend and handles React Router client-side routing.
