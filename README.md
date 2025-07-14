# 💖 Everafter Keepsake: Where Memories Live Forever

Welcome to **Everafter Keepsake**, a heartfelt memory web app designed to preserve, relive, and celebrate the magic of friendship. From spontaneous adventures and shared inside jokes to thoughtful messages and AI-crafted poems — this full-stack app brings it all together in a joyful, interactive space. ✨

📍 **Perfect for couples, close friends, or anyone wanting to treasure meaningful moments.**

🌐 **Live Demo**: [https://everafter-keepsake.vercel.app](https://everafter-keepsake.vercel.app)

---

## 🧰 Tech Stack

* **Full Stack Framework**: Next.js 14 (App Router) ⚛️
* **Authentication**: Clerk.dev 🔐
* **Database**: MongoDB (Mongoose) 🍃
* **Media Hosting**: Cloudinary 📷
* **Maps**: OpenStreetMap + Leaflet.js 🗺️
* **AI Integration**: Gemini API 🤖
* **Deployment**: Vercel 🚀

---

## ✨ Features

### 📅 Interactive Timeline

* Scroll through your relationship’s milestones
* Clickable events reveal personal stories, photos, or videos

### 📸 Smart Photo Albums

* Event-based galleries (e.g., trips, dates, anniversaries)
* Lightbox for immersive photo viewing

### 💌 Love Notes Archive

* Upload typed or scanned handwritten letters
* Preserve emotional messages in a digital home

### 🗺️ Map of Memories

* Pin locations tied to special moments
* View photos and mini-stories from each location

### ✍️ Relationship Journal

* Blog-style entries to document thoughts and memories
* Optional privacy for personal reflections

### ⏳ Anniversary Countdown

* Live countdowns to your important dates
* Never miss a milestone again! 🎉

### 🤖 AI-Powered Poem Generator

* Personalized poetry crafted with Gemini API
* Celebrate love with creative, sentimental verses

---

## 🗂️ Folder Structure

```
everafter-keepsake/
├── .env.local              # Environment variables
├── package.json            # Project metadata and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js config
├── tsconfig.json           # TypeScript config

├── public/                 # Static assets (SVGs, Leaflet map icons)
│   └── leaflet/            # Leaflet-specific assets

├── src/
│   ├── app/                # App router pages & routes
│   │   ├── (auth)/         # Sign-in and sign-up routes
│   │   ├── timeline/       # Interactive timeline feature
│   │   ├── albums/         # Photo album routes
│   │   ├── journal/        # Relationship journal
│   │   ├── love-notes/     # Love notes feature
│   │   ├── memory-map/     # Map of memories
│   │   ├── countdowns/     # Anniversary countdown timers
│   │   └── api/            # API route handlers (albums, journal, etc.)

│   ├── components/         # Reusable React components
│   │   ├── ui/             # UI elements like buttons, forms, modals
│   │   ├── common/         # Layout & header
│   │   └── features/       # Feature-specific components (e.g., PoemGenerator)

│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and DB logic
│   ├── models/             # Mongoose models (Album, JournalEntry, User, etc.)
│   └── styles/             # Global and map-specific styles

├── middleware.ts           # Middleware for auth or route protection
├── fix-middleware.js       # Middleware support file for Vercel

```

---

## 🚀 Installation & Setup

### 📦 Prerequisites

* Node.js 18+
* Clerk.dev account
* MongoDB Atlas or local instance
* Cloudinary account
* Google AI Studio for Gemini API

### 🛠 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/auhonab/everafter-keepsake.git
   cd everafter-keepsake
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env.local` file** in the root with:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

5. Visit: [http://localhost:3000](http://localhost:3000)

---

## 💡 Usage Guide

🧑‍🤝‍🧑 **Create an account or log in**
📌 **Add events, journal entries, and photos**
📍 **Pin memories on the interactive map**
💌 **Preserve handwritten or typed love notes**
🪄 **Generate a personalized poem with one click**
💞 **Look back on your relationship anytime, beautifully**

---

## 📬 Contributing

We’d love your contributions! 🌟

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add [feature]"`
4. Push: `git push origin feature/your-feature`
5. Submit a Pull Request 🚀

---

## ✨ Creator

Built with 💖 by **Auhona Basu**
Computer Engineering @ Lassonde School of Engineering, York University

🐙 [GitHub](https://github.com/auhonab) • 💼 [LinkedIn](https://www.linkedin.com/in/auhona-basu) • 📸 [Instagram](https://www.instagram.com/auhona_03)

---

> *"Because memories deserve more than a photo gallery — they deserve a story."*

---

