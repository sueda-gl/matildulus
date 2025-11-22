// Collaborative Message Wall Game
// Socket.io client for real-time collaboration - Single Canvas Version

class MessageWallGame {
  constructor() {
    this.socket = null;
    this.userId = null;
    this.userName = null;
    this.userColor = null;
    this.isDrawing = false;
    this.currentTool = 'draw'; // 'draw' or 'text'
    this.cursors = {}; // Other users' cursors
    this.currentPath = [];
    this.lastPoint = null;
    
    // Single canvas system
    this.canvas = null;
    this.ctx = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.dpr = window.devicePixelRatio || 1;
    
    this.init();
  }

  init() {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupUI());
    } else {
      this.setupUI();
    }
  }

  setupUI() {
    // Add join button to message wall section
    const messageWall = document.querySelector('.message-wall');
    if (!messageWall) {
      console.error('Message wall section not found');
      return;
    }

    // Game controls are already in HTML, just add event listeners
    const joinBtn = document.getElementById('join-game-btn');
    const saveBtn = document.getElementById('save-wall-btn');
    
    if (joinBtn) {
      joinBtn.addEventListener('click', () => this.showJoinModal());
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveWall());
    }

    // Setup the main canvas
    this.setupCanvas();
  }

  setupCanvas() {
    // Get canvas element
    this.canvas = document.getElementById('main-canvas');
    const container = document.getElementById('main-canvas-container');
    
    if (!this.canvas || !container) {
      console.error('Canvas elements not found');
      return;
    }

    // Initialize context
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size to match container
    this.resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const container = document.getElementById('main-canvas-container');
    if (!container || !this.canvas || !this.ctx) return;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Store logical dimensions
    this.canvasWidth = displayWidth;
    this.canvasHeight = displayHeight;

    // Set canvas internal size (with DPR for crisp drawing)
    const deviceWidth = displayWidth * this.dpr;
    const deviceHeight = displayHeight * this.dpr;
    
    this.canvas.width = deviceWidth;
    this.canvas.height = deviceHeight;

    // Set canvas display size (CSS size)
    this.canvas.style.width = displayWidth + 'px';
    this.canvas.style.height = displayHeight + 'px';

    // Scale context for high DPI - THIS IS CRITICAL!
    // After setting canvas.width/height, we need to reset the transform
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    
    // Set drawing properties
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  showJoinModal() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>🦎 Join the Message Wall! 🦎</h2>
        <p>Enter your name to start drawing with friends:</p>
        <input type="text" id="player-name" placeholder="Your name" maxlength="20" autocomplete="off">
        <div class="modal-buttons">
          <button id="join-submit" class="modal-btn primary">Join Party! 🎉</button>
          <button id="join-cancel" class="modal-btn">Cancel</button>
        </div>
        <div id="join-error" class="join-error" style="display: none;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const nameInput = document.getElementById('player-name');
    const submitBtn = document.getElementById('join-submit');
    const cancelBtn = document.getElementById('join-cancel');

    nameInput.focus();

    // Handle submit
    const handleSubmit = () => {
      const name = nameInput.value.trim();
      if (name.length < 2) {
        this.showError('Please enter a name (at least 2 characters)');
        return;
      }
      this.joinGame(name);
      modal.remove();
    };

    submitBtn.addEventListener('click', handleSubmit);
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
    cancelBtn.addEventListener('click', () => modal.remove());
  }

  showError(message) {
    const errorDiv = document.getElementById('join-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 3000);
    }
  }

  joinGame(name) {
    this.userName = name;

    // Connect to Socket.io server
    const serverURL = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : window.location.origin;
    
    this.socket = io(serverURL, {
      transports: ['websocket', 'polling']
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.emit('join', { name: this.userName });
    });

    this.socket.on('init-state', (data) => {
      this.userId = data.userId;
      this.userColor = data.color;
      
      // Load existing drawings and texts
      this.loadExistingData(data.canvasData);
      
      // Show game controls
      this.activateGame();
    });

    this.socket.on('user-joined', (data) => {
      console.log(`${data.name} joined`);
      this.showNotification(`${data.name} joined the party! 🎉`);
    });

    this.socket.on('user-left', (data) => {
      // Remove cursor
      if (this.cursors[data.userId]) {
        this.cursors[data.userId].element.remove();
        delete this.cursors[data.userId];
      }
    });

    this.socket.on('users-list', (users) => {
      this.updateUserCount(users.length);
    });

    this.socket.on('drawing-update', (data) => {
      this.drawRemotePath(data.drawing);
    });

    this.socket.on('text-update', (data) => {
      this.drawRemoteText(data.text);
    });

    this.socket.on('cursor-update', (data) => {
      this.updateRemoteCursor(data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.showError('Connection failed. Please try again.');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.showNotification('Disconnected from server');
    });
  }

  activateGame() {
    // Hide join button, show status
    const joinBtn = document.getElementById('join-game-btn');
    const gameStatus = document.getElementById('game-status');
    const toolbar = document.getElementById('canvas-toolbar');
    const container = document.getElementById('main-canvas-container');
    
    if (joinBtn) joinBtn.style.display = 'none';
    if (gameStatus) gameStatus.style.display = 'flex';
    if (toolbar) toolbar.style.display = 'flex';
    if (container) container.classList.add('game-active');

    // Ensure canvas is properly initialized
    if (!this.canvas || !this.ctx) {
      this.setupCanvas();
    }
    
    // Resize canvas to ensure proper dimensions
    // Use setTimeout to ensure container has rendered
    setTimeout(() => {
      this.resizeCanvas();
      
      // Setup drawing on canvas after canvas is ready
      this.setupDrawing();
    }, 100);

    // Tool buttons
    const toolBtns = document.querySelectorAll('.canvas-toolbar .tool-btn');
    toolBtns.forEach(btn => {
      // Remove any existing listeners to avoid duplicates
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', () => {
        toolBtns.forEach(b => {
          if (b !== newBtn) b.classList.remove('active');
        });
        newBtn.classList.add('active');
        this.currentTool = newBtn.dataset.tool;
        const info = document.querySelector('.canvas-toolbar .tool-info');
        if (info) {
          info.textContent = this.currentTool === 'draw' 
            ? 'Click and drag to draw anywhere!' 
            : 'Click to place text';
        }
        // Update cursor
        if (this.canvas) {
          this.canvas.style.cursor = this.currentTool === 'draw' ? 'crosshair' : 'text';
        }
      });
    });

    this.showNotification(`Welcome ${this.userName}! Start drawing! 🦎`);
  }

  loadExistingData(canvasData) {
    if (!canvasData) return;
    
    // Draw existing paths
    if (canvasData.drawings) {
      canvasData.drawings.forEach(drawing => {
        this.drawRemotePath(drawing);
      });
    }
    
    // Draw existing texts
    if (canvasData.texts) {
      canvasData.texts.forEach(text => {
        this.drawRemoteText(text);
      });
    }
  }

  setupDrawing() {
    if (!this.canvas || !this.ctx) {
      console.error('Canvas or context not initialized');
      return;
    }

    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      
      // Calculate position relative to canvas in display pixels
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      // Clamp to canvas bounds
      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));
      
      // Convert to logical coordinates (already scaled by DPR in context)
      // Since we scaled the context by DPR, coordinates are in logical pixels
      return {
        x: x,  // Direct mapping since context is scaled
        y: y   // Direct mapping since context is scaled
      };
    };

    const getTouchPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      
      // Calculate position relative to canvas in display pixels
      let x = touch.clientX - rect.left;
      let y = touch.clientY - rect.top;
      
      // Clamp to canvas bounds
      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));
      
      // Convert to logical coordinates (already scaled by DPR in context)
      return {
        x: x,  // Direct mapping since context is scaled
        y: y   // Direct mapping since context is scaled
      };
    };

    // Track global mouse handlers for cleanup
    let globalMouseMoveHandler = null;
    let globalMouseUpHandler = null;

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (this.currentTool === 'draw') {
        this.startDrawing(getMousePos(e));
        
        // Add global listeners to track mouse even outside canvas
        globalMouseMoveHandler = (e) => {
          const rect = this.canvas.getBoundingClientRect();
          // Only process if mouse is over canvas or very close
          if (e.clientX >= rect.left - 10 && e.clientX <= rect.right + 10 &&
              e.clientY >= rect.top - 10 && e.clientY <= rect.bottom + 10) {
            const pos = getMousePos(e);
            if (this.isDrawing && this.currentTool === 'draw') {
              this.draw(pos);
            }
          }
        };
        
        globalMouseUpHandler = () => {
          if (this.isDrawing) {
            this.stopDrawing();
          }
          if (globalMouseMoveHandler) {
            document.removeEventListener('mousemove', globalMouseMoveHandler);
          }
          if (globalMouseUpHandler) {
            document.removeEventListener('mouseup', globalMouseUpHandler);
          }
          globalMouseMoveHandler = null;
          globalMouseUpHandler = null;
        };
        
        document.addEventListener('mousemove', globalMouseMoveHandler);
        document.addEventListener('mouseup', globalMouseUpHandler);
      } else if (this.currentTool === 'text') {
        this.placeText(getMousePos(e));
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const pos = getMousePos(e);
      
      if (this.isDrawing && this.currentTool === 'draw') {
        this.draw(pos);
      }
      
      // Send cursor position
      if (this.socket) {
        this.socket.emit('cursor-move', {
          x: pos.x,
          y: pos.y
        });
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      if (this.isDrawing) {
        this.stopDrawing();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      if (this.isDrawing) {
        this.stopDrawing();
      }
    });

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.currentTool === 'draw') {
        this.startDrawing(getTouchPos(e));
      } else if (this.currentTool === 'text') {
        this.placeText(getTouchPos(e));
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isDrawing && this.currentTool === 'draw') {
        this.draw(getTouchPos(e));
      }
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (this.isDrawing) {
        this.stopDrawing();
      }
    });
  }

  startDrawing(pos) {
    if (!this.ctx) {
      console.error('Context not available');
      return;
    }
    
    this.isDrawing = true;
    this.lastPoint = pos;
    this.currentPath = [pos];
    
    // Set drawing properties
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(pos) {
    if (!this.isDrawing || !this.ctx) return;
    
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    
    this.currentPath.push(pos);
    this.lastPoint = pos;
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    
    // Send path to server (normalize coordinates to standard 1400x600)
    if (this.socket && this.currentPath.length > 0) {
      // Normalize path coordinates based on canvas size (for consistency across screens)
      // Standard reference size: 1400x600
      const normalizedPath = this.currentPath.map(point => ({
        x: (point.x / this.canvasWidth) * 1400,
        y: (point.y / this.canvasHeight) * 600
      }));
      
      this.socket.emit('draw', {
        path: normalizedPath
      });
    }
    
    this.currentPath = [];
    this.lastPoint = null;
  }

  placeText(pos) {
    // Store the position for later use
    const textPos = { x: pos.x, y: pos.y };
    
    // Create text input popup
    const textInput = document.createElement('div');
    textInput.className = 'text-input-popup';
    textInput.innerHTML = `
      <input type="text" placeholder="Type your message..." maxlength="100" autocomplete="off">
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button class="text-submit">Add</button>
        <button class="text-cancel">Cancel</button>
      </div>
    `;
    
    // Position at click location on screen
    const canvasRect = this.canvas.getBoundingClientRect();
    textInput.style.position = 'fixed';
    textInput.style.left = (canvasRect.left + pos.x) + 'px';
    textInput.style.top = (canvasRect.top + pos.y) + 'px';
    textInput.style.zIndex = '10000';
    textInput.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(textInput);
    
    // Adjust position if popup goes off screen
    setTimeout(() => {
      const popupRect = textInput.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (popupRect.right > viewportWidth) {
        textInput.style.left = (viewportWidth - popupRect.width / 2 - 10) + 'px';
      }
      if (popupRect.left < 0) {
        textInput.style.left = (popupRect.width / 2 + 10) + 'px';
      }
      if (popupRect.bottom > viewportHeight) {
        textInput.style.top = (viewportHeight - popupRect.height / 2 - 10) + 'px';
      }
      if (popupRect.top < 0) {
        textInput.style.top = (popupRect.height / 2 + 10) + 'px';
      }
    }, 10);
    
    const input = textInput.querySelector('input');
    const submitBtn = textInput.querySelector('.text-submit');
    const cancelBtn = textInput.querySelector('.text-cancel');
    
    input.focus();
    
    const handleSubmit = () => {
      const text = input.value.trim();
      if (text) {
        // Draw text on canvas
        this.addText(text, textPos);
        
        // Send to server (normalize coordinates to standard 1400x600)
        if (this.socket) {
          this.socket.emit('text-add', {
            text: text,
            x: (textPos.x / this.canvasWidth) * 1400,
            y: (textPos.y / this.canvasHeight) * 600
          });
        }
      }
      textInput.remove();
    };
    
    submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
    cancelBtn.addEventListener('click', () => textInput.remove());
    
    // Close on click outside
    const closeOnOutside = (e) => {
      if (!textInput.contains(e.target)) {
        textInput.remove();
        document.removeEventListener('click', closeOnOutside);
      }
    };
    setTimeout(() => document.addEventListener('click', closeOnOutside), 100);
  }

  addText(text, pos) {
    if (!this.ctx) {
      console.error('Context not available for text');
      return;
    }
    
    // Set text properties
    this.ctx.font = '20px "Comic Neue", cursive';
    this.ctx.fillStyle = '#000000';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, pos.x, pos.y);
  }

  drawRemotePath(drawing) {
    if (!this.ctx || !drawing || !drawing.path || drawing.path.length === 0) return;
    
    const path = drawing.path;
    
    // Scale from standard size (1400x600) to actual canvas size
    const scaleX = this.canvasWidth / 1400;
    const scaleY = this.canvasHeight / 600;
    
    // Set drawing properties
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    this.ctx.moveTo(path[0].x * scaleX, path[0].y * scaleY);
    
    for (let i = 1; i < path.length; i++) {
      this.ctx.lineTo(path[i].x * scaleX, path[i].y * scaleY);
    }
    
    this.ctx.stroke();
  }

  drawRemoteText(textData) {
    if (!this.ctx || !textData || !textData.content) return;
    
    // Scale from standard size (1400x600) to actual canvas size
    const scaleX = this.canvasWidth / 1400;
    const scaleY = this.canvasHeight / 600;
    
    // Set text properties
    this.ctx.font = '20px "Comic Neue", cursive';
    this.ctx.fillStyle = '#000000';
    this.ctx.textBaseline = 'top';
    
    this.ctx.fillText(
      textData.content, 
      textData.x * scaleX, 
      textData.y * scaleY
    );
  }

  updateRemoteCursor(data) {
    // Don't show own cursor
    if (data.userId === this.userId) return;
    
    const container = document.getElementById('cursor-container');
    if (!container) return;
    
    // Create or update cursor
    if (!this.cursors[data.userId]) {
      const cursorEl = document.createElement('div');
      cursorEl.className = 'remote-cursor';
      cursorEl.innerHTML = `
        <div class="cursor-pointer" style="background: ${data.color}">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M0,0 L0,16 L4,12 L7,20 L9,19 L6,11 L12,11 Z" fill="${data.color}"/>
          </svg>
        </div>
        <div class="cursor-name" style="background: ${data.color}">${data.userName}</div>
      `;
      container.appendChild(cursorEl);
      
      this.cursors[data.userId] = {
        element: cursorEl
      };
    }
    
    const cursor = this.cursors[data.userId];
    
    // Scale from standard size to actual canvas size
    const scaleX = this.canvasWidth / 1400;
    const scaleY = this.canvasHeight / 600;
    
    // Update position
    cursor.element.style.left = (data.x * scaleX) + 'px';
    cursor.element.style.top = (data.y * scaleY) + 'px';
  }

  updateUserCount(count) {
    const userCountEl = document.getElementById('user-count');
    if (userCountEl) {
      userCountEl.textContent = `👥 ${count} ${count === 1 ? 'person' : 'people'} drawing`;
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  async saveWall() {
    try {
      // We'll use html2canvas library
      if (typeof html2canvas === 'undefined') {
        // Load html2canvas dynamically
        await this.loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      }
      
      const canvasContainer = document.getElementById('main-canvas-container');
      if (!canvasContainer) {
        this.showNotification('Canvas not found');
        return;
      }
      
      this.showNotification('Generating image... 📸');
      
      html2canvas(canvasContainer, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      }).then(canvas => {
        // Convert to blob and download
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `matildulus-message-wall-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          this.showNotification('Message wall saved! 💚');
        });
      });
    } catch (error) {
      console.error('Save failed:', error);
      this.showNotification('Save failed. Please try again.');
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// Initialize game when page loads
const game = new MessageWallGame();
