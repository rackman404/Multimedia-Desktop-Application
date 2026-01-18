import {Accordion, AccordionDetails, AccordionSummary, Button, Card, CircularProgress, ToggleButton, Typography } from '@mui/material';
import './SongFullscreenOverlay.css';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { useEffect, useState } from 'react';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';
import { SongFullscreenOverlayLyricsHandler } from './SongFullscreenOverlayLyricsHandler';
import { SongFullscreenOverlayNextSongHandler } from './SongFullscreenOverlayNextSongHandler';
import { SongFullscreenOverlayVisualizerHandler } from './SongFullscreenOverlayVisualizerHandler';
import { checkTextOverflow } from '../../../../../utils';
import Marquee from 'react-fast-marquee';

import placeholderImage from '../../../../../../assets//gray.png';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';

type OverlayProps = { //constructor variables
  visible: boolean
};


export const SongFullscreenOverlay = ({visible}:OverlayProps) => { 
  const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

  const thumbnailString = useSelectedSongStore((state) => state.thumbnailString);

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [nameElement, setNameElement] = useState<HTMLDivElement | null>();
  const [nameMarqueeState, setNameMarqueeState] = useState(false);

  const [showFullImage, setShowFullImage] = useState(false);

  const currentTranslatedLyricData = useSelectedSongStore((state) => state.currentTranslatedLyricData);
  const currentPhoneticsLyricData = useSelectedSongStore((state) => state.currentPhoneticLyricData);
    
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
      <div className= "song_fullscreen_full_image">
        { showFullImage === true ? <img
            width="100%"
            height="100%"
            src= {thumbnailString === "" ? placeholderImage : thumbnailString}
            alt="Song Thumbnail Image"  
            style={{objectFit: "fill", animation: "fadeIn 0.50s"}}
          />
          : <div/>
        }
      </div>
      
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

      
      <div className='accordion_settings_header'>
        <Accordion >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            >
            <Typography component="span">Settings</Typography>
          </AccordionSummary>
          
          <AccordionDetails>
            <Typography color="white"> Chinese Romanization Preference:</Typography>
            <br/>
            <Typography color="white"> Manual Override:</Typography>
            <br/>
            <Typography color="white"> Fit Cover to Back: </Typography> 
            <ToggleButton
              value="check"
              selected={showFullImage}
              onChange={() => setShowFullImage((prevSelected) => !prevSelected)}
            >
            <CheckIcon />
            </ToggleButton>
          </AccordionDetails>
        </Accordion>
      </div>
      
      
      

      <div className='song_fullscreen_content_main'>

        <div>
          {<SongFullscreenOverlayLyricsHandler translated={false} key={currentSong.id}/>}
        </div>
        
        <div className='song_fullscreen_content_main_center_container'>
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
                  style={{objectFit: "cover", animation: "fadeIn 0.50s"}}
                />
              }
    


          </div>

          <Card variant='outlined' className='song_fullscreen_content_main_bottom_card'>
            <div>Translated: {currentTranslatedLyricData.lyrics === undefined ? <IndeterminateCheckBoxOutlinedIcon/> : <CheckBoxIcon/>} </div>
            <div>Status</div>
            <div>Romanized: {currentPhoneticsLyricData.lyrics === undefined ? <IndeterminateCheckBoxOutlinedIcon/> : <CheckBoxIcon/>} </div>
          </Card>


        </div>
        

        <div >
          {<SongFullscreenOverlayLyricsHandler translated={true} key={currentSong.id}/>}
        </div>



      </div>
    </div>
  );

}