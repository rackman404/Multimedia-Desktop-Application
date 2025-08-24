import { BrowserWindow } from "electron";
import { SettingsBroker } from "./settingsIPCBroker";
import { SettingsWindowController } from "./settingsWindowController";
import { SettingParameters, ViewState } from "../../../types";

const { session } = require('electron');


export class SettingsManager{
    broker: SettingsBroker;
    mainWindow: BrowserWindow | undefined = undefined;

    windowController: SettingsWindowController;

    parameters: SettingParameters;

    constructor() {
        this.broker = new SettingsBroker(this);
        this.windowController = new SettingsWindowController();

        //default values
        this.parameters = {
                viewState: ViewState.Dashboard,
            
                //main window settings
                fullscreenState: false,
                networkState: true,
            
                //misc settings
                discordRichPresenceState: false

        } as SettingParameters;
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

 

        this.mainWindow?.webContents.session.enableNetworkEmulation({
            offline: stateBool,
        });
        
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
            this.windowController.SetFullscreen(stateBool, this.mainWindow);
        }
    }


    async GetParameters(): Promise<SettingParameters>{
        return this.parameters;
    }

} 


