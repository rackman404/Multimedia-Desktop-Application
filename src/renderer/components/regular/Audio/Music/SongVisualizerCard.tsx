import { Card } from "@mui/material";
import { SongVisualizer } from "./SongVisualizer";

import './SongVisualizerCard.css';

export const SongVisualizerCard = () => { 
 

    return (
        <Card className='visualizer_card_content' variant='outlined'>
            <SongVisualizer timeDomain={true}/>
        </Card>
    );



}