# 🚀 FlowTest Deployment Guide

## Deploy to Railway (Recommended)

Railway is the easiest way to deploy FlowTest. It's free and takes ~10 minutes.

### Prerequisites
- GitHub account
- Railway account (free) - https://railway.app

---

## 📋 Step-by-Step Deployment

### Step 1: Push to GitHub

1. **Create a new GitHub repository:**
   - Go to https://github.com/new
   - Name: `flowtest` (or whatever you prefer)
   - Keep it Public or Private
   - **Don't** initialize with README (we already have files)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   cd /root/.openclaw/workspace-incognito/flowtest
   
   # Add GitHub remote (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/flowtest.git
   
   # Push code
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. **Go to Railway:**
   - Visit https://railway.app
   - Click "Login" and sign in with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `flowtest` repository
   - Click "Deploy Now"

3. **Configure Environment:**
   - Railway will auto-detect Node.js
   - Click on your deployment
   - Go to "Variables" tab
   - Add environment variable:
     ```
     NODE_ENV=production
     ```

4. **Wait for Deployment:**
   - Railway will automatically:
     - Install dependencies
     - Build the frontend
     - Start the backend
   - This takes 3-5 minutes

5. **Get Your Public URL:**
   - Click "Settings" tab
   - Click "Generate Domain"
   - Your app will be live at: `https://your-app-name.railway.app`

---

## ✅ Verify Deployment

Once deployed, test your app:

1. **Open the URL** in your browser
2. **Create a test workflow:**
   - Add HTTP Request node
   - URL: `https://jsonplaceholder.typicode.com/users/1`
   - Click Save → Execute
3. **Check results** - Should see user data

---

## 🔧 Alternative: Deploy to Render

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Render

1. **Go to Render:**
   - Visit https://render.com
   - Sign up/login with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name:** flowtest
     - **Environment:** Node
     - **Build Command:** `npm run build`
     - **Start Command:** `cd backend && NODE_ENV=production node server.js`
     - **Plan:** Free

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deploy
   - Your app will be live at: `https://flowtest.onrender.com`

⚠️ **Note:** Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

---

## 🖥️ Alternative: Deploy to VPS (Advanced)

### Requirements
- VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name (optional)
- SSH access

### Quick Setup

```bash
# 1. SSH into your VPS
ssh user@your-server-ip

# 2. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Clone your repo
git clone https://github.com/YOUR_USERNAME/flowtest.git
cd flowtest

# 5. Install dependencies & build
npm install
cd frontend && npm install && npm run build && cd ..
cd backend && npm install && cd ..

# 6. Start with PM2
cd backend
NODE_ENV=production pm2 start server.js --name flowtest

# 7. Setup PM2 to start on reboot
pm2 startup
pm2 save

# 8. Install Nginx (reverse proxy)
sudo apt-get install nginx

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/flowtest
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/flowtest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt (optional)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 Production Checklist

Before sharing your public URL, consider:

- [ ] Set up proper CORS origins (currently allows all)
- [ ] Add rate limiting to prevent abuse
- [ ] Set up database backups
- [ ] Add authentication (if needed)
- [ ] Monitor usage and errors
- [ ] Set up health checks
- [ ] Configure logging

---

## 🐛 Troubleshooting

### "Cannot GET /"
- Check if `NODE_ENV=production` is set
- Verify frontend build completed: check `frontend/dist/` exists

### "500 Internal Server Error"
- Check logs: `railway logs` or check Render dashboard
- Verify all dependencies installed
- Check database file permissions

### Database not persisting
- **Railway:** Add a volume for persistent storage
- **Render:** Use persistent disk (paid feature)
- **VPS:** Database file is already persistent

### Frontend 404 errors
- Ensure Vite build completed successfully
- Check `frontend/dist/` has files
- Verify static file serving in `server.js`

---

## 📊 Monitoring Your App

**Railway:**
- Built-in metrics dashboard
- Real-time logs
- Resource usage graphs

**Render:**
- Metrics tab in dashboard
- Log streams
- Health checks

**VPS:**
```bash
# View PM2 status
pm2 status

# View logs
pm2 logs flowtest

# Monitor resources
pm2 monit
```

---

## 🔄 Updating Your Deployment

### Railway/Render (Auto-deploy)
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Railway/Render will auto-deploy
```

### VPS (Manual)
```bash
# SSH into server
cd flowtest
git pull
npm run build
pm2 restart flowtest
```

---

## 💰 Cost Estimates

**Railway Free Tier:**
- 500 hours/month
- $5/month for more resources

**Render Free Tier:**
- Free forever
- Sleeps after 15 min inactivity
- 750 hours/month

**VPS (DigitalOcean):**
- Basic Droplet: $6/month
- + Domain: $10-15/year
- Full control, always on

---

## 🎉 You're Live!

Once deployed, share your URL:
```
https://your-app-name.railway.app
```

**Next Steps:**
1. Test all features
2. Share with your team
3. Monitor usage
4. Collect feedback
5. Iterate!

---

**Need help?** Check the logs first, then review the troubleshooting section above.

**Happy deploying! 🚀**
