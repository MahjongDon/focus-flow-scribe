
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development';

// Start the React development server in development mode
let reactProcess;
if (isDev) {
  reactProcess = spawn('npm', ['run', 'dev'], {
    shell: true,
    stdio: 'inherit'
  });
}

// Wait for the development server to start (in development mode)
// Then start Electron
setTimeout(() => {
  const electronProcess = spawn(electron, [path.join(__dirname, 'main.js')], {
    env: {
      ...process.env,
      ELECTRON_START_URL: isDev ? 'http://localhost:8080' : undefined,
      NODE_ENV: isDev ? 'development' : 'production'
    },
    stdio: 'inherit'
  });

  electronProcess.on('close', () => {
    if (reactProcess) {
      reactProcess.kill();
    }
    process.exit();
  });
}, isDev ? 5000 : 0); // Give the dev server 5 seconds to start in development mode
