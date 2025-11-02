import { Button, Card } from "@mui/material";

import './FFmpegButtonPanel.css';
import { IPCMethodAPI, ServicesEnum } from "../../../../typesIPC";


export const FFmpegButtonPanel = () => { 


    async function StartConversion(){
        window.electron.ipcRenderer.sendMessage(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditOneWayIPC.convertSong, content: [true]});  
    }


    return(
        <Card variant='outlined' sx={{height: '20vh'}}>

            <div className="ffmepeg_button_panel_content">
                <Button onClick={() => StartConversion()}>Convert</Button>

                <Button>Toggle (Place Converted In Music Folder)</Button>

                <Button>Toggle (Disable Overwrite)</Button>

            </div>
            

            
        </Card>



    );

}