import { Button, Card, Divider, Typography } from "@mui/material";

import './FFmpegConsoleLog.css';
import { ServicesEnum } from "../../../../typesIPC";


export const FFmpegConsoleLog = () => { 




    return(
        <Card className='console_log_card' variant='outlined' sx={{height: '20vh'}}>

            

            <div className="console_log_card_header">
                <Typography variant="h5" component="div" style={{textAlign: "left"}}>Console Log</Typography>
                <div className="console_log_card_header">

                    <Typography component="div" >Status: Idle</Typography>   
     
                    <Button>
                        Clear Logs
                    </Button>
                    
                </div>  
            </div>

            <Divider/>
            
            <div className='console_log_card_content' >


                
            </div>
            
            

            
        </Card>



    );

}