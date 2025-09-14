const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu navigation handler
  onMenuNavigate: (callback) => {
    ipcRenderer.on('menu-navigate', callback);
  },
  
  // New document handler
  onMenuNewDocument: (callback) => {
    ipcRenderer.on('menu-new-document', callback);
  },
  
  // File operations (for future use)
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  
  // System info
  platform: process.platform,
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Optional: Expose Node.js APIs if needed (use carefully for security)
contextBridge.exposeInMainWorld('nodeAPI', {
  path: require('path'),
  // Add other Node.js modules as needed, but be careful about security
});

// Log when preload script is loaded
console.log('Preload script loaded successfully');