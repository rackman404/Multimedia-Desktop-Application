import { Button, Card } from "@mui/material";

import './FFmpegButtonPanel.css';
import { IPCMethodAPI, ServicesEnum } from "../../../../typesIPC";


export const FFmpegButtonPanel = () => { 




    return(
        <Card variant='outlined' sx={{height: '20vh'}}>

            <div className="ffmepeg_button_panel_content">
                

                <Button disabled>Toggle (Place Converted In Music Folder)</Button>

                <Button disabled>Toggle (Disable Overwrite)</Button>

            </div>
            

            
        </Card>



    );

}