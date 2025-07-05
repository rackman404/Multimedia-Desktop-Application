import { AudioManager } from "./audio_service/audioManager";
import { DiscordManager } from "./discord_service/discordManager";
import { SettingsManager } from "./settings_service/settingsManager";

import { ipcMain } from "electron";

export class ServiceManager {
  discordManager: DiscordManager;
  audioManager: AudioManager;
  settingsManager: SettingsManager;

  constructor() {
    this.discordManager = new DiscordManager();
    this.audioManager = new AudioManager();
    this.settingsManager = new SettingsManager();

    this.IPCCalls();

  }

  IPCCalls(){
    ipcMain.on('audio', async (event, arg) => {
      if (arg != ""){
        this.audioManager.broker.eventOn(event, arg);
      }
      else{
        event.reply('audio', console.log("Undefined ipc one way from bus audio"));
      }

    });

    ipcMain.handle('audio', async (event, arg) => {
        if (arg != ""){
          return this.audioManager.broker.eventHandle(event, arg);
        }
      }

    );

    ipcMain.on('settings', async (event, arg) => {
      if (arg != ""){
        this.settingsManager.broker.eventOn(event, arg);
      }
      else{
        event.reply('settings', console.log("Undefined ipc one way from bus settings"));
      }

    });

    ipcMain.handle('settings', async (event, arg) => {
        if (arg != ""){
          return this.settingsManager.broker.eventHandle(event, arg);
        }
      }
    );

    ipcMain.on('discord', async (event, arg) => {
      if (arg != ""){
        this.discordManager.broker.eventOn(event, arg);
      }
      else{
        event.reply('discord', console.log("Undefined ipc one way from bus discord"));
      }

    });

    ipcMain.handle('discord', async (event, arg) => {
        if (arg != ""){
          return this.discordManager.broker.eventHandle(event, arg);
        }
      }
    );
  }
  
  
}

