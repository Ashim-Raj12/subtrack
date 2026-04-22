# SubTrack Deployment Guide (Render.com) 🚀

This guide explains how to deploy SubTrack as two separate services: a **Web Service** for the backend and a **Static Site** for the frontend.

## 1. Database Setup (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and allow access from `0.0.0.0/0` (Render's dynamic IPs).
3. Create a database user and save the password.
4. Copy the **Connection String** (URI). It should look like: `mongodb+srv://<username>:<password>@cluster0.liddkbu.mongodb.net/`.

---

## 2. Backend Deployment (Server)

1. Log in to [Render](https://render.com) and click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the following:
   - **Name**: `subtrack-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In the **Environment** tab, add the following variables:
   - `PORT`: `5000`
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A long random string)
   - `GOOGLE_CLIENT_ID`: (From Google Cloud Console)
   - `GOOGLE_CLIENT_SECRET`: (From Google Cloud Console)
   - `YOUTUBE_API_KEY`: (From Google Cloud Console)
   - `RESEND_API_KEY`: (From Resend)
   - `FRONTEND_URL`: (The URL of your frontend, e.g., `https://subtrack-web.onrender.com`)
5. Click **Create Web Service**.

---

## 3. Frontend Deployment (Client)

1. Click **New +** > **Static Site**.
2. Connect your GitHub repository.
3. Configure the following:
   - **Name**: `subtrack-web`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. In the **Environment** tab, add the following variables:
   - `VITE_GOOGLE_CLIENT_ID`: (Your Google Client ID)
   - `VITE_API_URL`: (The URL of your backend, e.g., `https://subtrack-api.onrender.com`)
5. Click **Create Static Site**.

---

## 4. Google Cloud Console Configuration

To allow your deployed app to talk to Google:

1. Go to Your [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project > **APIs & Services** > **Credentials**.
3. Under **OAuth 2.0 Client IDs**, edit your client ID.
4. **Authorized JavaScript origins**:
   - Add `http://localhost:5173`
   - Add your frontend URL (e.g., `https://subtrack-web.onrender.com`)
5. **Authorized redirect URIs**:
   - Add your frontend URL (e.g., `https://subtrack-web.onrender.com`)
6. Save changes.

---

## 5. Troubleshooting 🛠️

- **CORS Issues**: Ensure `FRONTEND_URL` in the backend matches the frontend's domain perfectly.
- **Sync Failing**: Check the Render logs in the backend web service. Ensure your `YOUTUBE_API_KEY` and `GOOGLE_CLIENT_SECRET` are correct.
- **Email Notifications**: Ensure your domain is verified on Resend if you're using a custom domain.

---
Your SubTrack app is now live! 🎉
