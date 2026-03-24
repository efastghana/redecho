# RedEcho - Environment Variables Guide

## Backend Environment Variables

### Local Development (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/redecho
NODE_ENV=development
```

### Production (Render) (`server/.env.production`)
```env
PORT=10000
MONGODB_URI=mongodb+srv://redecho:PASSWORD@cluster0.xxxxx.mongodb.net/redecho?retryWrites=true&w=majority
NODE_ENV=production
```

**Note**: Never commit `.env` files. Add to `.gitignore`.

## Frontend Environment Variables

### Local Development (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Production (Vercel) (`client/.env.production`)
```env
VITE_API_URL=https://redecho-backend.onrender.com/api
```

Replace `https://redecho-backend.onrender.com` with your actual Render backend URL.

## MongoDB Atlas Connection String

Format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://redecho:MySecurePassword123@cluster0.abc123.mongodb.net/redecho?retryWrites=true&w=majority
```

### How to Get Your Connection String:

1. Go to MongoDB Atlas Dashboard
2. Click "Clusters" → "Connect"
3. Select "Drivers" tab
4. Choose "Node.js"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add to Render environment variables

## Setting Up Environment Variables

### In Render

1. Go to your Web Service → "Environment"
2. Add each variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://redecho:password@cluster...`
3. Click "Save Changes"
4. Redeploy

### In Vercel

1. Go to Project Settings → "Environment Variables"
2. Add variables:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
3. Select which environments (Production, Preview, Development)
4. Redeploy

## Important Notes

⚠️ **Security**:
- Never commit `.env` files
- Never share passwords publicly
- Use strong database passwords
- Rotate credentials regularly

✅ **Best Practices**:
- Keep `.env.example` with dummy values
- Document required variables
- Use different passwords for dev/prod
- Enable 2FA on cloud platforms

