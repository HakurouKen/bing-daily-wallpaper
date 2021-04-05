import { App } from 'vue';

enum LOG_LEVEL {
  DEBUG = 'debug',
  LOG = 'log',
  INFO = 'info',
  ERROR = 'error'
}

const LOG_PRIORITY = {
  [LOG_LEVEL.DEBUG]: 0,
  [LOG_LEVEL.LOG]: 1,
  [LOG_LEVEL.INFO]: 2,
  [LOG_LEVEL.ERROR]: 3
};

const delegate = function (ctx: Logger, level: LOG_LEVEL, ...args: any[]) {
  if (LOG_PRIORITY[ctx.logLevel] > LOG_PRIORITY[level]) {
    return;
  }
  const prefixArgs = [`[${level.toUpperCase()}]`];
  if (ctx.module) {
    prefixArgs.unshift(`[${ctx.module}]`);
  }
  console[level](...prefixArgs, ...args);
};

class Logger {
  private _logLevel = LOG_LEVEL.INFO;
  private _module = '';

  constructor(module = '', logLevel?: LOG_LEVEL) {
    this._module = module;
    if (logLevel) {
      this.setLogLevel(logLevel);
    }
  }

  get logLevel() {
    return this._logLevel;
  }

  get module() {
    return this._module;
  }

  setLogLevel(logLevel: LOG_LEVEL) {
    this._logLevel = logLevel;
  }

  debug(...args: any[]) {
    delegate(this, LOG_LEVEL.DEBUG, ...args);
  }

  log(...args: any[]) {
    delegate(this, LOG_LEVEL.LOG, ...args);
  }

  info(...args: any[]) {
    delegate(this, LOG_LEVEL.INFO, ...args);
  }

  error(...args: any[]) {
    delegate(this, LOG_LEVEL.ERROR, ...args);
  }
}

const VuePlugin = {
  install(
    app: App,
    options: { logLevel: LOG_LEVEL } = { logLevel: LOG_LEVEL.INFO }
  ) {
    app.config.globalProperties.$logger = new Logger(
      options.logLevel || LOG_LEVEL.INFO
    );
  }
};

export { LOG_LEVEL, Logger, VuePlugin };
