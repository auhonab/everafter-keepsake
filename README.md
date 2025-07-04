# Everafter Keepsake 💖

![Everafter Keepsake Banner](https://via.placeholder.com/1200x400?text=Everafter+Keepsake+Banner) *<!-- Replace with actual screenshot -->*

A digital sanctuary for your relationship memories, built with love and Next.js.

## 🌟 Why I Built This

"I wanted to surprise my close friend with something meaningful — and what could be better than a personal web app where we can save and relive all our memories? So, I built it."

Everafter Keepsake is more than an app; it's a living digital scrapbook that grows with your relationship, preserving precious moments in an interactive, beautiful way.

## ✨ Features

### 📅 Interactive Timeline
- Visual journey through your relationship milestones
- Clickable events reveal photos, messages, or videos

### 📸 Smart Photo Albums
- Categorized by events (vacations, anniversaries, etc.)
- Lightbox gallery for immersive viewing

### 💌 Love Notes Display
- Both typed and scanned handwritten entries
- Digital preservation of sentimental notes

### 🗺️ Map of Memories
- OpenStreetMap + Leaflet.js integration
- Clickable pins show photos and captions from shared places

### ✍️ Relationship Journal
- Blog-style entries for thoughts and memories
- Option to keep posts private

### ⏳ Anniversary Countdowns
- Live countdown timers for special dates
- Visual celebration of upcoming milestones

### 🤖 AI-Powered Poem Generator
- Creates personalized poems using Gemini API
- Generates verses inspired by your shared memories

## 🛠️ Tech Stack

**Core Framework**
- Next.js 14 (App Router)

**Authentication**
- Clerk.dev

**Database**
- MongoDB (with Mongoose ODM)

**Media Storage**
- Cloudinary

**Maps**
- OpenStreetMap + Leaflet.js

**AI Integration**
- Gemini API (Google AI)

**Deployment**
- Vercel

## 🚀 Live Deployment

The app is currently live at: [https://everafter-keepsake.vercel.app](https://everafter-keepsake.vercel.app)

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account
- Google AI Studio account (for Gemini API)
- Clerk.dev account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/everafter-keepsake.git
   cd everafter-keepsake
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit `http://localhost:3000`

## 📁 Simplified Folder Structure

```
everafter-keepsake/
├── app/
│   ├── (auth)/                   # Authentication routes
│   ├── api/                      # API routes
│   ├── dashboard/                # Main app interface
│   ├── journal/                  # Journal components
│   └── ...                       # Other feature routes
├── components/                   # Reusable components
│   ├── features/                 # Feature-specific components
│   └── ui/                       # UI primitives
├── lib/                          # Utility functions
├── models/                       # MongoDB models
├── public/                       # Static assets
└── styles/                       # Global styles
```

## 📸 Screenshots

*<!-- Add your actual screenshots here -->*
![Timeline Feature](https://via.placeholder.com/600x400?text=Timeline+Preview)
![Photo Album](https://via.placeholder.com/600x400?text=Photo+Album+Preview)
![Memory Map](https://via.placeholder.com/600x400?text=Memory+Map+Preview)

## 🚧 Future Plans

- [ ] Mobile app companion (React Native)
- [ ] Shared timeline for couples
- [ ] Automated memory reminders ("On this day...")
- [ ] Voice note integration
- [ ] Collaborative journal entries
- [ ] Memory-based recommendation system

## 👩💻 About the Creator

**Auhona Basu**  
*Computer Engineering Student & Romantic Technologist*

"I'm a Computer Engineering student passionate about using tech to build emotionally resonant and meaningful digital experiences. Everafter Keepsake represents my belief that technology should serve human connections, not replace them."

Connect with me:  
[GitHub](https://github.com/auhona) | [LinkedIn](https://linkedin.com/in/auhona) | [Portfolio](https://auhona.dev)

## 📜 License

Everafter Keepsake is open-source software licensed under the **MIT License**.

--- 

*Built with love and Next.js* 💝
