import { Button, Card } from "@mui/material";

import './FFmpegButtonPanel.css';
import { IPCMethodAPI, ServicesEnum } from "../../../../typesIPC";


export const FFmpegButtonPanel = () => { 




    return(
        <Card variant='outlined' sx={{height: '20vh'}}>

            <div className="ffmepeg_button_panel_content">
                <Button disabled>Toggle (Disable Overwrite)</Button>

                <Button disabled>Send Converted To Designated Folder</Button>

                <Button disabled>Refresh Files</Button>

            </div>
            

            
        </Card>



    );

}