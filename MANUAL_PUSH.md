# 📤 Manual Push Instructions

The deploy key might need a few minutes to activate, or we can use a Personal Access Token instead.

---

## 🚀 Quick Push with Personal Access Token

### Step 1: Create Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Settings:
   - Note: `FlowTest`
   - Expiration: 90 days
   - Scopes: Check **`repo`**
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push Code
```bash
cd /root/.openclaw/workspace-incognito/flowtest
git push -u origin main
```

When prompted:
- Username: `smit8585`
- Password: `<paste your token here>`

---

## ✅ After Pushing

Verify at: https://github.com/smit8585/api-workflow

Then deploy to Railway! 🚀

---

## 🔄 Or Wait for Deploy Key

Sometimes GitHub deploy keys take a few minutes to activate. You can try:

```bash
cd /root/.openclaw/workspace-incognito/flowtest
GIT_SSH_COMMAND="ssh -i /root/.ssh/flowtest_deploy" git push -u origin main
```

If it still fails, use the Personal Access Token method above.
