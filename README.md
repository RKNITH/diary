# 📓 DiaryVault — MERN Diary Management System

A full-stack MERN application for managing structured diaries with auto-indexed 50-row entries, real-time amount tracking, admin-only CRUD via JWT, and a public read-only view.

---

## 🗂 Project Structure

```
diary-app/
├── backend/           # Node.js + Express + MongoDB API
│   ├── config/        # DB connection
│   ├── controllers/   # Business logic
│   ├── middleware/    # JWT auth middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   ├── server.js      # Entry point
│   ├── seed.js        # DB seeder
│   └── vercel.json
└── frontend/          # React + Vite + Redux + Tailwind
    ├── src/
    │   ├── api/       # Axios instance + services
    │   ├── components/# Reusable components
    │   ├── pages/     # Route pages
    │   └── store/     # Redux slices
    └── vercel.json
```

---

## ⚙️ Tech Stack

| Layer      | Tech                                      |
|------------|-------------------------------------------|
| Frontend   | React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion |
| Backend    | Node.js, Express.js (ES Modules)          |
| Database   | MongoDB + Mongoose                        |
| Auth       | JWT (jsonwebtoken + bcryptjs)             |
| Deployment | Vercel (frontend + backend)               |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env     # Fill in your MONGO_URI and JWT_SECRET

# Frontend
cd frontend
npm install
cp .env.example .env     # Set VITE_API_URL=http://localhost:5000/api
```

### 2. Seed the Database (optional)

```bash
cd backend
npm run seed
# Creates admin (username: admin, password: admin123456) + 2 sample diaries
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev          # Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev          # Runs on http://localhost:3000
```

---

## 🔐 Admin Setup via Postman

Since there's no public registration UI, create the admin via Postman:

### Register Admin
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "yourSecurePassword"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "yourSecurePassword"
}
```
→ Returns `{ token, admin }`. Copy the token.

### Use Token for Protected Routes
```
Authorization: Bearer <your_token_here>
```

---

## 📡 API Reference

### Auth
| Method | Route                  | Auth   | Description         |
|--------|------------------------|--------|---------------------|
| POST   | /api/auth/register     | None   | Register admin (Postman only) |
| POST   | /api/auth/login        | None   | Login, get JWT      |
| GET    | /api/auth/me           | Admin  | Get current admin   |

### Diaries
| Method | Route                  | Auth   | Description         |
|--------|------------------------|--------|---------------------|
| GET    | /api/diaries           | Public | Get all diaries + totals |
| GET    | /api/diaries/:id       | Public | Get single diary    |
| POST   | /api/diaries           | Admin  | Create diary (auto serial) |
| PUT    | /api/diaries/:id       | Admin  | Update diary info   |
| DELETE | /api/diaries/:id       | Admin  | Delete diary + entries |

### Entries
| Method | Route                              | Auth   | Description         |
|--------|------------------------------------|--------|---------------------|
| GET    | /api/entries/diary/:diaryId        | Public | Get all entries     |
| PUT    | /api/entries/:id                   | Admin  | Update single entry |
| PUT    | /api/entries/diary/:diaryId/bulk   | Admin  | Bulk update 50 rows |

### Summary
| Method | Route           | Auth   | Description              |
|--------|-----------------|--------|--------------------------|
| GET    | /api/summary    | Public | Global totals + per-diary |

---

## 🎯 Key Features

- **Auto Serial Numbering**: Diary #1 = serials 1–50, Diary #2 = 51–100, etc. Auto-computed on creation.
- **50 Rows Auto-Created**: On diary creation, 50 blank entries are instantly seeded.
- **Real-time Calculations**: Done / Due / Pending totals update live as admin types.
- **Color-coded UI**: 🟢 Green = Done, 🟡 Amber = Due, 🔴 Red = Pending
- **Global Dashboard**: Aggregate totals across all diaries on the homepage.
- **Public Read-Only**: Anyone can view diaries without login.
- **Admin Gated**: Create/edit/delete only with valid JWT.
- **Glassmorphism UI**: Emerald + Amber + Slate dark theme.
- **Mobile-First**: Fully responsive on all screen sizes.

---

## 🌐 Deploying to Vercel

### Backend
1. Push `backend/` to a GitHub repo
2. Import to Vercel → Framework: **Other**
3. Set Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your frontend Vercel URL)
   - `NODE_ENV=production`

### Frontend
1. Push `frontend/` to a GitHub repo
2. Import to Vercel → Framework: **Vite**
3. Set Environment Variables:
   - `VITE_API_URL=https://your-backend.vercel.app/api`

---

## 🛡️ Security Notes

- Passwords are hashed with bcryptjs (salt rounds: 12)
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)
- All admin routes protected by `protect` middleware
- CORS configured to allow only frontend origin in production
- No sensitive data exposed in API responses (`select: false` on password)

---

## 📦 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```
