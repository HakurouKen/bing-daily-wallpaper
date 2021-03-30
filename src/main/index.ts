import { app, BrowserWindow } from 'electron';
import installExtension from 'electron-devtools-installer';
import createWindow from './create-window';
import './events';

try {
  require('electron-reloader')(module);
} catch {}

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null;

async function createMainWindow() {
  if (mainWindow) {
    return;
  }
  mainWindow = createWindow();
  mainWindow.once('close', () => {
    mainWindow = null;
  });

  const port = process.env.PORT || 3000;
  if (isDev) {
    await mainWindow.loadURL(`http://localhost:${port}`);
    try {
      const name = await installExtension('ljjemllljcmogpfapbkkighbhhppjdbg');
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
app.on('activate', () => createMainWindow());
