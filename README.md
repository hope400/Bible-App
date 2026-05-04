# 🌿 Bibble — Bible & Music Reflection App

> *"Your word is a lamp to my feet and a light to my path."* — Psalm 119:105

A full-stack devotional web application that combines scripture, music, journaling, and community for a meaningful daily spiritual experience. Built with React, Node.js, MongoDB, and Socket.io.

---

## 🌐 Live Demo

| | URL |
|---|---|
| 🖥️ **Frontend** | https://bible-app-frontend.onrender.com |
| ⚙️ **Backend API** | https://bible-app-tvdf.onrender.com |

> ⚠️ The app may take **30–60 seconds** to load on first visit — Render free tier wakes up from sleep.

---

## 🎥 Video Demonstration

[Watch Demo Video](https://lcieducation-my.sharepoint.com/personal/evelyne_mukarukundo_lcieducation_net/Documents/Enregistrements/Call+with+Hope+Jeanine+Ukundimana-20260503_235950-Meeting+Recording.mp4?web=1)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📖 **Bible Reader** | Full KJV Bible via API.Bible — highlight, favorite, and annotate verses |
| 🎵 **Music** | Curated worship playlists by mood, playing directly in the app |
| 📅 **Daily Verse** | Rotating verse calendar showing past, present & upcoming verses |
| 📓 **Journal** | Personal reflection journal saved to MongoDB with full CRUD |
| 🔖 **Favorites** | Save and revisit favorite verses from the Bible reader |
| 📚 **Library** | Reading plans and worship music playlists |
| 🔥 **Streak Tracker** | Daily reading habit tracker with milestone badges |
| 💬 **Community** | Share reflections and interact in real time via WebSockets |
| 🔔 **Live Notifications** | Real-time toast alerts when someone likes your post |
| ⚙️ **Settings** | Theme customization, notification preferences, profile editing |
| 🔐 **Authentication** | JWT-based signup and login with Bcrypt password hashing |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication tokens |
| Bcryptjs | Password hashing |
| Socket.io | Real-time WebSockets |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| Socket.io Client | Real-time connection |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- API.Bible account (free at [scripture.api.bible](https://scripture.api.bible))

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend:

```bash
node server.js
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
VITE_BIBLE_API_KEY=your_bible_api_key
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔐 Environment Variables

### Backend `.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `PORT` | Server port (default: 5000) | Optional |

### Frontend `.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ✅ |
| `VITE_BIBLE_API_KEY` | API key from scripture.api.bible | ✅ |

> ⚠️ Never commit `.env` files to GitHub — they are listed in `.gitignore`.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create account | No |
| POST | `/api/auth/login` | Login, receive JWT | No |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Journal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journals` | Get all entries |
| POST | `/api/journals` | Create entry |
| GET | `/api/journals/:id` | Get one entry |
| PUT | `/api/journals/:id` | Update entry |
| DELETE | `/api/journals/:id` | Delete entry |

### Posts / Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Get one post |
| PUT | `/api/posts/:id` | Update post |
| PUT | `/api/posts/:id/like` | Like / unlike |
| DELETE | `/api/posts/:id` | Delete post |

> All Journal and Post endpoints require `Authorization: Bearer <token>` header.

---

## 📦 Data Models

### User
```js
{
  name: String,
  email: String,
  password: String,     // hashed with bcrypt
  streak: Number,
  mood: String,
  theme: String,
  favoriteVerses: [String],
  bookmarks: [String]
}
```

### Journal
```js
{
  userId: ObjectId,
  title: String,
  body: String,
  mood: String,
  verseRef: String,
  isPrivate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```js
{
  userId: ObjectId,
  content: String,
  verseRef: String,
  likes: [ObjectId],
  comments: [{ userId: ObjectId, text: String, createdAt: Date }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚡ WebSocket Events

| Event | Direction | Trigger | Description |
|-------|-----------|---------|-------------|
| `post:created` | Server → Clients | New post | Broadcasts new post to all users instantly |
| `post:deleted` | Server → Clients | Post deleted | Removes post from all feeds instantly |
| `notification:new` | Server → Clients | Post liked | Live toast notification to post owner |
| `members:update` | Server → Clients | Connect/disconnect | Broadcasts live member count |
| `activity:new` | Server → Clients | Any action | Updates real-time activity ticker |
| `user:join` | Client → Server | Opens Community | Registers user as live |
| `user:action` | Client → Server | User action | Updates user's activity in live sidebar |

---

## ☁️ Deployment on Render

### Backend (Web Service)
```
Root Directory:   backend
Build Command:    npm install
Start Command:    node server.js
Environment:      MONGODB_URI, JWT_SECRET, PORT
```

### Frontend (Static Site)
```
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: dist
Environment:       VITE_API_URL, VITE_BIBLE_API_KEY
Redirect Rule:     /* → /index.html (Rewrite)
```

---

## 📁 Project Structure

```
Bible-App/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Journal.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── journal.js
│   │   └── post.js
│   ├── server.js
│   ├── socket.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── BibleContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BibleReader.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── DailyVerse.jsx
│   │   │   ├── Community.jsx
│   │   │   └── Settings.jsx
│   │   ├── GlobalThemes.css
│   │   ├── useReminder.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Mukarukundo Evelyne** | Frontend — Bible Reader, Dashboard, Journal, Library, Favorites, Daily Verse, Deployment |
| **Ukundimana Hope Jeanine** | Backend — Auth, Models, Routes, Community, Settings |

---

## 🎓 Course

**Trends in Technology — W2026**
LaSalle College Montréal
