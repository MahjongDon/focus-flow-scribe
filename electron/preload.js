
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // We can expose functions to interact with Electron if needed
    // For example, to save files to the desktop instead of localStorage
    saveToDesktop: (data) => {
      ipcRenderer.send('save-to-desktop', data);
    },
    // Add more methods as needed
  }
);
