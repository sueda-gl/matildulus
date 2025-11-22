# 🧹 Eraser Tool & State Persistence Plan

## 📍 Current State Analysis

### Current Implementation:
1. **Tools**: Draw and Text only
2. **State Storage**: Server stores `canvasData` in memory only
3. **Persistence**: ❌ Data lost on server restart
4. **Refresh**: ✅ Works if server stays running (data in memory)

### Problems:
- ❌ No eraser tool
- ❌ Server restart = all drawings lost
- ❌ No file-based persistence

---

## 🎯 Goals

1. **Add Eraser Tool**: Allow users to erase parts of the canvas
2. **Persist State**: Save canvas data to file, survive server restarts
3. **Load on Start**: Automatically load saved state when server starts

---

## 📋 Implementation Plan

### **Part 1: Eraser Tool**

#### **1.1 Add Eraser Button to UI**

**File**: `index.html` (line 184-196)

**Changes**:
- Add eraser button to toolbar
- Place between Draw and Text buttons

**New HTML**:
```html
<div class="canvas-toolbar" id="canvas-toolbar" style="display: none;">
    <button class="tool-btn active" data-tool="draw">✏️ Draw</button>
    <button class="tool-btn" data-tool="eraser">🧹 Eraser</button>
    <button class="tool-btn" data-tool="text">📝 Text</button>
    <!-- ... rest stays same ... -->
</div>
```

#### **1.2 Update Game.js - Add Eraser State**

**File**: `game.js`

**Changes**:

1. **Update `startDrawing()` method** (line 473):
   - Check if current tool is 'eraser'
   - If eraser: set `globalCompositeOperation = 'destination-out'`
   - If draw: set `globalCompositeOperation = 'source-over'` (normal)

2. **Update `stopDrawing()` method** (line 503):
   - Send tool type to server ('draw' or 'eraser')
   - Server needs to know which type of stroke it is

3. **Update `drawRemotePath()` method** (line 626):
   - Check if drawing has `type: 'eraser'`
   - Apply eraser composite operation when drawing remote eraser strokes

4. **Update tool switching logic** (line 274-290):
   - Handle 'eraser' tool selection
   - Update cursor style for eraser
   - Update tool info text

#### **1.3 Update Server.js - Store Eraser Strokes**

**File**: `server.js`

**Changes**:

1. **Update `draw` handler** (line 74):
   - Accept `type` field ('draw' or 'eraser')
   - Store type in drawingData
   - Add type to canvasData.drawings

2. **Data Structure**:
```javascript
drawingData = {
  userId: ...,
  userName: ...,
  color: ...,
  path: [...],
  type: 'draw' | 'eraser',  // NEW
  timestamp: ...
}
```

#### **1.4 Update CSS for Eraser Button**

**File**: `styles.css`

**Changes**:
- Eraser button should have distinct styling when active
- Maybe add a visual indicator (different background color)

---

### **Part 2: State Persistence**

#### **2.1 Server-Side File Storage**

**File**: `server.js`

**Changes**:

1. **Add fs module** (top of file):
```javascript
const fs = require('fs');
const DATA_FILE = path.join(__dirname, 'canvas-state.json');
```

2. **Load State on Server Start** (before socket.io setup):
```javascript
// Load saved canvas state
function loadCanvasState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      canvasData = JSON.parse(data);
      console.log(`✅ Loaded canvas state: ${canvasData.drawings.length} drawings, ${canvasData.texts.length} texts`);
    } else {
      console.log('📝 No saved state found, starting fresh');
    }
  } catch (error) {
    console.error('❌ Error loading canvas state:', error);
    canvasData = { drawings: [], texts: [] };
  }
}

// Call on server start
loadCanvasState();
```

3. **Save State Function**:
```javascript
function saveCanvasState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(canvasData, null, 2));
    console.log('💾 Canvas state saved');
  } catch (error) {
    console.error('❌ Error saving canvas state:', error);
  }
}
```

4. **Auto-Save on Changes**:
   - Call `saveCanvasState()` after:
     - Drawing added (line 85)
     - Text added (line 107)
     - Could also add periodic auto-save (every 30 seconds)

5. **Handle Eraser Strokes**:
   - Eraser strokes should also trigger save
   - When loading, apply eraser strokes in correct order (by timestamp)

#### **2.2 Update Client to Handle Eraser Strokes**

**File**: `game.js`

**Changes**:

1. **`loadExistingData()` method** (line 312):
   - When loading drawings, check for eraser type
   - Apply eraser strokes with correct composite operation
   - Order matters: apply in timestamp order

2. **`drawRemotePath()` method** (line 626):
   - Check `drawing.type`
   - If 'eraser': use `destination-out`
   - If 'draw' or undefined: use `source-over`

---

## 🔧 Technical Details

### **Eraser Implementation:**

**Canvas API**:
- `ctx.globalCompositeOperation = 'destination-out'` - Erases pixels
- Must reset to `'source-over'` after erasing
- Eraser strokes are drawn the same way as normal strokes, just with different composite operation

**Stroke Order**:
- Eraser strokes must be applied in chronological order
- When loading, sort all strokes (drawings + erasers) by timestamp
- Apply in order: draw → erase → draw → erase, etc.

### **Persistence Strategy:**

**File Format**:
```json
{
  "drawings": [
    {
      "userId": "...",
      "userName": "...",
      "color": "#FF0000",
      "path": [...],
      "type": "draw",
      "timestamp": 1234567890
    },
    {
      "userId": "...",
      "userName": "...",
      "color": "#000000",
      "path": [...],
      "type": "eraser",
      "timestamp": 1234567891
    }
  ],
  "texts": [...]
}
```

**Save Strategy**:
- **Option 1**: Save after every change (immediate, but more I/O)
- **Option 2**: Debounced save (save after 2 seconds of inactivity)
- **Option 3**: Periodic save (every 30 seconds) + save on change
- **Recommended**: Option 3 (periodic + on change)

**Error Handling**:
- If file read fails → start fresh
- If file write fails → log error, continue (don't crash)
- If JSON parse fails → start fresh

---

## 📝 Implementation Checklist

### Eraser Tool:
- [ ] Add eraser button to HTML
- [ ] Add eraser CSS styles
- [ ] Update `currentTool` to support 'eraser'
- [ ] Update `startDrawing()` to handle eraser mode
- [ ] Update `stopDrawing()` to send eraser type
- [ ] Update `drawRemotePath()` to handle eraser strokes
- [ ] Update `loadExistingData()` to apply eraser strokes correctly
- [ ] Update tool switching logic
- [ ] Update cursor for eraser tool

### State Persistence:
- [ ] Add fs module to server.js
- [ ] Create `loadCanvasState()` function
- [ ] Create `saveCanvasState()` function
- [ ] Load state on server start
- [ ] Save state after drawing added
- [ ] Save state after text added
- [ ] Save state after eraser stroke
- [ ] Add error handling for file operations
- [ ] Test: restart server, verify data persists

---

## 🧪 Testing Plan

### Eraser Testing:
1. Draw something
2. Switch to eraser
3. Erase part of drawing
4. Verify erasure works locally
5. Open second tab/window
6. Verify erasure appears in real-time
7. Refresh page
8. Verify erasure persists

### Persistence Testing:
1. Draw something
2. Add text
3. Use eraser
4. Stop server
5. Restart server
6. Refresh page
7. Verify all drawings/texts/erasures are still there

### Edge Cases:
- Empty canvas state file
- Corrupted JSON file
- File permissions issues
- Large canvas data (performance)

---

## 🎨 UI/UX Considerations

### Eraser Tool:
- **Cursor**: Maybe show a circle/crosshair for eraser
- **Visual Feedback**: Different cursor when eraser is active
- **Button State**: Eraser button should look distinct when active
- **Tool Info**: Update text to "Click and drag to erase!"

### Persistence:
- **User Feedback**: Maybe show "Saving..." indicator (optional)
- **Transparent**: Users shouldn't notice persistence (it just works)

---

## 🔄 Backward Compatibility

### Eraser:
- Old drawings without `type` field → treat as 'draw'
- Existing code should work with new eraser strokes

### Persistence:
- If no state file exists → start fresh (backward compatible)
- Old state files without `type` field → still work (eraser strokes just won't exist)

---

## 📊 Data Structure Changes

### Before:
```javascript
canvasData = {
  drawings: [
    { userId, userName, color, path, timestamp }
  ],
  texts: [...]
}
```

### After:
```javascript
canvasData = {
  drawings: [
    { userId, userName, color, path, type: 'draw' | 'eraser', timestamp }
  ],
  texts: [...]
}
```

---

## 🚀 Summary

**Files to Modify**:
1. `index.html` - Add eraser button
2. `styles.css` - Style eraser button
3. `game.js` - Add eraser logic (5-6 method updates)
4. `server.js` - Add eraser support + file persistence

**Key Changes**:
- Add `type` field to drawing data
- Use `globalCompositeOperation` for eraser
- Add file I/O for persistence
- Load/save canvas state automatically

**Estimated Complexity**: Medium-High
**Estimated Time**: 2-3 hours
**Risk Level**: Medium (file I/O, composite operations)

