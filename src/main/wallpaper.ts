import * as path from 'path';
import { outputFile, readdir } from 'fs-extra';
import filenamify from 'filenamify';
import wallpaper from 'wallpaper';
import { app } from 'electron';
import request from './helpers/request';

async function downloadWallpaper(folder: string) {
  const response = await request.request({
    url: `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&pid=hp&uhd=1&uhdwidth=3840&uhdheight=2160`,
    timeout: 3100
  });
  const image = response.data.images[0];
  const filename = filenamify(`${image.enddate} - ${image.copyright}.jpg`, {
    replacement: ' ',
    maxLength: 255
  });

  const raw = await request.request({
    url: `https://cn.bing.com${image.url}`,
    responseType: 'arraybuffer'
  });

  return outputFile(path.join(folder, filename), Buffer.from(raw.data), {
    encoding: null
  });
}

function getDate(t: number | Date) {
  const time = new Date(t);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const normalize = (n: number) => (n > 9 ? n.toString() : `0${n}`);

  return `${y}${normalize(m)}${normalize(d)}`;
}

async function setWallpaper(folder: string, t: number | Date = Date.now()) {
  const files = await readdir(folder);
  const time = getDate(t);
  const file = files.find((f) => f.startsWith(time));
  if (!file) {
    throw new Error(`File not found`);
  }
  return wallpaper.set(path.join(folder, file));
}

const download = path.join(app.getAppPath(), 'wallpapers');

async function update() {
  await downloadWallpaper(download);
  await setWallpaper(download);
}

export { update };
