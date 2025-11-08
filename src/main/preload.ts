// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ServicesEnum } from '../typesIPC';
import { off } from 'process';

//export type Channels = 'ipc-example' | 'audio' | 'discord' | 'settings';
export type Channels = ServicesEnum;
//export type Channels = Services;

/*
export enum Channels {
  audio = "audio",
  settings = "settings",
  discord = "discord",
  ipcExample = "ipc-example"
}
*/

//export type Channels = `${ChannelsEnum}`;


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    },

    off(channel: Channels, listener: (event: IpcRendererEvent, ...args: any[]) => void){
      ipcRenderer.removeListener(channel, listener)
    },
    removeAllListeners(channel: Channels){
      ipcRenderer.removeAllListeners(channel);
    },
  },
  
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
