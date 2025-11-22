# 🦎 Collaborative Message Wall Game - Setup Instructions

## 🎮 What is this?

An interactive, real-time collaborative drawing game where party guests can leave messages on sticky notes by drawing and typing together!

---

## 🚀 Quick Start (Local Testing)

### Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install:
- express (web server)
- socket.io (real-time communication)
- cors (cross-origin support)

### Step 2: Start the Server

```bash
npm start
```

You should see:
```
🦎 Server running on port 3000
🌿 Message wall ready for collaboration!
```

### Step 3: Open in Browser

Go to: `http://localhost:3000`

Scroll down to "Messages from the Squad" section and click **"🎨 JOIN THE MESSAGE PARTY"**

### Step 4: Test with Multiple Users

Open the same URL in multiple browser tabs or on different devices (same WiFi network):
- Use `http://YOUR_IP_ADDRESS:3000` on other devices
- Each person enters their name
- Everyone can draw together in real-time!

---

## 🌐 Deploy to Vercel (Free!)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

Follow the prompts:
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → `matildulus` (or any name)
- Directory? → `./` (just press Enter)
- Override settings? → **No**

4. **Your site is live!** 🎉

Vercel will give you a URL like: `https://matildulus-xyz123.vercel.app`

### Option 2: Deploy via Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New" → "Project"
4. Import your project (or drag & drop the folder)
5. Vercel will auto-detect settings
6. Click "Deploy"
7. Done! 🚀

---

## 🎯 How to Use the Game

### For Party Guests:

1. **Join:** Click the join button and enter your name
2. **Choose a Note:** Click any colored sticky note
3. **Draw or Type:**
   - Click "✏️ Draw" and drag to draw
   - Click "📝 Text" and click where you want to type
4. **See Others:** Watch other guests' cursors move in real-time
5. **Save:** Click "💾 Save Wall" to download the final masterpiece

### Party Tips:

- Works great on phones and tablets!
- Up to 20-30 people can collaborate comfortably
- Each person gets a unique color cursor
- Everyone can see each other drawing live
- Perfect for screenshots during the party!

---

## ⚙️ Configuration

### Change Server Port

Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your port
```

### Customize Colors

Edit `server.js` to change user cursor colors:
```javascript
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', // Add more colors here
];
```

### Adjust Number of Sticky Notes

Current: 5 notes (note-0 to note-4)

To add more, edit `server.js`:
```javascript
let notesData = {
  'note-0': { drawings: [], texts: [] },
  'note-1': { drawings: [], texts: [] },
  'note-2': { drawings: [], texts: [] },
  'note-3': { drawings: [], texts: [] },
  'note-4': { drawings: [], texts: [] },
  'note-5': { drawings: [], texts: [] }, // Add more
};
```

And add corresponding HTML sticky notes in `index.html`.

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
Run: `npm install`

### Connection fails on deployed site
Check that:
- `vercel.json` is properly configured
- Socket.io routes are set up correctly
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Drawings don't sync
- Check browser console for errors (F12)
- Ensure server is running
- Try refreshing the page

### Mobile touch not working
- Ensure you're clicking within the canvas area
- Try the enlarged note view (click on note first)

---

## 📝 Features Overview

✅ Real-time collaboration  
✅ Multiple users can draw simultaneously  
✅ See other users' cursors with names  
✅ Drawing tool (pen)  
✅ Text tool  
✅ Save entire wall as image  
✅ Mobile-friendly touch support  
✅ Works on all modern browsers  
✅ No database needed (in-memory storage)  
✅ Retro aesthetic matches the website  

---

## 🎨 Technical Details

**Frontend:**
- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for drawing
- Socket.io client for real-time sync
- html2canvas for image export

**Backend:**
- Node.js + Express
- Socket.io server
- In-memory data storage
- CORS enabled for cross-origin requests

**Deployment:**
- Vercel serverless functions
- WebSocket with polling fallback
- Automatic HTTPS

---

## 💡 Tips for the Party

1. **Test Before:** Run it locally first to make sure everything works
2. **Share the Link:** Send the Vercel URL to all guests before the party
3. **Instructions:** Maybe put up a screen showing how to join
4. **Screenshots:** Take screenshots throughout the party!
5. **Download:** Save the final wall at the end as a keepsake

---

## 🦎 Credits

Built with 💚 for Matildulus Zambiasulus's graduation party!

Enjoy the celebration! 🎉🌿

---

## 📞 Need Help?

If something doesn't work:
1. Check the browser console (F12) for errors
2. Check the server terminal for errors
3. Make sure `npm install` was successful
4. Try restarting the server
5. Test in a different browser

**Common Issues:**
- Port already in use? → Change PORT in server.js
- Can't connect? → Check firewall settings
- Slow? → Reduce number of users or drawings

Have fun! 🦎✨

