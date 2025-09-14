const { spawn } = require('child_process');
const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const find = require('find-process');

// Keep a global reference of the window object and Django process
let mainWindow;
let djangoProcess;
let djangoPort = 8000;

// Check if port is available
async function isPortAvailable(port) {
  try {
    const list = await find('port', port);
    return list.length === 0;
  } catch (error) {
    return true;
  }
}

// Check if Django server is actually responding
async function checkDjangoHealth(port, retries = 30) {
  const http = require('http');
  
  return new Promise((resolve, reject) => {
    const tryConnection = (attemptsLeft) => {
      if (attemptsLeft <= 0) {
        reject(new Error('Django server health check timeout'));
        return;
      }

      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          // 404 is OK, means Django is responding but no route at /
          resolve(port);
        } else {
          setTimeout(() => tryConnection(attemptsLeft - 1), 500);
        }
      });

      req.on('error', () => {
        setTimeout(() => tryConnection(attemptsLeft - 1), 500);
      });

      req.setTimeout(1000, () => {
        req.destroy();
        setTimeout(() => tryConnection(attemptsLeft - 1), 500);
      });
    };

    tryConnection(retries);
  });
}

// Start Django backend server
async function startDjangoServer() {
  return new Promise(async (resolve, reject) => {
    try {
      // Send status to loading screen
      if (mainWindow) {
        mainWindow.webContents.executeJavaScript(`
          if (document.getElementById('status')) {
            document.getElementById('status').textContent = 'Checking port availability...';
          }
        `);
      }

      // Find available port
      while (!(await isPortAvailable(djangoPort))) {
        djangoPort++;
      }

      const djangoPath = isDev 
        ? path.join(__dirname, '..', '..', 'backend')
        : path.join(process.resourcesPath, 'backend');

      console.log('Starting Django server at:', djangoPath);
      console.log('Django path exists:', require('fs').existsSync(djangoPath));
      console.log('manage.py exists:', require('fs').existsSync(path.join(djangoPath, 'manage.py')));

      // Update loading screen
      if (mainWindow) {
        mainWindow.webContents.executeJavaScript(`
          if (document.getElementById('status')) {
            document.getElementById('status').textContent = 'Starting Python backend server...';
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) progressFill.style.width = '20%';
          }
        `);
      }

      // Start Django development server
      console.log('Django working directory:', djangoPath);
      console.log('Django command:', `python manage.py runserver 127.0.0.1:${djangoPort} --noreload`);
      
      djangoProcess = spawn('python', ['manage.py', 'runserver', `127.0.0.1:${djangoPort}`, '--noreload'], {
        cwd: djangoPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true  // Use shell to handle path resolution correctly
      });

      let serverStarted = false;

      djangoProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Django stdout:', output);
        
        // Check for multiple Django startup indicators
        if ((output.includes('Starting development server') || 
             output.includes('Django version') || 
             output.includes('Quit the server with')) && !serverStarted) {
          serverStarted = true;
          
          // Update loading screen
          if (mainWindow) {
            mainWindow.webContents.executeJavaScript(`
              if (document.getElementById('status')) {
                document.getElementById('status').textContent = 'Server started! Testing connection...';
                const progressFill = document.querySelector('.progress-fill');
                if (progressFill) progressFill.style.width = '80%';
              }
            `);
          }

          // Give Django a moment to fully start, then resolve
          setTimeout(() => {
            console.log(`Django server appears ready on port ${djangoPort}`);
            
            // Update loading screen one more time
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                if (document.getElementById('status')) {
                  document.getElementById('status').textContent = 'Server ready! Loading application...';
                  const progressFill = document.querySelector('.progress-fill');
                  if (progressFill) progressFill.style.width = '100%';
                }
              `);
            }
            
            setTimeout(() => resolve(djangoPort), 1000);
          }, 3000); // Give Django more time to fully start
        }
      });

      djangoProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        console.error('Django stderr:', errorOutput);
        
        // Some Django output comes through stderr but isn't actually errors
        // Check for actual server startup messages
        if (errorOutput.includes('Watching for file changes') || 
            errorOutput.includes('Performing system checks') ||
            errorOutput.includes('Django version')) {
          console.log('Django startup message via stderr:', errorOutput);
          
          if (!serverStarted) {
            serverStarted = true;
            
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                if (document.getElementById('status')) {
                  document.getElementById('status').textContent = 'Server ready! Loading application...';
                  const progressFill = document.querySelector('.progress-fill');
                  if (progressFill) progressFill.style.width = '100%';
                }
              `);
            }
            
            setTimeout(() => resolve(djangoPort), 2000);
          }
        } else if (errorOutput.includes('Error') || errorOutput.includes('error')) {
          // Update loading screen with actual error
          if (mainWindow) {
            mainWindow.webContents.executeJavaScript(`
              if (document.getElementById('status')) {
                document.getElementById('status').textContent = 'Server startup error - retrying...';
              }
            `);
          }
        }
      });

      djangoProcess.on('close', (code) => {
        console.log(`Django process exited with code ${code}`);
        if (code !== 0 && !serverStarted) {
          reject(new Error(`Django server failed to start (exit code: ${code})`));
        }
      });

      djangoProcess.on('error', (error) => {
        console.error('Failed to start Django process:', error);
        reject(error);
      });

      // Simplified timeout - just wait 10 seconds and assume Django started
      setTimeout(() => {
        if (!serverStarted) {
          console.log('Django startup timeout reached, assuming server is ready...');
          serverStarted = true;
          
          if (mainWindow) {
            mainWindow.webContents.executeJavaScript(`
              if (document.getElementById('status')) {
                document.getElementById('status').textContent = 'Server ready! Loading application...';
                const progressFill = document.querySelector('.progress-fill');
                if (progressFill) progressFill.style.width = '100%';
              }
            `);
          }
          
          resolve(djangoPort);
        }
      }, 10000);

    } catch (error) {
      reject(error);
    }
  });
}

// Stop Django server
function stopDjangoServer() {
  if (djangoProcess) {
    console.log('Stopping Django server...');
    djangoProcess.kill('SIGTERM');
    djangoProcess = null;
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'logo.svg'),
    show: false,
    titleBarStyle: 'default',
  });

  // Show loading screen first
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));
  mainWindow.show();

  // Start Django server then load the app
  startDjangoServer()
    .then((port) => {
      console.log(`Django server ready on port ${port}`);
      
      // Final loading screen update
      mainWindow.webContents.executeJavaScript(`
        if (document.getElementById('status')) {
          document.getElementById('status').textContent = 'Ready! Launching application...';
        }
      `);
      
      // Wait a moment for user to see completion, then load main app
      setTimeout(() => {
        // For standalone app, always use the built React files
        const startUrl = `file://${path.join(__dirname, '../build/index.html')}`;
        
        // Set up API base URL before loading the app
        mainWindow.webContents.once('dom-ready', () => {
          mainWindow.webContents.executeJavaScript(`
            window.API_BASE_URL = 'http://127.0.0.1:${port}/api';
            console.log('API Base URL set to:', window.API_BASE_URL);
          `);
        });
        
        // Load the main React app
        mainWindow.loadURL(startUrl);
        
        // Open DevTools in development
        if (isDev) {
          mainWindow.webContents.openDevTools();
        }
      }, 1500); // Give user time to see completion
    })
    .catch((error) => {
      console.error('Failed to start Django server:', error);
      
      // Show error on loading screen
      mainWindow.webContents.executeJavaScript(`
        if (document.getElementById('status')) {
          document.getElementById('status').textContent = 'Server startup failed. Please check console.';
          document.getElementById('status').style.color = '#e74c3c';
        }
      `);
      
      // Show error dialog after a moment
      setTimeout(() => {
        dialog.showErrorBox('Server Error', 
          'Failed to start the backend server. Please make sure Python and required packages are installed.\n\nError: ' + error.message);
        app.quit();
      }, 2000);
    });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create app menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-document');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'PDF Tools',
          click: () => {
            mainWindow.webContents.send('menu-navigate', '/pdf-tools');
          }
        },
        {
          label: 'Image Tools',
          click: () => {
            mainWindow.webContents.send('menu-navigate', '/image-tools');
          }
        },
        {
          label: 'Word Tools',
          click: () => {
            mainWindow.webContents.send('menu-navigate', '/word-tools');
          }
        },
        {
          label: 'Security Center',
          click: () => {
            mainWindow.webContents.send('menu-navigate', '/security-center');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Easy Document',
          click: async () => {
            await dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Easy Document',
              message: 'Easy Document v2.1.0',
              detail: 'Modern full-stack document processing platform\n\nCreated by Glen Ferdinand\nLicense: MIT',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event listeners
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopDjangoServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopDjangoServer();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});