# ✅ Testing Checklist for Message Wall Game

## Before the Party - Test Everything!

### 🔧 Setup Test
- [ ] Run `npm install` - should complete without errors
- [ ] Run `npm start` - should show "Server running on port 3000"
- [ ] Open http://localhost:3000 - website should load
- [ ] All existing sections work (scroll through the page)

### 🎮 Game Functionality Test

#### Basic Join Test
- [ ] Scroll to "Messages from the Squad" section
- [ ] See "🎨 JOIN THE MESSAGE PARTY" button
- [ ] Click the button
- [ ] Modal appears with name input
- [ ] Enter name (test with: "Test User")
- [ ] Click "Join Party! 🎉"
- [ ] Modal closes
- [ ] See "👥 1 people drawing" status
- [ ] See "💾 Save Wall" button
- [ ] Sticky notes become interactive (slight glow/hover effect)

#### Drawing Test
- [ ] Click on first sticky note (green one)
- [ ] Note enlarges in overlay
- [ ] See close button (×) in top right
- [ ] See "✏️ Draw" and "📝 Text" buttons
- [ ] "✏️ Draw" is active by default
- [ ] Click and drag on canvas - line appears
- [ ] Drawing is smooth (no lag)
- [ ] Click outside or close button - overlay closes
- [ ] Drawing still visible on small sticky note

#### Text Test
- [ ] Click on second sticky note (yellow one)
- [ ] Click "📝 Text" button
- [ ] Click somewhere on canvas
- [ ] Text input popup appears
- [ ] Type "Hello World!"
- [ ] Click "Add" button
- [ ] Text appears on canvas
- [ ] Close the note
- [ ] Text visible on small sticky note

#### Multi-User Test (IMPORTANT!)
- [ ] Open http://localhost:3000 in SECOND browser tab
- [ ] Join with different name (e.g., "Test User 2")
- [ ] See "👥 2 people drawing" on BOTH tabs
- [ ] In Tab 1: Click on third sticky note
- [ ] In Tab 1: Start drawing
- [ ] In Tab 2: Click on same sticky note
- [ ] In Tab 2: See the drawing from Tab 1 appear!
- [ ] In Tab 2: Start drawing
- [ ] In Tab 1: See drawing from Tab 2 appear in real-time!
- [ ] See each other's cursors moving (colored dot with name)

#### Mobile Test (if possible)
- [ ] Open on phone's browser
- [ ] Join with name
- [ ] Click sticky note
- [ ] Drawing works with finger
- [ ] Text input works
- [ ] Can close overlay
- [ ] Layout looks good

#### Save Test
- [ ] Add some drawings and text to multiple notes
- [ ] Click "💾 Save Wall" button
- [ ] Image downloads automatically
- [ ] Open downloaded image
- [ ] All notes are visible in the image
- [ ] All drawings and text are captured

### 🌐 Network Test (Before Party)

#### Local Network Test
- [ ] Find your computer's IP address
  - Mac: System Preferences → Network
  - Windows: `ipconfig` in Command Prompt
  - Or run: `ifconfig | grep "inet "`
- [ ] Your IP: `____________` (write it down)
- [ ] On another device (phone/tablet) on same WiFi:
  - [ ] Open browser
  - [ ] Go to: http://YOUR_IP:3000
  - [ ] Website loads
  - [ ] Join the game
  - [ ] Can draw and see main computer's drawing

### 🚨 Error Tests

#### Connection Lost Test
- [ ] Join the game
- [ ] Stop the server (Ctrl+C in terminal)
- [ ] Try to draw - should show disconnected message
- [ ] Restart server: `npm start`
- [ ] Refresh page
- [ ] Can rejoin successfully

#### Invalid Name Test
- [ ] Click join button
- [ ] Leave name empty
- [ ] Click join - error message appears
- [ ] Enter just "A" (one character)
- [ ] Click join - error message appears
- [ ] Enter "AB" (two characters)
- [ ] Click join - should work!

### 🎯 Performance Test

#### Stress Test (Optional but Recommended)
- [ ] Open 5+ browser tabs
- [ ] Join with different names in each
- [ ] All tabs drawing simultaneously
- [ ] No significant lag
- [ ] All drawings sync correctly
- [ ] Server doesn't crash

### 📱 Final Pre-Party Check

**Day Before Party:**
- [ ] Server starts without errors
- [ ] Can join from 3+ different devices
- [ ] All devices can draw together
- [ ] Save function works
- [ ] No error messages in browser console (F12)

**1 Hour Before Party:**
- [ ] Start server: `npm start`
- [ ] Test with 2-3 devices
- [ ] Write down the URL to share: `http://___________:3000`
- [ ] Have instructions ready

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module"
**Fix:** Run `npm install` in the matildulus folder

### Issue: "Port 3000 already in use"
**Fix:** 
```bash
killall node
npm start
```

### Issue: Drawing not appearing
**Fix:** 
- Refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
- Clear browser cache
- Try different browser

### Issue: Can't connect from other devices
**Fix:**
- Check firewall settings
- Make sure all devices on same WiFi
- Double-check IP address

### Issue: Text input not showing
**Fix:**
- Make sure "Text" tool is selected
- Click directly on the canvas area
- Try clicking in different spots

---

## ✨ Success Indicators

You're ready when:
- ✅ Multiple people can join
- ✅ Everyone can see each other's cursors
- ✅ Drawings sync in real-time
- ✅ Text appears for everyone
- ✅ Save button downloads image
- ✅ No errors in browser console
- ✅ Works on phone and computer

---

## 🎉 Party Day Checklist

1. [ ] Start server 30 minutes before party
2. [ ] Test with 2 devices
3. [ ] Write URL on whiteboard/screen
4. [ ] Have backup: screenshot the URL
5. [ ] Keep laptop/server plugged in
6. [ ] Keep terminal window open to monitor
7. [ ] Have this checklist handy

---

## 📸 Screenshot for Testing

When testing, your screen should look like:

**Before Joining:**
```
🌿 MESSAGES FROM THE SQUAD 🌿
[🎨 JOIN THE MESSAGE PARTY]
[Five colored sticky notes below]
```

**After Joining:**
```
🌿 MESSAGES FROM THE SQUAD 🌿
👥 3 people drawing  💾 Save Wall
[Five colored sticky notes with drawings]
[Colored cursor dots moving around]
```

---

Good luck! Your friend's graduation party is going to be amazing! 🦎💚

P.S. Take lots of screenshots during the party - they'll love seeing everyone collaborate! 📸

