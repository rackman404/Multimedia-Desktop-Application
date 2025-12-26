import {Button, Card, CircularProgress, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongFullscreenOverlayLyricsHandler } from './SongFullscreenOverlayLyricsHandler';
import { SongFullscreenOverlayNextSongHandler } from './SongFullscreenOverlayNextSongHandler';
import { SongFullscreenOverlayVisualizerHandler } from './SongFullscreenOverlayVisualizerHandler';
import { checkTextOverflow } from '../../../../../utils';
import Marquee from 'react-fast-marquee';

type OverlayProps = { //constructor variables
  visible: boolean
};


export const SongFullscreenOverlay = ({visible}:OverlayProps) => { 
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const thumbnailString = useSelectedSongStore((state) => state.thumbnailString);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [nameElement, setNameElement] = useState<HTMLDivElement | null>();
  const [nameMarqueeState, setNameMarqueeState] = useState(false);
    
  //check for overflow and set a marquee if it does
  useEffect(() => {

      if (nameElement != null){
        console.log("CHECKING NAME FOR MAIN");
          setNameMarqueeState(checkTextOverflow(nameElement));
      }
      

  }, [currentSong]);

  //on mount and unmount
  useEffect(() => {



      //called when the component is unmounted
      return () => {
          setNameElement(null);
      };


  }, []);

  //on mount and unmount
  useEffect(() => {
    
    if (visible == true){
      setFirstLoad(false);
    }
    

  }, [visible]);



  return (
    <div className={firstLoad === false ? (visible === false ? 'song_fullscreen_overlay_container_hidden' : 'song_fullscreen_overlay_container') : 'song_fullscreen_overlay_container_hidden_first_load'}>
      <div className='song_fullscreen_content_top_header'>
        <Typography color="white" variant="h4" component="div">
          <div ref={(el) => {setNameElement(el)}} id = "name" className='top_header_text'>
          {nameMarqueeState === true ? 
          <Marquee speed={25} delay={1}>{<div> {currentSong?.name} {" "} | </div>}</Marquee>
          : currentSong?.name}
          </div>
        </Typography>
        
        <Typography color="white" variant="h5" component="div"> {currentSong.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))}</Typography>
        {/*<Typography color="white" variant="h5" component="div"> {currentSong?.album === "N/A" ? "" : (currentSong?.album === currentSong?.name ? "Single" : currentSong?.album)}</Typography>*/}
        <Typography color="white" variant="h5" component="div"> {currentSong?.album === "N/A" ? "" : currentSong?.album}</Typography>
      </div>

      <div className='next_song_header'>
        {<SongFullscreenOverlayNextSongHandler/>}
      </div>

        <div>
        {<SongFullscreenOverlayVisualizerHandler/>}
      </div>
      

      <div className='song_fullscreen_content_main'>



        <div>
          {<SongFullscreenOverlayLyricsHandler translated={false} key={currentSong.id}/>}
        </div>

        <div className={thumbnailString === "" ?  'img_frame_loading' : 'img_frame' } >
          {/* <BottomMusicImageHandler key={currentSong.id}/> */}


              {thumbnailString === "" ? 
                <CircularProgress style={{width:"100%", height:"100%"}}/> 
                : 
                <img
                  width="100%"
                  height="100%"
                  src= {thumbnailString}
                  alt="Song Thumbnail Image"  
                  style={{objectFit: "fill", animation: "fadeIn 0.50s"}}
                />
              }
    


        </div>

        <div >
          {<SongFullscreenOverlayLyricsHandler translated={true} key={currentSong.id}/>}
        </div>



      </div>
    </div>
  );

}