import { app, BrowserWindow } from 'electron';
import { merge } from 'lodash';
import windowStateKeeper from 'electron-window-state';

const isDev = !app.isPackaged;

const DEFAULT_WINDOW_OPTIONS = {
  width: 400,
  height: 300,
  resizable: isDev,
  minimizable: false,
  maximizable: false,
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

  const windowState = windowStateKeeper({
    defaultWidth: windowOptions.width,
    defaultHeight: windowOptions.height
  });

  const win: BrowserWindow = new BrowserWindow({
    ...windowOptions,
    x: windowState.x,
    y: windowState.y,
    width: isDev ? windowState.width : windowOptions.width,
    height: isDev ? windowState.height : windowOptions.height
  });

  windowState.manage(win);

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  return win;
}
