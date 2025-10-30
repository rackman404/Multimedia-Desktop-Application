import { Card, Divider, Typography } from "@mui/material";

import './FFmpegParameters.css';


export const FFmpegParameters = () => { 
    return(
        <Card className='ffmpeg_parameters_card' variant='outlined' sx={{height: '73vh'}}>

            <div  className="ffmpeg_parameters_card_content">
                <Typography variant="h5" component="div" style={{textAlign: "center"}}>Parameters</Typography>
                <Divider orientation="horizontal"/>
            </div>
            

            
        </Card>



    );

}