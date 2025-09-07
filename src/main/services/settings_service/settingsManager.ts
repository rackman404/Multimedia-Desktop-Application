import { app, BrowserWindow} from "electron";
import { SettingsBroker } from "./settingsIPCBroker";
import { SettingsWindowController } from "./settingsWindowController";
import { SettingParameters, ViewState } from "../../../types";

const { session } = require('electron');
import * as fs from "fs" 
import { CONFIGFILE} from "../../main";


export class SettingsManager{
    broker: SettingsBroker;
    mainWindow: BrowserWindow | undefined = undefined;

    windowController: SettingsWindowController;

    parameters: SettingParameters;

    constructor() {
        this.broker = new SettingsBroker(this);
        this.windowController = new SettingsWindowController();

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

        this.parameters = jsonConfig;
    }

    #SaveSettings(){
        var configString = JSON.stringify(this.parameters, null, 1); 
        fs.writeFileSync(CONFIGFILE, configString); 
        console.log("Saved Config File!");
    }

    SetWindow(window: BrowserWindow){
        this.mainWindow = window;

        console.log("window was set in settings manager");
    }


    //true online, false offline
    async SetNetwork(state: string){
        

        var stateBool: boolean;
        if (state == "true"){
            stateBool = true;
            console.log("internet connection altered to online!");

            
        }
        else{
            stateBool = false;
        }

        this.parameters.GeneralSettings.networkState = stateBool;

        this.mainWindow?.webContents.session.enableNetworkEmulation({
            offline: stateBool,
        });

        this.#SaveSettings();
    } 

    async SetFullscreen(state: string){
        var stateBool: boolean;
        if (state == "true"){
            stateBool = true;
        }
        else{
            stateBool = false;
        }

        if (this.mainWindow != undefined){
            console.log("(SettingsManager.ts) now setting full screen state to " + stateBool);
            this.windowController.SetFullscreen(stateBool, this.mainWindow);
        }

        this.parameters.GeneralSettings.fullscreenState = stateBool;

        this.#SaveSettings();
    }
    
    async SetDeepLKey(key: string){
        this.parameters.MusicSettings.DeepLKey = key

        this.#SaveSettings();
    }


    async GetParameters(): Promise<SettingParameters>{
        return this.parameters;
    }

    async ExitApplication(){
        app.quit();
    }

} 


