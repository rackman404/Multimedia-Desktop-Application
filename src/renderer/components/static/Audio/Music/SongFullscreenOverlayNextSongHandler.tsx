import {Button, Card, CircularProgress, Divider, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { DEFAULTSONGMETADATASIMPLE, SongLyricAPIData, SongMetaDataSimple } from '../../../../../types';


export const SongFullscreenOverlayNextSongHandler = () => { 
  const currentlySelectedSongList = useSelectedSongStore((state) => state.currentlySelectedSongList);
  
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const [nextSong, setNextSong] = useState({} as SongMetaDataSimple);


  const activeSongListStateStored = useSelectedSongStore((state) => state.activeSongListState);

  useEffect(() => {
    console.log("selected song list was changed to :" + activeSongListStateStored.toString());

    if (currentlySelectedSongList != null){
      if (currentlySelectedSongList[currentSong.id + 1] != null){
        setNextSong(currentlySelectedSongList[currentSong.id + 1]);
      }
      else{
        console.log("Setting default song metadata simple (empty)");
        setNextSong(DEFAULTSONGMETADATASIMPLE);
      }
    }
    else{
      console.log("Setting default song metadata simple (empty)");
      setNextSong(DEFAULTSONGMETADATASIMPLE);
    }
    
  }, [currentSong, currentlySelectedSongList]);
  

  


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