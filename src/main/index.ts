import { app, BrowserWindow } from 'electron';
import createWindow from './helpers/create-window';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

try {
  require('electron-reloader')(module);
} catch {}

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null;

async function createMainWindow() {
  mainWindow = createWindow();
  mainWindow.once('close', () => {
    mainWindow = null;
  });

  const port = process.env.PORT || 3000;
  if (isDev) {
    await mainWindow.loadURL(`http://localhost:${port}`);
    try {
      const name = await installExtension(VUEJS_DEVTOOLS);
      console.log(`Load Extension: `, name);
    } catch (err) {
      console.error(`Error When load extension: `, err);
    }
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('dist/renderer/index.html');
  }
}

app.once('ready', () => createMainWindow());
app.on('activate', () => {
  if (!mainWindow) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
