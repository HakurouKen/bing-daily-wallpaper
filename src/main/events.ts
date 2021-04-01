import Store from 'electron-store';
import { update as updateWallpaper } from './wallpaper';
import { setup } from './crons';
import * as ipc from './helpers/promisify-ipc-main';
import AutoLaunch from 'auto-launch';
import {
  Settings,
  SetAutoLaunchRequest,
  SetAutoLaunchResponse,
  SetDailyUpdateTimeRequest,
  SetDailyUpdateTimeResponse,
  GetResponse
} from '@/shared/protos/settings';

const store = new Store();
const autoLauncher = new AutoLaunch({
  name: 'Bing Daily Wallpaper'
});

const DEFAULT_DAILY_UPDATE_TIME = '00:15';

ipc.register(
  'settings/set-auto-launch',
  async (event, data: SetAutoLaunchRequest): Promise<SetAutoLaunchResponse> => {
    const settings = (store.get('settings') || {}) as Settings;
    settings.autoLaunch = !!data.autoLaunch;
    store.set('settings', settings);
    if (settings.autoLaunch) {
      autoLauncher.enable();
    } else {
      autoLauncher.disable();
    }
    return { autoLaunch: !!data.autoLaunch };
  }
);

ipc.register(
  'settings/set-daily-update-time',
  async (
    event,
    data: SetDailyUpdateTimeRequest
  ): Promise<SetDailyUpdateTimeResponse> => {
    const settings = (store.get('settings') || {}) as Settings;
    settings.dailyUpdateTime =
      data.dailyUpdateTime || DEFAULT_DAILY_UPDATE_TIME;
    setup(settings.dailyUpdateTime, updateWallpaper);
    store.set('settings', settings);
    return { dailyUpdateTime: settings.dailyUpdateTime };
  }
);

ipc.register(
  'settings/get',
  async (): Promise<GetResponse> => {
    const raw = (store.get('settings') || {}) as any;
    return {
      autoLaunch: !!raw.autoLaunch,
      dailyUpdateTime: raw.dailyUpdateTime || DEFAULT_DAILY_UPDATE_TIME
    };
  }
);
