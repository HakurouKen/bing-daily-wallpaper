import { IpcRendererEvent } from 'electron';
// @Hack: Use `require` to skip vite bundle.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron');

function uuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class TimeoutError extends Error {
  constructor(timeout?: number, message?: string) {
    let fullErrorMessage = `request timeout`;
    if (timeout) {
      fullErrorMessage += ` of ${timeout}ms exceeded`;
    }
    if (message) {
      fullErrorMessage += `, ${message}`;
    }
    super(`${fullErrorMessage}.`);
  }
}

type IpcCallbackItem = {
  id: string;
  resolve: (data: any) => void;
  reject: (error: Error) => void;
};

const listeners: {
  [key: string]: {
    callbacks: IpcCallbackItem[];
    listener: (
      event: Electron.IpcRendererEvent,
      response: { id: string; error: Error | null; data: any }
    ) => void;
  };
} = {};

function callbackResolve(
  channel: string,
  event: IpcRendererEvent | null,
  response: { id: string; error: Error | null; data: any }
) {
  const { id, error, data } = response;
  if (!listeners[channel]) {
    return;
  }
  const { callbacks } = listeners[channel];
  const callback = callbacks.find((item) => item.id === id);
  if (!callback) {
    // callback uuid mismatch
    return;
  }
  listeners[channel].callbacks = listeners[channel].callbacks.filter(
    (cb) => cb !== callback
  );
  const { resolve, reject } = callback;
  if (error) {
    reject(error);
  } else {
    resolve({ id, event, data });
  }
}

function addListener(channel: string) {
  if (listeners[channel]) {
    return;
  }
  const listener = (
    event: Electron.IpcRendererEvent,
    response: { id: string; error: Error | null; data: any }
  ) => {
    callbackResolve(channel, event, response);
  };
  listeners[channel] = { listener, callbacks: [] };
  ipcRenderer.on(`promisify:${channel}`, listener);
  return listener;
}

type RequestResolver = Promise<{
  id: string;
  event: IpcRendererEvent;
  data: any;
}>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function request(channel: string, data?: any, timeout = 3000): RequestResolver {
  let _resolve: (value: any) => void = noop;
  let _reject: (reason?: Error) => void = noop;
  const done = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });
  const id = uuidV4();
  if (!listeners[channel]) {
    addListener(channel);
  }
  if (listeners[channel]) {
    listeners[channel].callbacks.push({
      id,
      resolve: _resolve,
      reject: _reject
    });
  }
  if (timeout) {
    setTimeout(() => {
      callbackResolve(channel, null, {
        id,
        error: new TimeoutError(timeout, channel),
        data: null
      });
    }, timeout);
  }
  ipcRenderer.send(`promisify:${channel}`, { id, data });
  return done as RequestResolver;
}

export { request };
