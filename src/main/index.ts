import { app, BrowserWindow, Menu, MenuItem, Tray } from 'electron';
import installExtension from 'electron-devtools-installer';
import config from '@/shared/config';
import { update as updateWallpaper } from './wallpaper';
import createWindow from './helpers/create-window';
import './events';

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
      // vue.js devtools beta
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

let tray = null;

async function updateWallpaperNow(menuItem: MenuItem) {
  const originalLabel = menuItem.label;
  try {
    menuItem.enabled = false;
    await updateWallpaper();
  } catch (err) {
    console.error(err);
  } finally {
    menuItem.enabled = true;
    menuItem.label = originalLabel;
  }
}

const menuItemUpdateWallpaper = new MenuItem({
  label: '立刻更新',
  type: 'normal',
  click: updateWallpaperNow
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.whenReady().then(() => {
  tray = new Tray(app.getAppPath() + '/icons/wallpaper.ico');
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开设置', type: 'normal', click: () => createMainWindow() },
    menuItemUpdateWallpaper,
    { label: '退出', type: 'normal', click: () => app.quit() }
  ]);
  tray.setToolTip(config.APP_NAME);
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
  // https://www.electronjs.org/docs/api/app#event-window-all-closed
  // Add an empty callback to avoid the default behavior (quit the app)
});
