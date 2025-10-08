# Deployment Guide - Vercel

## Prerequisites

1. **MongoDB Atlas Account**: Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Vercel Account**: Create a free account at [Vercel](https://vercel.com/)

## Backend Deployment

### 1. Deploy Backend to Vercel

```bash
cd backend-nodejs
vercel
```

### 2. Set Environment Variables in Vercel

Go to your Vercel dashboard > Project > Settings > Environment Variables and add:

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=techhub_upe_prod
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
SESSION_SECRET=your-super-strong-production-secret-key-here
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
AUTH_SERVICE_URL=https://demobackend.emergentagent.com
```

### 3. Populate Database

After deployment, run the population script:

```bash
vercel env pull
node scripts/populate_nodejs.js
```

## Frontend Deployment

### 1. Update Backend URL

Update the backend URL in your frontend environment variables.

### 2. Deploy Frontend to Vercel

```bash
cd frontend
vercel
```

### 3. Set Environment Variables

```
REACT_APP_BACKEND_URL=https://your-backend-app.vercel.app
REACT_APP_NODE_ENV=production
```

## Post-Deployment

1. Test all API endpoints
2. Verify authentication flow
3. Test file uploads
4. Check database connectivity

## Notes

- File uploads will be stored in Vercel's temporary filesystem
- For persistent file storage, consider using AWS S3 or similar
- MongoDB Atlas provides 512MB free tier
- Both apps can be deployed separately or as a monorepo
