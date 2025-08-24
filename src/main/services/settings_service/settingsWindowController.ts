import { BrowserWindow } from "electron";
import { SettingsBroker } from "./settingsIPCBroker";

const { session } = require('electron');


export class SettingsWindowController{

    constructor() {
    }

    async SetFullscreen(state: boolean, window: BrowserWindow){

        window.setFullScreenable(true);
        window.setFullScreen(state);
        window.setFullScreenable(false);

        console.log("full screened!"); 
    }

} 


