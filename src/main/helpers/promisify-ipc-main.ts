import { ipcMain, IpcMainEvent } from 'electron';

export function register(
  name: string,
  callback: (event: IpcMainEvent, args: any) => Promise<any>
) {
  ipcMain.on(
    `promisify:${name}`,
    async (event, args: { id: string; data: any }) => {
      const { id, data } = args;
      try {
        const response = await callback(event, data);
        event.reply(`promisify:${name}`, { id, error: null, data: response });
      } catch (e) {
        event.reply(`promisify:${name}`, { id, error: e, data: null });
      }
    }
  );
}
