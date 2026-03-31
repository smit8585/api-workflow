# ⚡ Railway Quick Deploy (5 Minutes)

## 🎯 Goal
Get FlowTest live on the internet in 5 minutes.

---

## 📝 Step-by-Step

### 1️⃣ Create GitHub Repo (2 min)

```bash
# Go to: https://github.com/new
# - Repository name: flowtest
# - Keep Public or Private
# - DON'T initialize with README
# - Click "Create repository"
```

### 2️⃣ Push Code (1 min)

```bash
cd /root/.openclaw/workspace-incognito/flowtest

# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/flowtest.git

git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

### 3️⃣ Deploy on Railway (2 min)

1. **Go to:** https://railway.app
2. **Sign in** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **flowtest** repository
6. Click **"Deploy Now"**

Railway will automatically:
- ✅ Detect it's a Node.js app
- ✅ Install dependencies
- ✅ Build frontend
- ✅ Start backend
- ✅ Give you a URL

### 4️⃣ Add Environment Variable (30 sec)

1. Click on your **deployment**
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add:
   ```
   Key: NODE_ENV
   Value: production
   ```
5. Click **"Add"**

### 5️⃣ Generate Public URL (30 sec)

1. Click **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy your URL: `https://flowtest-xxxx.railway.app`

---

## ✅ Done!

Your app is now live! 🎉

**Open the URL** and start testing APIs!

---

## 🔥 That's it!

Total time: **~5 minutes**
Cost: **$0 (Free tier)**

---

## 📱 Share Your App

Send this to anyone:
```
Check out FlowTest: https://your-url.railway.app
```

---

## 🛠️ Troubleshooting

**Build failed?**
- Check Railway logs (click "Deployments" → latest deploy)
- Make sure all files were pushed to GitHub

**App not loading?**
- Wait 30 seconds after first deploy
- Check if `NODE_ENV=production` variable was added
- View logs in Railway dashboard

**Need to redeploy?**
```bash
# Make any change
git add .
git commit -m "Update"
git push
# Railway auto-deploys!
```

---

**Questions? Check DEPLOYMENT.md for full guide.**
