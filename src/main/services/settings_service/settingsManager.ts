import { BrowserWindow } from "electron";
import { SettingsBroker } from "./settingsIPCBroker";

const { session } = require('electron');


export class SettingsManager{
    broker: SettingsBroker;
    window: BrowserWindow | null = null;

    constructor() {
        this.broker = new SettingsBroker(this);
    }

    SetWindow(window: BrowserWindow){
        this.window = window;

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

 

        this.window?.webContents.session.enableNetworkEmulation({
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
        this.window?.setFullScreenable(true);
        this.window?.setFullScreen(stateBool);
        this.window?.setFullScreenable(false);

        console.log("full screened!"); 
    }

} 


