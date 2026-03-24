# 🆘 RedEcho Deployment - Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ Frontend Issues

### 1. "Failed to load stories"

**Cause**: Frontend can't reach backend

**Solutions**:
```bash
# Check API URL in client/.env
cat client/.env
# Should show correct backend URL

# Test backend directly
curl https://your-backend.onrender.com/api/health

# Check browser console (F12)
# Look for network errors to backend URL
```

**Steps**:
1. Verify backend URL in `client/.env`
2. Verify Render deployment completed
3. Wait 30-60 seconds for cold start
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh (Ctrl+F5)

---

### 2. Blank Page / 404

**Cause**: Vercel not deploying correct folder

**Solutions**:
1. Go to Vercel Project Settings
2. Check "Root Directory" is set to `client`
3. Redeploy project
4. Check build console for errors

**If still failing**:
```bash
# Test build locally
cd client
npm run build

# Check if dist/ folder created
ls dist/
```

---

### 3. CORS Error in Console

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Cause**: Backend CORS not configured

**Solutions**:
1. Open `server/server.js`
2. Verify this line exists:
   ```javascript
   app.use(cors());
   ```
3. Restart backend / redeploy to Render

**If still failing**:
```javascript
// Add explicit CORS config
app.use(cors({
  origin: 'https://your-vercel-url.vercel.app',
  credentials: true
}));
```

---

### 4. Environment Variable Not Loading

**Cause**: Wrong variable name or not set

**Solutions**:
1. Vercel: Project Settings → Environment Variables
2. Check variable name: `VITE_API_URL` (exact case)
3. Vercel: Redeploy after changing env vars
4. Check value doesn't have quotes: ✅ `https://...` ❌ `"https://..."`

---

## ❌ Backend Issues

### 1. "MongoDB connection error"

**Error**: `MongooseServerSelectionError`

**Cause**: Can't connect to MongoDB

**Solutions**:

**Check connection string**:
```bash
# Should be in Render Environment Variables
# Format: mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/redecho?...
```

**For local development**:
```bash
# Make sure MongoDB running
cd Render logs → check if connection fails
```

**Check MongoDB Atlas**:
1. Go to https://cloud.mongodb.com
2. Clusters → Check status
3. Network Access → Whitelist `0.0.0.0/0`
4. Database Users → Verify user exists
5. Re-test connection string

---

### 2. "Port already in use" (Local)

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find what's using port 5000
# Windows
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <processid> /F

# Or use different port
PORT=3001 npm start
```

---

### 3. Stories Not Saving

**Cause**: MongoDB connection or schema issue

**Troubleshoot**:
```bash
# Check MongoDB connection in logs
# You should see: "✓ MongoDB connected"

# Test API locally
curl http://localhost:5000/api/health

# Check database exists in MongoDB Atlas
```

**If symptoms persist**:
1. Check `MONGODB_URI` env variable
2. Verify database user has correct permissions
3. Check cluster is active (not paused)
4. Try connecting with MongoDB Compass

---

### 4. API Returns 500 Errors

**Cause**: Server exception

**Solutions**:
1. Check Render logs for error message
2. Look for schema validation errors
3. Check input data format (POST body)
4. Verify all required fields present

**Test endpoint**:
```bash
curl -X GET https://your-backend.onrender.com/api/stories
# Should return JSON array

curl -X POST https://your-backend.onrender.com/api/health
# Should return {"status":"Server is running"}
```

---

## ⚠️ Render Issues

### 1. "Build failed"

**Check**:
1. Go to Render.com → Deployments
2. Click latest deployment
3. Read Error logs carefully
4. Usually missing `npm` command or wrong Node version

**Solutions**:
```bash
# Locally test build
cd server
npm install
npm start

# Check package.json "start" script exists
```

---

### 2. "Deploy pending" / Stuck

**Solutions**:
1. Click "Manual Deploy"
2. If still stuck, delete and recreate service
3. Check Render status page for outages

---

### 3. Slow Response (>30 seconds)

**Cause**: Free tier Render service sleeping

**Solutions**:
1. This is normal on first request
2. Render suspends services after 15 min inactivity
3. Keep-alive solution: Use monitoring service (free: https://uptimerobot.com)

---

## ⚠️ Vercel Issues

### 1. "Build failed"

**Solutions**:
1. Go to Vercel → Deployments
2. Click deployment → Logs
3. Read error (usually dependency issue)
4. Check `client/package.json` has all deps

**Common fix**:
```bash
cd client
npm install
npm run build  # Test locally
```

---

### 2. "Environment variable missing"

**Cause**: Variable not set in Vercel

**Solutions**:
1. Go to Project Settings → Environment Variables
2. Add exactly: `VITE_API_URL`
3. Value: `https://redecho-backend.onrender.com/api`
4. Redeploy

---

### 3. Still Showing Old Version

**Solutions**:
1. Hard refresh: `Ctrl+Shift+Delete` (clear cache)
2. Then `Ctrl+F5` (refresh)
3. Or use incognito window (Ctrl+Shift+N)
4. Wait 60 seconds for CDN to update

---

## ⚠️ MongoDB Atlas Issues

### 1. "IP not whitelisted"

**Error**: Connection times out

**Solutions**:
1. Go to Network Access
2. Add: `0.0.0.0/0` (Allow from anywhere)
3. Confirm

---

### 2. "Authentication failed"

**Cause**: Wrong password or user doesn't exist

**Solutions**:
1. Go to Database Access
2. View/reset user password
3. Copy connection string
4. Replace `<password>` placeholder
5. Update Render env variable

---

### 3. Free Tier Storage Limit Hit (512MB)

**Solutions**:
1. Delete old test data
2. Clean up duplicate stories
3. Or upgrade to paid tier ($10+/month)

---

## 🔧 Testing Tools

### Test Backend API

```bash
# Using curl
curl https://your-backend.onrender.com/api/health
curl https://your-backend.onrender.com/api/stories

# Using browser console (Ctrl+J or F12 → Console)
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Check Monitoring Tools

- **Render Logs**: https://render.com → your service → Logs
- **Vercel Logs**: https://vercel.com → project → Deployments → Logs
- **MongoDB Monitoring**: https://cloud.mongodb.com → your cluster → Monitoring
- **Browser DevTools**: F12 → Network, Console tabs

---

## 🎯 Systematic Troubleshooting

Follow this order:

```
1. Check URLs are correct
   ↓
2. Test backend API directly (curl/Postman)
   ↓
3. Check database connection (MongoDB Atlas)
   ↓
4. Check environment variables in Render/Vercel
   ↓
5. Check browser console (F12) for errors
   ↓
6. Check application logs
   ↓
7. Hard refresh browser cache
   ↓
8. Wait for deployment/DNS to propagate
   ↓
9. Restart services / redeploy
```

---

## 📞 Getting Help

### Check These First
- [ ] DEPLOYMENT.md (main guide)
- [ ] Render Logs (https://render.com)
- [ ] Vercel Logs (https://vercel.com)
- [ ] MongoDB Atlas Alerts
- [ ] Browser Console (F12)
- [ ] Network Tab (F12 → Network)

### Resources
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com/
- React Docs: https://react.dev
- Express Docs: https://expressjs.com

---

## 🚨 Emergency Restart

If everything broken:

```bash
# 1. Restart backend
# Render → Services → Your Service → Manual Deploy

# 2. Restart frontend
# Vercel → Projects → Your Project → Deployments → Redeploy

# 3. Restart database
# MongoDB Atlas → Clusters → Your Cluster → ⋮ → Restart

# 4. Clear everything local
cd client && npm run build
cd ../server && npm install
```

---

**Still stuck? Review DEPLOYMENT.md step-by-step again!**
