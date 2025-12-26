import {Button, Card, CircularProgress, Divider, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { DEFAULTSONGMETADATASIMPLE, SongLyricAPIData, SongMetaDataSimple } from '../../../../../types';
import { SongVisualizer } from '../../../regular/Audio/Music/SongVisualizer';
import { checkTextOverflow } from '../../../../../utils';
import Marquee from 'react-fast-marquee';


export const SongFullscreenOverlayNextSongHandler = () => { 
  const currentlySelectedSongList = useSelectedSongStore((state) => state.currentlySelectedSongList);
  
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const [nextSong, setNextSong] = useState({} as SongMetaDataSimple);

  const activeSongListStateStored = useSelectedSongStore((state) => state.activeSongListState);

  const [nameElement, setNameElement] = useState<HTMLDivElement | null>();
  const [nameMarqueeState, setNameMarqueeState] = useState(false);
  
  //check for overflow and set a marquee if it does
  useEffect(() => {

      if (nameElement != null && nextSong != null){
        console.log("CHECKING NAME " + nextSong);
          setNameMarqueeState(checkTextOverflow(nameElement));
      }
      

  }, [nameElement, nextSong]);

  //on mount and unmount
  useEffect(() => {

      //called when the component is unmounted
      return () => {
          setNameElement(null);
      };
  }, []);

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
        <Typography color="white">
          <div ref={(el) => {setNameElement(el)}} id = "name" className='next_song_header_text'>
          {nameMarqueeState === true ? 
          <Marquee speed={25} delay={1}>{<div> {nextSong.name} {" "} | </div>}</Marquee>
          : nextSong.name}
          </div>
        </Typography>

        <Typography color="grey"> {nextSong.artist} </Typography>
      
      {/*
       <Typography color="white"> {nextSong.name} </Typography>
        <br/>
       <Typography color="grey"> {nextSong.artist} </Typography>
       */}
    </div>

    
    );



}