export type Settings = {
  autoLaunch: boolean;
  dailyUpdateTime: string;
};

export type SetAutoLaunchRequest = { autoLaunch: boolean };
export type SetAutoLaunchResponse = { autoLaunch: boolean };

export type SetDailyUpdateTimeRequest = { dailyUpdateTime: string };
export type SetDailyUpdateTimeResponse = { dailyUpdateTime: string };

export type GetRequest = Record<string, never> | null | undefined;
export type GetResponse = Settings;
