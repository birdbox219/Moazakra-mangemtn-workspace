const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

function getFrontendPath() {
  if (app.isPackaged) {
    // Production: Load the static files we bundled
    return path.join(process.resourcesPath, 'frontend', 'index.html');
  } else {
    // Development: Will return null and use Vite URL
    return null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Mozakrah Management Hub',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Remove the default menu bar for a clean look
  mainWindow.setMenuBarVisibility(false);

  if (app.isPackaged) {
    // Production: load the built React files
    const frontendPath = getFrontendPath();
    mainWindow.loadFile(frontendPath);
  } else {
    // Development: load directly from the Vite dev server
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Start app when ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
