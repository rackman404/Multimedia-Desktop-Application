import {Button, Card, CircularProgress, Divider, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongLyricAPIData } from '../../../../../types';
import { RegularButton } from '../../../../elements/CustomButtons';
import { IPCMethodAPI, ServicesEnum } from '../../../../../typesIPC';
import { SongVisualizer } from '../../../regular/Audio/Music/SongVisualizer';


type SongFullscreenOverlayVisualizerHandlerProps = { //constructor variables

};

export const SongFullscreenOverlayVisualizerHandler = ({}: SongFullscreenOverlayVisualizerHandlerProps) => { 
 

  return (
    <div className='visualizer_header'>
      <Card className='visualizer_content' style={{background: 'linear-gradient(to right bottom,rgb(3, 3, 3),rgb(49, 49, 49))'}} variant='outlined'>
        <SongVisualizer timeDomain={true}/>
      </Card>
       <Card className='visualizer_content' style={{background: 'linear-gradient(to right bottom,rgb(3, 3, 3),rgb(49, 49, 49))'}} variant='outlined'>
        <SongVisualizer timeDomain={false}/>
      </Card>
      <Typography color="white"> Waveform </Typography>
      <Typography color="white"> Frequency </Typography>
    </div>

    );



}