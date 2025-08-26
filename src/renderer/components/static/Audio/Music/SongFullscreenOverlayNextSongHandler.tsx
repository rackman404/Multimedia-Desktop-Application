import {Button, Card, CircularProgress, Divider, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { SongLyricAPIData, SongMetaDataSimple } from '../../../../../types';


export const SongFullscreenOverlayNextSongHandler = () => { 
  const currentSongList = useSelectedSongStore((state) => state.allSongMetaData);
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const [nextSong, setNextSong] = useState({} as SongMetaDataSimple);

  useEffect(() => {
    if (currentSongList != undefined){
      if (currentSongList[currentSong.id + 1] != undefined){
        setNextSong(currentSongList[currentSong.id + 1]);
      }
    }
    
  }, [currentSong]);
  

  


  return (
    <div>
       <Typography color="white"> Coming Up Next:</Typography>
       <br/>
       <Typography color="white"> {nextSong.name} </Typography>
        <br/>
       <Typography color="grey"> {nextSong.artist} </Typography>
    </div>
    );



}