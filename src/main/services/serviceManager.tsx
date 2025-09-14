import * as fs from "fs" 
import path from "path";
import { DefaultMiscData, DefaultSettingParameters, SettingParameters } from "../../types";
import { AudioManager } from "./audio_service/audioManager";
import { DiscordManager } from "./discord_service/discordManager";
import { SettingsManager } from "./settings_service/settingsManager";

import { app, ipcMain } from "electron";
import { CONFIGDIRECTORY, CONFIGFILE, DATABASEFILE, MISCDATAFILE} from "../main";
import { ServicesEnum } from "../../typesIPC";
import { UtilityManager } from "./utility/utilityManager";

const sqlite3 = require('sqlite3');

export class ServiceManager {
  discordManager: DiscordManager;
  audioManager: AudioManager;
  settingsManager: SettingsManager;
  utilityManager: UtilityManager;

  database: any;

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

    if (!fs.existsSync(MISCDATAFILE)){
      console.log("misc data File doesn't exist, creating data file");

      var defaultData = JSON.stringify(DefaultMiscData, null, 1); 
      fs.writeFileSync(MISCDATAFILE, defaultData); 
      console.log("Data File Successfully created!");
    } 

    
    //if (!fs.existsSync(DATABASEFILE)){
      //console.log("database file does not exist, creating new database file ");

      this.database = new sqlite3.Database(DATABASEFILE); //i believe that the library will attempt to create a new db file it doesn't exist, else will use existing one
    //} 

    

    this.discordManager = new DiscordManager();
    this.audioManager = new AudioManager();
    this.settingsManager = new SettingsManager();
    this.utilityManager = new UtilityManager();

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

    this.settingsManager.SetFullscreen(!jsonConfig.GeneralSettings.fullscreenState);
    this.settingsManager.SetNetwork(jsonConfig.GeneralSettings.networkState);

    if (jsonConfig.GeneralSettings.discordRichPresenceState == true){
      this.discordManager.enableClient();
    }
    
  }

  IPCCalls(){
    ipcMain.on(ServicesEnum.audio, async (event, arg) => {
      if (arg != ""){
        this.audioManager.broker.eventOn(event, arg);
      }
      else{
        event.reply(ServicesEnum.audio, console.log("Undefined ipc one way from bus audio"));
      }

    });

    ipcMain.handle(ServicesEnum.audio, async (event, arg) => {
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
        event.reply(ServicesEnum.settings, console.log("Undefined ipc one way from bus settings"));
      }

    });

    ipcMain.handle(ServicesEnum.settings , async (event, arg) => {
        if (arg != ""){
          return this.settingsManager.broker.eventHandle(event, arg);
        }
      }
    );

    ipcMain.on(ServicesEnum.discord, async (event, arg) => {
      if (arg != ""){
        this.discordManager.broker.eventOn(event, arg);
      }
      else{
        event.reply(ServicesEnum.discord, console.log("Undefined ipc one way from bus discord"));
      }

    });

    ipcMain.handle(ServicesEnum.discord, async (event, arg) => {
        if (arg != ""){
          return this.discordManager.broker.eventHandle(event, arg);
        }
      }
    );

    ipcMain.on(ServicesEnum.utility, async (event, arg) => {
      if (arg != ""){
        this.utilityManager.broker.eventOn(event, arg);
      }
      else{
        event.reply(ServicesEnum.utility, console.log("Undefined ipc one way from utility discord"));
      }

    });

    ipcMain.handle(ServicesEnum.utility, async (event, arg) => {
        if (arg != ""){
          return this.utilityManager.broker.eventHandle(event, arg);
        }
      }
    );
  }
  
  
}

