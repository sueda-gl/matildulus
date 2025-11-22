# 🚂 Railway Deployment - Step by Step

## ✅ Pre-Deployment Status

✅ Code pushed to GitHub: `https://github.com/sueda-gl/matildulus.git`  
✅ All files ready  
✅ Railway config added  

---

## 🚀 Deploy to Railway NOW (5 minutes)

### Step 1: Sign Up / Log In to Railway

1. Go to **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Choose **"Login with GitHub"** 
4. Authorize Railway to access your GitHub account

### Step 2: Create New Project

1. In Railway dashboard, click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your repositories
4. Find and select **`sueda-gl/matildulus`** (or search for "matildulus")

### Step 3: Configure Deployment (Auto-detected!)

Railway will automatically detect:
- ✅ Node.js project
- ✅ Build command: `npm install`
- ✅ Start command: `npm start` (from your package.json)
- ✅ Port: Auto-assigned (your server.js uses `process.env.PORT`)

**You don't need to change anything!** Just wait for it to deploy.

### Step 4: Wait for Deployment (~2-3 minutes)

Railway will:
1. Install dependencies (`npm install`)
2. Build your project
3. Start your server
4. Assign a public URL

Watch the logs in the Railway dashboard - you'll see:
```
🦎 Server running on port XXXX
🌿 Message wall ready for collaboration!
```

### Step 5: Get Your Live URL

1. Once deployment is complete, click on your project
2. Click on the **service** (the deployed app)
3. You'll see a **"Public Domain"** section
4. Railway will generate a URL like: `matildulus-production.up.railway.app`
5. **Click the URL** or copy it

**🎉 YOUR SITE IS NOW LIVE!**

---

## 🧪 Test Your Deployment

1. **Visit your Railway URL** (e.g., `matildulus-production.up.railway.app`)
2. **Check basic functionality:**
   - ✅ Website loads
   - ✅ Images display
   - ✅ Animations work

3. **Test Message Wall:**
   - ✅ Click "🎨 JOIN THE MESSAGE PARTY"
   - ✅ Enter a name
   - ✅ Draw on canvas
   - ✅ Open in another tab/browser - should sync in real-time!

---

## 🔧 Configuration (Optional)

### Change Project Name
1. Click on your project in Railway
2. Click the three dots menu → "Settings"
3. Change the project name if you want

### Add Custom Domain
1. Go to your service in Railway
2. Click "Settings" → "Networking"
3. Click "Custom Domain"
4. Add your domain (requires DNS configuration)

### Environment Variables (Not Needed Now)
Your app doesn't need any environment variables - PORT is auto-detected. If you add any later:
1. Go to your service → "Variables" tab
2. Add key-value pairs

---

## 📊 Monitor Your App

### View Logs
- Click on your service → "Deployments" tab
- Click on any deployment → View logs
- Real-time logs available

### View Metrics
- Click on your service → See CPU, Memory usage
- Free tier: 500 hours/month, $5 credit

---

## 🆘 Troubleshooting

### Deployment Fails
**Check logs:**
1. Click on your service
2. Click on the failed deployment
3. View logs for errors

**Common issues:**
- **Port binding error**: Your code already handles this with `process.env.PORT` ✅
- **Build fails**: Check that all dependencies are in `package.json` ✅
- **Module not found**: Ensure `node_modules` is in `.gitignore` ✅

### Socket.io Doesn't Connect
- ✅ Your code already handles production URLs correctly
- Check browser console for errors
- Verify Railway URL is correct

### Images Don't Load
- Verify all image files are in your GitHub repository
- Check file paths in `index.html`

---

## 🎯 Quick Reference

**Your GitHub Repo:** https://github.com/sueda-gl/matildulus  
**Railway Dashboard:** https://railway.app/dashboard  
**Start Command:** `npm start` (runs `node server.js`)  
**Port:** Auto-assigned by Railway

---

## ✅ Deployment Checklist

- [ ] Signed up for Railway
- [ ] Connected GitHub account
- [ ] Created new project from GitHub repo
- [ ] Selected `sueda-gl/matildulus` repository
- [ ] Waited for deployment to complete
- [ ] Got public URL from Railway
- [ ] Tested website loads
- [ ] Tested message wall works
- [ ] Shared URL with friends! 🎉

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live website URL
- ✅ Real-time message wall working
- ✅ Automatic deployments on every git push
- ✅ Free hosting (500 hours/month)

**Your site will automatically redeploy every time you push to GitHub!**

---

**Need help?** Check the logs in Railway dashboard or see `DEPLOYMENT_GUIDE.md` for more details.

