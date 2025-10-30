import { Button, Card } from "@mui/material";

import './FFmpegButtonPanel.css';


export const FFmpegButtonPanel = () => { 
    return(
        <Card variant='outlined' sx={{height: '20vh'}}>

            <div className="ffmepeg_button_panel_content">
                <Button>Convert</Button>

                <Button>Placeholder 1</Button>

                <Button>Placeholder 2</Button>

            </div>
            

            
        </Card>



    );

}