# 🚀 Deployment Guide for Matildulus Zambiasulus Website

## ⚠️ Important: Socket.io Compatibility

**Your app uses Socket.io for real-time collaboration on the message wall.** This requires persistent WebSocket connections, which means:

- ❌ **Vercel** - Won't work properly (serverless functions can't maintain persistent connections)
- ✅ **Recommended platforms** - Railway, Render, Heroku, DigitalOcean App Platform

---

## ✅ Pre-Deployment Checklist

### 1. Required Files
- ✅ `package.json` - Dependencies defined
- ✅ `server.js` - Express server with Socket.io
- ✅ `index.html` - Main page
- ✅ `styles.css` - Styling
- ✅ `script.js` - Frontend interactivity
- ✅ `game.js` - Message wall game logic
- ✅ `.gitignore` - Configured properly
- ✅ All image/video assets in root directory

### 2. Dependencies
All required packages are in `package.json`:
- express
- socket.io
- cors

### 3. Node.js Version
Your `package.json` specifies Node.js >=18.x. Ensure your hosting platform supports this.

---

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest for Socket.io)

**Why Railway?**
- ✅ Supports WebSocket connections (Socket.io works perfectly)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Simple setup

**Steps:**
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign up
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js and deploy
6. The `PORT` environment variable is automatically set
7. Your site will be live with a railway.app domain
8. (Optional) Add custom domain in settings

**No code changes needed!**

---

### Option 2: Render

**Why Render?**
- ✅ Free tier with WebSocket support
- ✅ Automatic SSL
- ✅ Easy setup

**Steps:**
1. Push code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** matildulus-website
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Click "Create Web Service"
7. Render will deploy automatically

**No code changes needed!**

---

### Option 3: Heroku

**Why Heroku?**
- ✅ Reliable WebSocket support
- ✅ Free tier (limited hours, may require credit card)

**Steps:**
1. Install Heroku CLI: `brew install heroku/brew/heroku` (Mac)
2. Login: `heroku login`
3. Create app: `heroku create matildulus-website`
4. Deploy: `git push heroku main`
5. Open: `heroku open`

**No code changes needed!**

---

### Option 4: DigitalOcean App Platform

**Why DigitalOcean?**
- ✅ Full WebSocket support
- ✅ Paid but affordable ($5/month)

**Steps:**
1. Push code to GitHub
2. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
3. Create new App → Connect GitHub repo
4. Select your repository
5. Configure:
   - Build command: `npm install`
   - Run command: `npm start`
6. Deploy

---

### Option 5: Traditional VPS (Full Control)

If you have a VPS (DigitalOcean Droplet, AWS EC2, etc.):

**Steps:**
1. SSH into your server
2. Install Node.js 18+: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
3. Clone repository: `git clone <your-repo-url> && cd matildulus`
4. Install dependencies: `npm install`
5. Install PM2 (process manager): `npm install -g pm2`
6. Start server: `pm2 start server.js --name matildulus`
7. Setup nginx reverse proxy (optional but recommended)
8. Configure firewall to allow port 3000 (or your PORT)

---

## 🔧 Environment Variables

Currently, your app doesn't require any environment variables. The `PORT` is automatically detected by hosting platforms.

If you want to set a custom port:
- Add `.env` file with: `PORT=3000`
- Update `.gitignore` to include `.env` (already done)

---

## 📦 What to Include in Deployment

Make sure all these files are in your repository:
- ✅ All `.html`, `.js`, `.css` files
- ✅ All image files (`.jpeg`, `.jpg`, `.png`)
- ✅ All video files (`.mp4`)
- ✅ `package.json` and `package-lock.json`
- ✅ `.gitignore`
- ❌ `node_modules/` (will be installed by platform)
- ❌ `.vercel/` folder (if exists)

---

## 🧪 Testing After Deployment

1. **Basic functionality:**
   - [ ] Website loads correctly
   - [ ] All images display
   - [ ] Videos play
   - [ ] Animations work

2. **Message Wall (Socket.io):**
   - [ ] Click "JOIN THE MESSAGE PARTY"
   - [ ] Draw on canvas - should work in real-time
   - [ ] Open in multiple browser tabs - changes should sync
   - [ ] Check that user count updates

3. **Performance:**
   - [ ] Test on mobile device
   - [ ] Check loading speed
   - [ ] Verify all assets load

---

## 🐛 Troubleshooting

### Socket.io Connection Issues
**Problem:** Message wall doesn't connect or shows errors
**Solution:** Make sure you're using Railway, Render, Heroku, or a platform that supports WebSockets (NOT Vercel)

### Images Not Loading
**Problem:** Images show broken links
**Solution:** 
- Check that all image files are in the repository
- Verify file paths in `index.html` match actual filenames
- Ensure filenames don't have special characters that cause issues

### Port Issues
**Problem:** Server won't start
**Solution:** Your code already handles this with `process.env.PORT || 3000`, so most platforms will work automatically

### Build Failures
**Problem:** Deployment fails
**Solution:**
- Check Node.js version (needs 18+)
- Verify `package.json` has all dependencies
- Check build logs on your platform

---

## 📝 Quick Start (Recommended: Railway)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to railway.app
   - Connect GitHub
   - Select repo
   - Done! (Takes ~2 minutes)

3. **Get your URL:**
   - Railway provides a URL like `matildulus-production.up.railway.app`
   - Share this URL to access your site!

---

## 🎉 Post-Deployment

After successful deployment:
- Share your live URL!
- Monitor logs for any errors
- Consider adding a custom domain
- Test the message wall functionality with multiple users

---

## 📞 Need Help?

If deployment fails:
1. Check platform logs/console
2. Verify all files are in repository
3. Ensure Node.js 18+ is selected
4. Make sure platform supports WebSockets

---

**Best Platform for This Project:** Railway or Render (both have free tiers and perfect Socket.io support)

