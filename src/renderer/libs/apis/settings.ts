import { request as baseRequest } from '../promisify-ipc-renderer';

import {
  Settings,
  SetAutoLaunchRequest,
  SetAutoLaunchResponse,
  SetDailyUpdateTimeRequest,
  SetDailyUpdateTimeResponse,
  GetRequest,
  GetResponse
} from '@/shared/protos/settings';

async function request(channel: string, data?: any, timeout?: number) {
  const response = await baseRequest(channel, data, timeout);
  return response.data;
}

export async function setAutoLaunch(data: SetAutoLaunchRequest) {
  return request(
    'settings/set-auto-launch',
    data
  ) as Promise<SetAutoLaunchResponse>;
}

export async function setDailyUpdateTime(data: SetDailyUpdateTimeRequest) {
  return request(
    'settings/set-daily-update-time',
    data
  ) as Promise<SetDailyUpdateTimeResponse>;
}

export async function get(data: GetRequest) {
  return request('settings/get', data) as Promise<GetResponse>;
}
