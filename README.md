# Recco

Recco is a social media platform designed for users to share and recommend their favorite shows across a variety of mediums and genres. The platform enables users to discover new content, connect with others who share similar interests, and engage in meaningful discussions about their favorite entertainment.

## Features

### User Authentication & Profile Management
- Secure user registration and login system
- JWT-based authentication with Bearer tokens
- Customizable user profiles with bio
- Profile editing capabilities
- Protected routes for authenticated users

### Content Management
- Create and share detailed show recommendations
- Include synopses and personal reviews
- Rate shows out of 10
- Assign genres and mediums (Movie, Anime, Manga, etc.)
- Track completion status (Completed / Ongoing)
- Update or delete your own posts

### Social Interaction
- Comment on posts with threaded replies
- Like or dislike comments and posts
- Edit and delete your own comments
- View other users' profiles

### Real-Time Notifications
- Instant notifications via WebSocket (Socket.io)
- Notified when someone likes or dislikes your post
- Notified when someone comments on your post or replies to your comment
- Notified when someone likes your comment
- Interactive bell icon with unread count badge
- Notification dropdown panel with mark-all-as-read
- Click a notification to jump directly to the related post

### Search & Discovery
- Search posts by title
- Filter by genre, medium, and status
- Configurable posts-per-page
- Paginated feed

### User Interface
- Dark theme throughout
- Clean card-based layouts
- Mobile-responsive design
- Loading states and animations
- SVG avatar initials with hash-based coloring

## Technologies Used

**Frontend:**
- **React** — UI library
- **Zustand** — Lightweight state management
- **Formik** — Form state and validation
- **Yup** — Schema-based form validation
- **Font Awesome** — Icons
- **React Router** — Client-side routing
- **Vite** — Build tool and dev server

**Backend:**
- **Node.js** + **Express** — Server and API
- **Socket.io** — Real-time WebSocket notifications
- **Prisma ORM** — Database access and migrations
- **Joi** — Request validation
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing

**Database:**
- **TiDB Serverless** (MySQL-compatible)

## Project Structure

```
recco/
├── package.json              # Root package with dev scripts
├── server/
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth, validation, error handling
│   ├── prisma/               # Schema + seed data
│   ├── routes/               # Express route definitions
│   └── services/             # Business logic
├── src/
│   ├── components/           # React components
│   │   ├── user/             # Authenticated user components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ...
│   ├── data/                 # Static data (genres, mediums)
│   ├── schemas/              # Yup validation schemas
│   ├── store/                # Zustand state management
│   └── App.css               # Global styles
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL-compatible database (TiDB Serverless recommended)

### Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

3. Configure environment variables:
   Create `server/.env` with:
   ```env
   DATABASE_URL="mysql://user:password@host:4000/recco?sslaccept=strict"
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Set up the database schema and seed data:
   ```bash
   cd server
   npx prisma db push
   node prisma/seed.js
   ```

5. Start the development server (runs both frontend and backend):
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

### Seed Accounts

| Email | Password |
|---|---|
| alice@example.com | Password1! |
| bob@example.com | Password1! |
