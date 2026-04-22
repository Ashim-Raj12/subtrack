# SubTrack 📺

SubTrack is a premium YouTube subscription management tool that delivers a curated, distraction-free feed of your latest subscriptions directly to your dashboard and inbox. 

Stop getting lost in the YouTube recommendation rabbit hole. SubTrack focuses on what matters: the creators you actually follow.

![SubTrack Preview](https://via.placeholder.com/1200x600?text=SubTrack+Modern+Dashboard+Preview)

## ✨ Features

- **Curated Feed**: View the latest long-form videos from your YouTube subscriptions without the algorithm noise.
- **Auto-Sync**: Automatically fetches new content on a schedule you define.
- **Email Notifications**: Get a daily digest of new videos from your favorite creators via Resend.
- **Smart Filtering**: Automatically ignores "Shorts" and focus on high-quality long-form content.
- **Modern UI**: A sleek, dark-mode first interface built for clarity and speed.
- **Google OAuth**: Secure login and seamless integration with your YouTube account.

## 🚀 Tech Stack

### Frontend
- **React 19** with **Vite**
- **TypeScript**
- **Lucide React** (Icons)
- **React Router 7**
- **Google OAuth** (@react-oauth/google)

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **YouTube Data API v3**
- **Node-Cron** (Scheduled jobs)
- **Resend** (Email delivery)
- **JSON Web Token** (Authentication)

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth and YouTube API)

### 1. Clone the repository
```bash
git clone https://github.com/Ashim-Raj12/subtrack.git
cd subtrack
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000
```

### 4. Run Locally
**Start Backend:**
```bash
cd server
npm run dev
```

**Start Frontend:**
```bash
cd client
npm run dev
```

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for focused content consumption.
