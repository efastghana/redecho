# 🚀 Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] No console errors or warnings
- [ ] All imports working
- [ ] `.env` files added to `.gitignore`
- [ ] No hardcoded URLs or passwords
- [ ] Comments added where needed
- [ ] Code is readable and formatted

### Testing
- [ ] Create story works
- [ ] View story works
- [ ] React with emojis works
- [ ] Post comments works  
- [ ] Data persists (refresh page)
- [ ] Mobile responsive
- [ ] No CORS errors in console
- [ ] API endpoints return correct data

### Git Setup
- [ ] Git repository initialized
- [ ] All files committed
- [ ] Pushed to GitHub
- [ ] Repository is PUBLIC

---

## MongoDB Atlas Setup

### Database
- [ ] Cluster created (free tier - M0)
- [ ] Cluster is running
- [ ] Region selected (closest to you)

### Authentication
- [ ] Database user created (username: `redecho`)
- [ ] Secure password generated
- [ ] Password saved securely

### Network
- [ ] IP whitelist includes `0.0.0.0/0`
- [ ] Connection string copied
- [ ] Password added to connection string

### Testing
- [ ] Connection string works locally
- [ ] MongoDB Compass can connect (optional)
- [ ] Database appears in Atlas dashboard

---

## Backend Deployment (Render)

### Configuration
- [ ] Root directory set to: `server`
- [ ] Runtime set to: `Node`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### Environment Variables
- [ ] `MONGODB_URI` added with correct connection string
- [ ] `PORT` set to `10000`
- [ ] `NODE_ENV` set to `production`

### Deployment
- [ ] Initial deployment completed
- [ ] Backend URL saved and tested
- [ ] API health check works: `https://backend-url/api/health`
- [ ] Logs show "MongoDB connected"

---

## Frontend Deployment (Vercel)

### Configuration
- [ ] GitHub account authorized
- [ ] Repository connected
- [ ] Root directory set to: `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` set to backend URL
- [ ] URL format: `https://redecho-backend.onrender.com/api`
- [ ] Environment set to: Production

### Deployment  
- [ ] Build successful
- [ ] Frontend URL saved
- [ ] Website loads without 404
- [ ] Homepage displays RedEcho title

---

## Integration Testing

### API Connectivity
- [ ] Backend URL in frontend config correct
- [ ] CORS errors fixed
- [ ] API calls reach backend
- [ ] MongoDB connection works

### Features
- [ ] Story form submits successfully
- [ ] Stories appear in feed immediately
- [ ] Reactions update counts
- [ ] Comments save and display
- [ ] Data persists after refresh

### Error Handling
- [ ] Network error messages clear
- [ ] Form validation messages appear
- [ ] Empty/invalid data rejected
- [ ] Spam limit works (1 post per 30 sec)

### Performance
- [ ] Stories load quickly (<3 sec)
- [ ] No UI freezing
- [ ] Reactions respond immediately
- [ ] Comments post without delay

---

## Security Checklist

### Secrets Management
- [ ] `.env` in `.gitignore`
- [ ] No passwords in code
- [ ] No hardcoded URLs
- [ ] Connection strings use environment variables
- [ ] Rendered environment variables not exposed

### API Security
- [ ] CORS properly configured
- [ ] No sensitive data in responses
- [ ] Input validation on backend
- [ ] Profanity filter active
- [ ] Spam prevention working

### Database
- [ ] IP whitelist appropriate
- [ ] Database user password strong
- [ ] No direct MongoDB access from frontend
- [ ] Connection uses auth

---

## Production Readiness

### Monitoring
- [ ] Render logs checked for errors
- [ ] Vercel build logs checked
- [ ] No error spikes in first 24 hours
- [ ] Alert system (optional) configured

### Backups
- [ ] MongoDB backup policy set (auto-backup enabled)
- [ ] Code backed up to GitHub
- [ ] Connection string backed up securely

### Documentation
- [ ] README.md complete
- [ ] DEPLOYMENT.md updated with live URLs
- [ ] ENV_VARIABLES.md configured
- [ ] Troubleshooting guide available

---

## Launch Day

- [ ] All checklists items completed
- [ ] Team notified of live URL
- [ ] Social media links updated (if applicable)
- [ ] Monitoring dashboard open
- [ ] Support plan in place for issues

---

## Post-Launch (First 24 Hours)

- [ ] Monitor errors in real-time
- [ ] Test all features from different devices
- [ ] Check mobile responsiveness
- [ ] Verify data saves correctly
- [ ] No CORS issues reported
- [ ] Backend performance stable
- [ ] Database writes successful

---

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Page Load | < 3 sec | _____ |
| Story Post | < 2 sec | _____ |
| API Response | < 1 sec | _____ |
| DB Query | < 500 ms | _____ |

---

## Success Criteria

✅ All checklist items complete  
✅ Frontend loads without errors  
✅ Backend API responds correctly  
✅ MongoDB stores data  
✅ All features work end-to-end  
✅ No console errors  
✅ Mobile works  
✅ Performance acceptable  

---

**🎉 Deployment Complete! RedEcho is live!**
