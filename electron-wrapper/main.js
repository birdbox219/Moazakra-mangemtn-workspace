const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;

function getFrontendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'frontend', 'index.html');
  }
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Mozakrah Management Hub',
    // Premium Frame Configuration
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#747474',
      height: 40
    },
    trafficLightPosition: { x: 20, y: 20 },
    backgroundColor: '#00000000',
    transparent: false, // Set to true if you want actual transparency (OS dependent)
    show: false, // Don't show until ready to avoid flicker
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Future proofing
    },
  });

  // Remove menu bar for a clean look
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);

  if (app.isPackaged) {
    const frontendPath = getFrontendPath();
    mainWindow.loadFile(frontendPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  // Graceful show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
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
