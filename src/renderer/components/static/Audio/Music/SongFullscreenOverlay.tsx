import {Accordion, AccordionDetails, AccordionSummary, Button, Card, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, ToggleButton, Typography } from '@mui/material';
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
import { IPCMethodAPI, ServicesEnum } from '../../../../../typesIPC';
import { SupportedRomanizationOptions } from '../../../../../types';

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
  const [useJyutping, setJyutping] = useState(SupportedRomanizationOptions.Jyutping);
  const [useForcedRomanizationOverride, setForcedRomanizationOverride] = useState(false);
  const [useAllowedSubstitution, setAllowedSubstitution] = useState(false);

  const currentTranslatedLyricData = useSelectedSongStore((state) => state.currentTranslatedLyricData);
  const currentPhoneticsLyricData = useSelectedSongStore((state) => state.currentPhoneticLyricData);

  const autoTranslateAndRomanize = useSelectedSongStore((state) => state.autoTranslateAndRomanize);
  const setAutoTranslateAndRomanize = useSelectedSongStore((state) => state.setAutoTranslateAndRomanize);


    
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

  

  //on mount and unmount
  useEffect(() => {
    const setInitialState = async () => {
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio,  {service: IPCMethodAPI.AudioTwoWayIPC.getJyutping, content: []}) as SupportedRomanizationOptions;
        setJyutping(result);

        const resultForced = await window.electron.ipcRenderer.invoke(ServicesEnum.audio,  {service: IPCMethodAPI.AudioTwoWayIPC.getForcedRomanizationOverride, content: []}) as boolean;
        setForcedRomanizationOverride(resultForced);

        const resultsub = await window.electron.ipcRenderer.invoke(ServicesEnum.audio,  {service: IPCMethodAPI.AudioTwoWayIPC.getAllowedSubstitution, content: []}) as boolean;
        setForcedRomanizationOverride(resultsub);
    }
    setInitialState()
  }, []);

  //on jyutping change
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(ServicesEnum.audio,  {service: IPCMethodAPI.AudioOneWayIPC.setJyutping, content: [useJyutping]});
  }, [useJyutping]);

  //on forced override change
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(ServicesEnum.audio,  {service: IPCMethodAPI.AudioOneWayIPC.setForcedRomanizationOverride, content: [useForcedRomanizationOverride]});
  }, [useForcedRomanizationOverride]);

  //on forced substitution change
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(ServicesEnum.audio,  {service: IPCMethodAPI.AudioOneWayIPC.setAllowedSubstitution, content: [useAllowedSubstitution]});
  }, [useAllowedSubstitution]);

  const handleRomanizationChange = (event: SelectChangeEvent) => {
    var option = SupportedRomanizationOptions.Indeterminate;
    switch(event.target.value as string){
      case "cantonese":
        option = SupportedRomanizationOptions.Jyutping;
        break;
      case "mandarin":
        option = SupportedRomanizationOptions.Pinyin;
        break;
      case "hokkien":
        option = SupportedRomanizationOptions.Hokkien;
        break;
    }
    setJyutping(option);
  };

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
            <Typography color="white"> Override Option: </Typography>

            <FormControl fullWidth >
                <Select
                  MenuProps={{ //it will be behind everything without this https://stackoverflow.com/questions/56831215/customize-the-z-index-of-the-react-material-ui-select-backdrop 
                      style: {zIndex: 35000}
                  }}
                  labelId="roman-label"
                  id="roman-select"
                  value={useJyutping}
                  label="Romanization"
                  onChange={handleRomanizationChange}
                >
                  <MenuItem value={SupportedRomanizationOptions.Jyutping}>Chinese: Jyutping</MenuItem>
                  <MenuItem value={SupportedRomanizationOptions.Pinyin}>Chinese: Pinyin</MenuItem>
                  <MenuItem value={SupportedRomanizationOptions.Hokkien}>Chinese: Hokkien (Embree)</MenuItem>
                </Select>
              </FormControl>
            <br/>
            <Typography color="white"> Manual Override: <ToggleButton
              value="check"
              selected={useForcedRomanizationOverride}
              onChange={() => setForcedRomanizationOverride((prevSelected) => !prevSelected)}
            >
            </ToggleButton></Typography>
            <br/>
            <Typography color="white"> Allow Substitution: <ToggleButton
              value="check"
              selected={useAllowedSubstitution}
              onChange={() => setAllowedSubstitution((prevSelected) => !prevSelected)}
            >
            </ToggleButton></Typography>
            <br/>
            <Typography color="white"> Fit Cover to Back: <ToggleButton
              value="check"
              selected={showFullImage}
              onChange={() => setShowFullImage((prevSelected) => !prevSelected)}
            >
            </ToggleButton> </Typography> 
            <br/>
            Frontend Data
            <br/>
            <Typography color="white"> Auto Translate and Romanize: <ToggleButton
              value="check"
              selected={autoTranslateAndRomanize}
              onChange={() => setAutoTranslateAndRomanize(!autoTranslateAndRomanize)}
            ></ToggleButton> </Typography> 
 
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
            <div>Romanized: {currentPhoneticsLyricData.lyrics === undefined ? <IndeterminateCheckBoxOutlinedIcon/> : <CheckBoxIcon/>} </div>

            <div> Romanization Type: </div><div>{currentPhoneticsLyricData.romanization === undefined ?  <div> N/A </div> : <Typography color="white"> ({currentPhoneticsLyricData.romanization}) </Typography> } </div>
          </Card>


        </div>
        

        <div >
          {<SongFullscreenOverlayLyricsHandler translated={true} key={currentSong.id}/>}
        </div>



      </div>
    </div>
  );

}