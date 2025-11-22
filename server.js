const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'] // Fallback for Vercel
});

// Serve static files
app.use(cors());
app.use(express.static(__dirname));

// File path for canvas state persistence
const DATA_FILE = path.join(__dirname, 'canvas-state.json');

// In-memory storage - Single canvas system
let users = {}; // { socketId: { name, color } }
let canvasData = {
  drawings: [], // All drawings on the canvas
  texts: []     // All texts on the canvas
};

// Load saved canvas state from file
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

// Save canvas state to file
function saveCanvasState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(canvasData, null, 2));
    console.log('💾 Canvas state saved');
  } catch (error) {
    console.error('❌ Error saving canvas state:', error);
  }
}

// Load state on server start
loadCanvasState();

// Debounced save function to avoid too many file writes
let saveTimeout = null;
function debouncedSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveCanvasState();
  }, 2000); // Save 2 seconds after last change
}

// Predefined colors for users
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#52B788'
];

let colorIndex = 0;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('join', (data) => {
    const userName = data.name || 'Anonymous';
    const userColor = COLORS[colorIndex % COLORS.length];
    colorIndex++;

    users[socket.id] = {
      name: userName,
      color: userColor,
      id: socket.id
    };

    // Send current state to new user
    socket.emit('init-state', {
      userId: socket.id,
      color: userColor,
      canvasData: canvasData,
      users: users
    });

    // Broadcast to all users
    io.emit('user-joined', {
      userId: socket.id,
      name: userName,
      color: userColor
    });

    // Send updated user list
    io.emit('users-list', Object.values(users));

    console.log(`${userName} joined (${socket.id})`);
  });

  // Handle drawing - Single canvas system
  socket.on('draw', (data) => {
    const { path, color, type } = data;

    const drawingData = {
      userId: socket.id,
      userName: users[socket.id]?.name || 'Anonymous',
      color: color || users[socket.id]?.color || '#000000',
      path: path,
      type: type || 'draw', // 'draw' or 'eraser'
      timestamp: Date.now()
    };

    canvasData.drawings.push(drawingData);

    // Broadcast to all other users
    socket.broadcast.emit('drawing-update', {
      drawing: drawingData
    });

    // Auto-save state
    debouncedSave();
  });

  // Handle text addition - Single canvas system
  socket.on('text-add', (data) => {
    const { text, x, y, color } = data;

    const textData = {
      userId: socket.id,
      userName: users[socket.id]?.name || 'Anonymous',
      color: color || users[socket.id]?.color || '#000000',
      content: text,
      x: x,
      y: y,
      timestamp: Date.now()
    };

    canvasData.texts.push(textData);

    // Broadcast to all users including sender
    io.emit('text-update', {
      text: textData
    });

    // Auto-save state
    debouncedSave();
  });

  // Handle cursor movement - Single canvas system
  socket.on('cursor-move', (data) => {
    socket.broadcast.emit('cursor-update', {
      userId: socket.id,
      userName: users[socket.id]?.name || 'Anonymous',
      color: users[socket.id]?.color || '#000000',
      x: data.x,
      y: data.y
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    
    if (user) {
      console.log(`${user.name} disconnected`);
      delete users[socket.id];
      
      io.emit('user-left', {
        userId: socket.id
      });
      
      io.emit('users-list', Object.values(users));
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', users: Object.keys(users).length });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🦎 Server running on port ${PORT}`);
  console.log(`🌿 Message wall ready for collaboration!`);
});

// Export for Vercel
module.exports = app;

