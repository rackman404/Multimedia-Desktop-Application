import {Button, Card, CircularProgress, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongFullscreenOverlayLyricsHandler } from './SongFullscreenOverlayLyricsHandler';
import { SongFullscreenOverlayNextSongHandler } from './SongFullscreenOverlayNextSongHandler';

type OverlayProps = { //constructor variables
  visible: boolean
};


export const SongFullscreenOverlay = ({visible}:OverlayProps) => { 
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const thumbnailString = useSelectedSongStore((state) => state.thumbnailString);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  //on mount and unmount
  useEffect(() => {
    
    if (visible == true){
      setFirstLoad(false);
    }
    

  }, [visible]);



  return (
    <div className={firstLoad === false ? (visible === false ? 'song_fullscreen_overlay_container_hidden' : 'song_fullscreen_overlay_container') : 'song_fullscreen_overlay_container_hidden_first_load'}>
      <div className='song_fullscreen_content_top_header'>
        <Typography color="white" variant="h3" component="div"> {currentSong?.name}</Typography>
        <Typography color="white" variant="h5" component="div"> {currentSong.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))}</Typography>
        {/*<Typography color="white" variant="h5" component="div"> {currentSong?.album === "N/A" ? "" : (currentSong?.album === currentSong?.name ? "Single" : currentSong?.album)}</Typography>*/}
        <Typography color="white" variant="h5" component="div"> {currentSong?.album === "N/A" ? "" : currentSong?.album}</Typography>
      </div>

      <div className='next_song_header'>
        {<SongFullscreenOverlayNextSongHandler/>}
      </div>
      

      <div className='song_fullscreen_content_main'>



        <div>
          {<SongFullscreenOverlayLyricsHandler translated={false} key={currentSong.id}/>}
        </div>

        <div className='img_frame' >
          {/* <BottomMusicImageHandler key={currentSong.id}/> */}

          { 
            <div>
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
          }

        </div>

        <div >
          {<SongFullscreenOverlayLyricsHandler translated={true} key={currentSong.id}/>}
        </div>



      </div>
    </div>
  );

}