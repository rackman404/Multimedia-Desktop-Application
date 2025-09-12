import { Button, Card } from "@mui/material";
import { SongVisualizer } from "./SongVisualizer";

import './SongVisualizerCard.css';
import { useEffect, useState } from "react";

export const SongVisualizerCard = () => { 
    const [isWaveform, setIsWaveform] = useState<boolean>(true);


    return (
        <Card className='visualizer_card' variant='outlined'>
            <div className='visualizer_card_content'>
                <SongVisualizer timeDomain={isWaveform}/>
            </div>
            <Button onClick = {() => setIsWaveform(!isWaveform)} className='visualizer_card_button'>{isWaveform === true ? "Waveform" : "Frequency"}</Button>
            <div className='visualizer_card_button'> teTESTETSst</div>
        </Card>
       
    );



}