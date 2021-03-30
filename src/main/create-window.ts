import { app, BrowserWindow } from 'electron';
import { merge } from 'lodash';
import windowStateKeeper from 'electron-window-state';

const isDev = !app.isPackaged;

const DEFAULT_WINDOW_OPTIONS = {
  minWidth: 800,
  minHeight: 600,
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  trafficLightPosition: {
    x: 20,
    y: 32
  },
  webPreferences: {
    contextIsolation: false,
    devTools: isDev,
    spellcheck: false,
    nodeIntegration: true,
    enableRemoteModule: true
  }
};

export default function createWindow(
  options: Electron.BrowserWindowConstructorOptions = {}
) {
  const windowOptions = merge({}, DEFAULT_WINDOW_OPTIONS, options);

  let windowState = windowStateKeeper({
    defaultWidth: windowOptions.minWidth,
    defaultHeight: windowOptions.minHeight
  });

  const win: BrowserWindow = new BrowserWindow({
    ...windowOptions,
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height
  });

  windowState.manage(win);

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  return win;
}
