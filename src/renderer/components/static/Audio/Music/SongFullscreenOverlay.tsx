import {Button, Card, CircularProgress, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongFullscreenOverlayLyricsHandler } from './SongFullscreenOverlayLyricsHandler';

export const SongFullscreenOverlay = () => { 
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const thumbnailString = useSelectedSongStore((state) => state.thumbnailString);
  //on mount and unmount
  useEffect(() => {

  //called when the component is unmounted
  return () => {

  };
  }, []);


  return (
    <div className='song_fullscreen_overlay_container'>
      <div className='song_fullscreen_content_top_header'>
        <Typography color="white" variant="h3" component="div"> {currentSong?.name}</Typography>
        <Typography color="white" variant="h5" component="div"> {currentSong?.artist}</Typography>
        <Typography color="white" variant="h5" component="div"> {currentSong?.album === "N/A" ? "" : currentSong?.album}</Typography>
      </div>

      <div className='song_fullscreen_content_main'>

        {/* 
        <div className='img_frame'>
          {thumbnailString === "" ? 
            <CircularProgress style={{width:"100%", height:"100%"}}/> 
            : 
            <img
              width="100%"
              height="100%"
              src= {thumbnailString}
              alt="Song Thumbnail Image"  
              style={{objectFit: "contain", animation: "fadeIn 0.50s"}}
            />
          }
 
        </div>
        */}

        <div>
          {<SongFullscreenOverlayLyricsHandler translated={false} key={currentSong.id}/>}
        </div>

        <div className='img_frame' >
          {<BottomMusicImageHandler key={currentSong.id}/>}
        </div>

        <div >
          {<SongFullscreenOverlayLyricsHandler translated={true} key={currentSong.id}/>}
        </div>



      </div>
    </div>
  );

}