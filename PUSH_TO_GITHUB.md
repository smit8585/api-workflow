# 📤 Push to GitHub

Your repo is ready! Just need to push it.

## Your GitHub Repo:
**https://github.com/smit8585/api-workflow**

---

## 🚀 Option 1: Push with HTTPS (Easiest)

```bash
cd /root/.openclaw/workspace-incognito/flowtest

# Push to your repo
git push -u origin main
```

**You'll be prompted for:**
- Username: `smit8585`
- Password: Use a **Personal Access Token** (not your password)

### Get Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "FlowTest Deploy"
4. Select scopes: Check **`repo`**
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use it as the "password" when pushing

---

## 🚀 Option 2: Push with SSH (If you have SSH keys)

```bash
cd /root/.openclaw/workspace-incognito/flowtest

# Change remote to SSH
git remote set-url origin git@github.com:smit8585/api-workflow.git

# Push
git push -u origin main
```

---

## ✅ After Pushing

Once the code is on GitHub, you can:

1. **Deploy to Railway:**
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select `smit8585/api-workflow`
   - Click Deploy
   - Generate domain

2. **Verify on GitHub:**
   - Visit: https://github.com/smit8585/api-workflow
   - You should see all your files

---

## 🔐 Creating GitHub Personal Access Token

### Step-by-step:

1. **Go to GitHub Settings:**
   https://github.com/settings/tokens

2. **Click "Generate new token (classic)"**

3. **Configure:**
   - Note: `FlowTest Deploy`
   - Expiration: 90 days (or custom)
   - Scopes: Check **`repo`** (gives full repo access)

4. **Generate & Copy:**
   - Click "Generate token"
   - **COPY IT NOW** - you won't see it again!

5. **Use it:**
   ```bash
   git push -u origin main
   # Username: smit8585
   # Password: <paste your token here>
   ```

---

## 🐛 Troubleshooting

**"Authentication failed"?**
- Make sure you're using a Personal Access Token, not your password
- Token must have `repo` scope

**"Repository not found"?**
- Verify the repo exists: https://github.com/smit8585/api-workflow
- Check the URL is correct

**"Permission denied"?**
- Make sure the token has `repo` permissions
- Verify you're logged in as smit8585

---

## 📝 Quick Command Summary

```bash
cd /root/.openclaw/workspace-incognito/flowtest
git push -u origin main
# Enter username: smit8585
# Enter password: <your-personal-access-token>
```

---

**Next:** Once pushed, follow `RAILWAY_QUICK_DEPLOY.md` to deploy! 🚀
