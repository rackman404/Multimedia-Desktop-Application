import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, CardMedia, Checkbox, Chip, CircularProgress, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import './SongInfoCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import placeholderImage from '../../../../../../assets//music_no_thumbnail.png';
import { SongMetaData, SongMetaDataSimple } from '../../../../../types';
import { fmtMSS } from '../../../../Common';
import { RegularButton } from '../../../../elements/CustomButtons';

type SongInfoProps = { //constructor variables
  sMetaData: SongMetaDataSimple
}




export const SongInfoCard = ({sMetaData} : SongInfoProps) => { 
  const [cover, setCover] = useState<any>(<CardMedia
                    component="img"
                    width="100"
                    height="200"
                    image= {placeholderImage}
                    alt="Song Thumbnail Image"         
                    sx={{objectFit: "contain" }}
                  />);
  const [fullMetaData, setFullMetaData] = useState<SongMetaData>({
  format: sMetaData.metadataFormat,
    fileSize: 0,
    metadataFormat: "",
    id: sMetaData.id,
    name: sMetaData.name,
    length: sMetaData.length,
    artist: sMetaData.artist,
    album: sMetaData.album,
    genre: sMetaData.genre,
    playCount: sMetaData.playCount,
    bitrate: sMetaData.bitrate,
    coverImage: "",
    coverImageFormat: "",
    songRawPath: "",
    comment: "",
  });

  const [progressIndicator, setProgressIndicator] = useState(0);
  const [useProgressIndicator, setUseProgressIndicator] = useState(false);


  const[buttonPanelState, setButtonPanelState] = useState(false);

  //combination of a coroutine and BtoA function, will yield control to main process after doing a small amount of work
  //this prevents any hanging of the application if the binary image data is too big
  //NOTE THIS SHOULD BE TEMPORARY; PROCESSING IMAGE INTO BASE64 SHOULD BE DONE IN BACKEND HOWEVER BY DOING IN THE FRONTEND I CAN LAZYLY LOAD ALL OTHER FULL METADATA
  //WHILE GIVING TIME FOR COVER IMAGE TO LOAD SEPARETLEY 

  //https://stackoverflow.com/questions/38432611/converting-arraybuffer-to-string-maximum-call-stack-size-exceeded
  //https://stackoverflow.com/questions/64814478/how-can-a-javascript-async-function-explicitly-yield-control-at-a-specific-point
  async function _arrayBufferToBase64( buffer: any) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;

      var count = 0;
      var progressCheck = 0;

      var timeTilLoadingIndicator = 0;
      var loadedIndicator = false;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
          count++;
          progressCheck++

          if (count == 20000){
            count = 0;
            timeTilLoadingIndicator++;
            await new Promise((resolve) => setTimeout(resolve)); //more or less yielding back to the main control flow every so often  similar to C# and Java so app doesn't hang 
          }

          if (progressCheck == 100000){
            progressCheck = 0;
            setProgressIndicator(i/len);
          }

          if (timeTilLoadingIndicator > 25 && loadedIndicator == false){
            loadedIndicator = true;
            setUseProgressIndicator(true);
          }
          
      }
      setUseProgressIndicator(false);
      return window.btoa( binary );
  }

  useEffect(() => {

    (async () => {
      if (sMetaData.songRawPath != ""){
        const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", sMetaData.id, sMetaData.songRawPath]) as SongMetaData;
        //console.log("cover image" +  sMetaData?.coverImage);
        //console.log(result);

        setFullMetaData(result);

        var cImg = placeholderImage;
        if(result.coverImage != null){
          cImg = await _arrayBufferToBase64(result.coverImage.data);
          cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
        }

        /* old
        var cImg = placeholderImage;
        if(result.coverImage != null){
          cImg = result.coverImage;
          cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
        }
        */
  
        
        setCover(<CardMedia
                    component="img"
                    width="100"
                    height="200"
                    image= {cImg}
                    alt="Song Thumbnail Image"         
                    sx={{objectFit: "contain" , animation: "fadeIn 0.50s" }}
                  />);
      }
    })();
  }, [sMetaData]);

  React.useEffect(() => {
    if (useProgressIndicator == true){
      setCover(<CircularProgress key={progressIndicator} variant='determinate' size="10vw" value={progressIndicator*100}/>)
    }

  }, [useProgressIndicator, progressIndicator]);

  
  //on mount and unmount
  useEffect(() => {

    //called when the component is unmounted
    return () => {
      setCover(<div/>);
    };
  }, []);

  
    return (
        <div>
            <Card  variant='outlined'  className="card_songinfocard" component={Paper} sx={{ height: "60.5vh", maxWidth: "20vw", maxHeight: "60.5vh"}}>

              <div className='static_button_songinfocard'>              
                <Tooltip title="Hide/Show this panel" placement="right">
                  <RegularButton onClick={() => {buttonPanelState === false ? setButtonPanelState(true) : setButtonPanelState(false)}}>
                  <div style={{font:"1px" }}>{buttonPanelState === false ? "Show" : "Hide"}</div>
                  </RegularButton>
                </Tooltip>
              </div>


              <div className='button_panel_songinfocard' style={buttonPanelState === false ? {translate: "-40vw"} : {}}>
                <Tooltip title="(Do not / do) show thumbnail" placement="right">
                <RegularButton>
                <div style={{font:"1px" }}>Hide Thumbnail</div>
                </RegularButton>
                </Tooltip>

                <Tooltip title="Show the currently playing song's metadata in this panel" placement="right">
                <RegularButton>
                <div style={{font:"1px" }}>Show Playing Song</div>
                </RegularButton>
                </Tooltip>

                <Tooltip title="Open currently selected song in windows file explorer" placement="right">
                <RegularButton>
                <div style={{font:"1px" }}>Open In Windows</div>
                </RegularButton>
                </Tooltip>

                <Tooltip title="(Experimental) (Do not use embedded metadata; instead find metadata for song online) / (Recommended) (use embedded metadata)" placement="right">
                <RegularButton>
                <div style={{font:"1px" }}>Use Online Metadata</div>
                </RegularButton>
                </Tooltip>
              </div>

              <CardContent>
                
                {/* IMAGE METADATA */}
                <Paper  style={{maxHeight: "28.5vh", overflow: 'auto', scrollbarWidth: 'none'}}>
                  <Typography variant="h5" component="div" >{sMetaData?.name}</Typography>
                  {/*https://stackoverflow.com/questions/72212417/make-cardmedia-images-fit-its-content-in-mui-5
                  https://stackoverflow.com/questions/77707763/extract-image-from-mp3-files-inside-browser-using-javascript 
                  */}

                  {cover}
                  
                </Paper>

                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{fullMetaData?.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))}<br/></Typography>
                
                {/* WORDED METADATA */}
                <Divider/>
                <Paper  style={{maxHeight: "32vh", maxWidth:"20vw", overflow: 'auto', scrollbarWidth: 'none'}}>

                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Song Detail<br/></Typography>
                  <div style={{ textAlign: "left", paddingRight: "5px"}}>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Genre: {fullMetaData?.genre} <br/></div> </Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Artist: {fullMetaData?.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))} <br/></div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Album: {fullMetaData?.album} <br/></div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Length: {fmtMSS(sMetaData.length)} Mins <br/></div></Typography>
                  </div>

                  <Divider/>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Technical Detail<br/></Typography>
                  <div style={{ textAlign: "left"}}>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Bitrate: {fullMetaData?.bitrate} kbps</div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Format: {fullMetaData?.format}</div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Embedded Comment: {fullMetaData?.comment}</div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfocard'>File Location: {fullMetaData?.songRawPath}</div></Typography>
                  </div>

                  <Divider/>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Other Detail<br/></Typography>
                  <div style={{ textAlign: "left", padding: "5px"}}>
                    <Typography variant="body2" >Play Count: <br/></Typography>
                    <Typography variant="body2" >Data Added: <br/></Typography>
                    <Typography variant="body2" >Placeholder: <br/></Typography>
                    <Typography variant="body2" >Placeholder: <br/></Typography>
                    <Typography variant="body2" >Placeholder: <br/></Typography>
                    <Typography variant="body2" >Placeholder: <br/></Typography>
                  </div>


                </Paper>
                
              </CardContent>
            </Card>
        </div>

    );



}