# 🚀 JobTrack — Smart Job Application Tracker

A production-ready MERN stack application that helps job seekers **track, analyze, and automate** their job applications with intelligent email parsing, follow-up reminders, and premium status visualization.

---

## ✨ Live Demo

* 🌐 Frontend: https://job-track-eight.vercel.app
* ⚙️ Backend: https://jobtrack-h7o1.onrender.com

---

## 📌 Key Features

### 🔐 Authentication

* JWT email/password login
* Google OAuth login (One-click sign in)
* Protected routes with middleware

### 📋 Application Management

* Full CRUD for job applications
* Search, filter, and sorting
* Status tracking with history
* Premium progress visualization

### 📊 Analytics Dashboard

* Status distribution charts (Recharts)
* Application statistics
* Upcoming follow-up widget
* Urgency highlighting

### ⏰ Smart Follow-Up System

* Follow-up date tracking
* Hourly cron reminder scanner
* Upcoming follow-ups API
* Urgent highlight within 24 hours

### 🤖 Email Intelligence Engine (MVP)

* Rule-based job email detection
* Automatic status classification
* Basic company extraction
* Duplicate protection logic
* Auto create/update applications

### 🎨 Premium UI/UX

* Modern SaaS-style cards
* Status badge + animated progress bar
* Responsive mobile layout
* Toast notifications
* Clean Tailwind design

---

## 🏗️ Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Recharts
* Axios
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* node-cron
* google-auth-library

**Deployment**

* Vercel (Frontend)
* Render (Backend)

---

## 📡 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/google`
* GET `/api/auth/me`

### Applications

* GET `/api/applications`
* POST `/api/applications`
* PUT `/api/applications/:id`
* DELETE `/api/applications/:id`
* GET `/api/applications/stats`
* GET `/api/applications/upcoming-followups`
* POST `/api/applications/process-email`

---

## ⚙️ Local Setup

### 1️⃣ Clone repo

```bash
git clone <your-repo-url>
cd JobTrack
```

---

### 2️⃣ Backend setup

```bash
cd server
npm install
npm run dev
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

---

### 3️⃣ Frontend setup

```bash
cd client
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📸 Screenshots

> Add your app screenshots here (recommended for recruiters)

* Dashboard
* Applications page
* Email import demo
* Mobile view

---

## 🚀 Future Improvements

* Gmail OAuth sync
* Background email polling
* AI-based email classification
* Duplicate detection refinement
* Notifications system

---

## 👨‍💻 Author

**Johil Mehra**

---

⭐ If you like this project, give it a star!
