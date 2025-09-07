import * as fs from "fs" 
import path from "path";
import { DefaultSettingParameters, SettingParameters } from "../../types";
import { AudioManager } from "./audio_service/audioManager";
import { DiscordManager } from "./discord_service/discordManager";
import { SettingsManager } from "./settings_service/settingsManager";

import { app, ipcMain } from "electron";
import { CONFIGDIRECTORY, CONFIGFILE} from "../main";
import { ServicesEnum } from "../../typesIPC";

export class ServiceManager {
  discordManager: DiscordManager;
  audioManager: AudioManager;
  settingsManager: SettingsManager;

  constructor() {
    /*
    if (app.isPackaged == false){ 
      //var folderConfigPath = __dirname;
      //folderConfigPath = path.join('_sample_development_folder/sample_config');
      if (!fs.existsSync(DEVELOPMENTCONFIGDIRECTORY)){
        fs.mkdirSync(DEVELOPMENTCONFIGDIRECTORY);

      }

      if (!fs.existsSync(DEVELOPMENTCONFIGFILE)){
        console.log("Config File doesn't exist, creating config");

        var defaultConfig = JSON.stringify(DefaultSettingParameters, null, 1); 
        fs.writeFileSync(DEVELOPMENTCONFIGFILE, defaultConfig); 
        console.log("Config File Successfully created!");
      } 
    }
    else{
      if (!fs.existsSync(PRODUCTIONCONFIGDIRECTORY)){
        fs.mkdirSync(PRODUCTIONCONFIGDIRECTORY);

      }
      if (!fs.existsSync(PRODUCTIONCONFIGFILE)){
        var defaultConfig = JSON.stringify(DefaultSettingParameters, null, 1); 
          fs.writeFileSync(PRODUCTIONCONFIGFILE, defaultConfig); 
          console.log("The file was saved!");
      }; 
    }
    */

    if (!fs.existsSync(CONFIGDIRECTORY)){
      fs.mkdirSync(CONFIGDIRECTORY);

    }

    if (!fs.existsSync(CONFIGFILE)){
      console.log("Config File doesn't exist, creating config");

      var defaultConfig = JSON.stringify(DefaultSettingParameters, null, 1); 
      fs.writeFileSync(CONFIGFILE, defaultConfig); 
      console.log("Config File Successfully created!");
    } 
    

    this.discordManager = new DiscordManager();
    this.audioManager = new AudioManager();
    this.settingsManager = new SettingsManager();



    this.IPCCalls();

  }

  SetupApplication(){ //should be called in main when windows was created
    /*
    if (app.isPackaged == false){ 
      var configFile = fs.readFileSync(DEVELOPMENTCONFIGFILE);
      var jsonConfig = JSON.parse(configFile.toString()) as SettingParameters;
    }
    else{
      var configFile = fs.readFileSync(PRODUCTIONCONFIGFILE);
      var jsonConfig = JSON.parse(configFile.toString()) as SettingParameters;
    }
    */

    var configFile = fs.readFileSync(CONFIGFILE);
    var jsonConfig = JSON.parse(configFile.toString()) as SettingParameters;

    this.settingsManager.SetFullscreen(jsonConfig.GeneralSettings.fullscreenState.toString());
    this.settingsManager.SetNetwork(jsonConfig.GeneralSettings.networkState.toString());

    if (jsonConfig.GeneralSettings.discordRichPresenceState == true){
      this.discordManager.enableClient();
    }
    
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

    ipcMain.on(ServicesEnum.settings , async (event, arg) => {
      if (arg != ""){
        this.settingsManager.broker.eventOn(event, arg);
      }
      else{
        event.reply('settings', console.log("Undefined ipc one way from bus settings"));
      }

    });

    ipcMain.handle(ServicesEnum.settings , async (event, arg) => {
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

