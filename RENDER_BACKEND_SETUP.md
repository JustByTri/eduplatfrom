# Render Backend Deployment Instructions

## Create Backend Service on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/

2. **Create New Web Service**:
   - Repository: `JustByTri/eduplatfrom`
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**:
```bash
NODE_ENV=production
PORT=10000
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=35xfiRqbFeSqLKX.root
DB_PASSWORD=c20WsLI7bmFGtGc9
DB_NAME=SpeakAI
JWT_SECRET=39c8ab3a02094d347b62353f83698770
CORS_ORIGIN=https://eduplatfrom.onrender.com
```

4. **Service Name**: `eduplatfrom-backend`

5. **Deploy** and wait for completion

## Test Endpoints
- Health: `https://eduplatfrom-backend.onrender.com/health`
- Admin Login: `https://eduplatfrom-backend.onrender.com/api/admin/login`
