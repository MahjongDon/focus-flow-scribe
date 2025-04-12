
# Running Focus Flow Scribe as a Desktop Application

This folder contains the necessary files to run Focus Flow Scribe as a desktop application using Electron.

## Development Setup

1. Install the required Electron dependencies:
   ```
   npm install electron electron-builder --save-dev
   ```

2. Run the application in development mode:
   ```
   node electron/start.js
   ```

## Building for Production

1. First, build the React application:
   ```
   npm run build
   ```

2. Then build the Electron application:
   ```
   npx electron-builder build --config electron-builder.json
   ```

This will create packaged applications in the `releases` folder.

## File Structure

- `electron/main.js` - Main Electron process file
- `electron/preload.js` - Preload script for secure renderer communication
- `electron/start.js` - Script to start the development environment
- `electron-builder.json` - Configuration for packaging the app

## Notes

Since we can't modify package.json directly, you'll need to install dependencies and run scripts manually as described above.
