# 🔴 RedEcho - Deployment Guide

Complete guide to deploy RedEcho (React frontend, Node.js backend, MongoDB) to the internet for FREE.

---

## 📋 Prerequisites

Before starting, ensure you have:

- Git account (GitHub, GitLab, or Bitbucket)
- Render account (free tier: https://render.com)
- Vercel account (free tier: https://vercel.com)
- MongoDB Atlas account (free tier: https://www.mongodb.com/cloud/atlas)

---

## 🏗️ Project Structure

```
redecho/
├── server/           # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── .gitignore
├── client/           # React + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .gitignore
├── .gitignore
└── README.md
```

---

# 🗄️ STEP 1: SET UP MONGODB ATLAS (Database)

## 1.1 Create MongoDB Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with Google, GitHub, or email
3. Create a free account

## 1.2 Create a Free Cluster

1. Click **"Create"** on the left sidebar
2. Select **"M0 Cluster"** (free tier)
3. Choose region closest to you
4. Click **"Create Cluster"**
5. Wait 2-3 minutes for cluster to create

## 1.3 Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"+ Add New Database User"**
3. **Username**: `redecho`
4. **Password**: Generate secure password (save it!)
5. Click **"Add User"**

## 1.4 Whitelist Your IP

1. Go to **"Network Access"** (left sidebar)
2. Click **"+ Add IP Address"**
3. Select **"Allow Access from Anywhere"** → `0.0.0.0/0`
4. Click **"Confirm"**

## 1.5 Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"** → **"Node.js"**
4. Copy the connection string:
   ```
   mongodb+srv://redecho:PASSWORD@cluster0.xxxxx.mongodb.net/redecho?retryWrites=true&w=majority
   ```
5. Replace `PASSWORD` with your database password
6. Save this connection string!

---

# 🐙 STEP 2: SET UP GIT & GITHUB

## 2.1 Initialize Git Repository

Open terminal/PowerShell in your project root and run:

```bash
git init
git add .
git commit -m "Initial RedEcho deployment setup"
git branch -M main
```

## 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `redecho`
3. Description: "Anonymous storytelling and advice platform"
4. **Public** (so Render and Vercel can access it)
5. Click **"Create repository"**

## 2.3 Push to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/redecho.git
git push -u origin main
```

---

# 🚀 STEP 3: DEPLOY BACKEND (RENDER)

## 3.1 Go to Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**

## 3.2 Connect GitHub Repository

1. Select **"GitHub"** as source
2. Search for **"redecho"**
3. Click **"Connect"**

## 3.3 Configure Web Service

| Setting | Value |
|---------|-------|
| **Name** | `redecho-backend` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

## 3.4 Add Environment Variables

Click **"Environment"** (or scroll down) and add:

| Key | Value |
|-----|-------|
| **MONGODB_URI** | `mongodb+srv://redecho:PASSWORD@cluster0.xxxxx.mongodb.net/redecho?retryWrites=true&w=majority` |
| **PORT** | `10000` |
| **NODE_ENV** | `production` |

Replace `mongodb+srv://...` with your actual MongoDB connection string.

## 3.5 Deploy

1. Select **"Free"** plan
2. Click **"Create Web Service"**
3. Wait for deployment (5-10 minutes)

**Save your URL**: It will look like `https://redecho-backend.onrender.com`

---

# ⚡ STEP 4: UPDATE FRONTEND & DEPLOY (VERCEL)

## 4.1 Update Frontend Environment

Before deploying, update `client/.env.production` (or add if doesn't exist):

```env
VITE_API_URL=https://redecho-backend.onrender.com/api
```

(Replace with your actual Render URL)

## 4.2 Push Changes to GitHub

```bash
git add .
git commit -m "Update API URL for production"
git push
```

## 4.3 Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"redecho"** repository
5. Click **"Import"**

## 4.4 Configure Vercel

In **"Configure Project"** section:

| Setting | Value |
|---------|-------|
| **Framework** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

## 4.5 Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| **VITE_API_URL** | `https://redecho-backend.onrender.com/api` |

(Replace with your actual Render backend URL)

## 4.6 Deploy

Click **"Deploy"** and wait for build to complete.

**Save your URL**: It will look like `https://redecho.vercel.app`

---

# ✅ STEP 5: TEST EVERYTHING

## 5.1 Test Frontend

1. Open your Vercel URL: `https://redecho.vercel.app`
2. You should see RedEcho homepage
3. You get an anonymous username automatically

## 5.2 Test Backend Connectivity

Create a test story:
1. Type a story in the form
2. Click "Post Story"
3. Check if it appears in the feed

## 5.3 Test API Directly

Open browser console and run:

```javascript
fetch('https://redecho-backend.onrender.com/api/stories')
  .then(r => r.json())
  .then(data => console.log(data))
```

You should see an array of stories.

## 5.4 Test Full Features

- ✅ Create story
- ✅ View stories in feed
- ✅ Click story to view details
- ✅ React with emojis
- ✅ Post comments
- ✅ Data persists (refresh page)

---

# 🔧 TROUBLESHOOTING

## Backend Not Connecting

**Error**: "Failed to load stories"

**Solutions**:
1. Verify `MONGODB_URI` is correct in Render environment variables
2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Check cluster is active in MongoDB Atlas dashboard
4. Verify backend URL in frontend `.env` is correct

## CORS Errors

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**: 
- Backend should already have `cors()` enabled
- Verify backend `server.js` includes:
  ```javascript
  app.use(cors());
  ```

## Frontend Build Fails

**Error**: VITE_API_URL undefined

**Solution**:
1. Add environment variable in Vercel dashboard
2. Redeploy after changes
3. Each platform requires its own env variable setup

## MongoDB Connection Timeout

**Error**: "MongooseServerSelectionError"

**Solutions**:
1. Check network access in MongoDB Atlas allows `0.0.0.0/0`
2. Verify connection string has correct password
3. Add `?authSource=admin` to connection string if needed

---

# 📝 FINAL CHECKLIST

- [ ] MongoDB Atlas cluster created and running
- [ ] Database user created with correct password
- [ ] Connection string saved and tested
- [ ] GitHub repository created and code pushed
- [ ] Render backend deployed and running
- [ ] Backend URL saved
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL saved
- [ ] Test story creation works
- [ ] Test reactions and comments work
- [ ] Data persists in MongoDB

---

# 🌐 YOUR LIVE DEPLOYMENT

Once everything works:

**Frontend**: https://redecho.vercel.app  
**Backend API**: https://redecho-backend.onrender.com/api  
**Database**: MongoDB Atlas (free tier)

---

# 💬 TIPS

1. **Render free tier** sleeps after 15 minutes of inactivity. First request may take 30 seconds.
2. **MongoDB Atlas** free tier has 512MB storage limit
3. **Vercel** auto-deploys when you push to GitHub
4. **Always** keep MongoDB credentials secure - never commit `.env` files
5. Use `.gitignore` to prevent committing sensitive files

---

# 🆘 Need Help?

- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- MongoDB docs: https://docs.mongodb.com/
- React docs: https://react.dev

---

**🎉 Congratulations! RedEcho is now live on the internet!**
