import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, CardMedia, Checkbox, Chip, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongInfoCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import placeholderImage from '../../../../../../assets/icons/256x256.png';
import { SongMetaData, SongMetaDataSimple } from '../../../../../types';
import { fmtMSS } from '../../../../Common';

type SongInfoProps = { //constructor variables
  sMetaData: SongMetaDataSimple
}




export const SongInfoCard = ({sMetaData} : SongInfoProps) => { 
  const [cover, setCover] = useState<string>(placeholderImage);
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

  const [progressIndicator, setProgressIndicator] = useState(<div/>);

  //combination of a coroutine and BtoA function, will yield control to main process after doing a small amount of work
  //this prevents any hanging of the application if the binary image data is too big
  //NOTE THIS SHOULD BE TEMPORARY; PROCESSING IMAGE INTO BASE64 SHOULD BE DONE IN BACKEND HOWEVER BY DOING IN THE FRONTEND I CAN LAZYLY LOAD ALL OTHER FULL METADATA
  //WHILE GIVING TIME FOR COVER IMAGE TO LOAD SEPARETLEY 

  //https://stackoverflow.com/questions/38432611/converting-arraybuffer-to-string-maximum-call-stack-size-exceeded
  //https://stackoverflow.com/questions/64814478/how-can-a-javascript-async-function-explicitly-yield-control-at-a-specific-point
  async function _arrayBufferToBase64( buffer: any, setIndicatorFunc: any ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;

      var count = 0;
      var timeTilLoadingIndicator = 0;
      var loadedIndicator = false;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
          count++;

          if (count == 30000){ //
            count = 0;
            timeTilLoadingIndicator++;
            await new Promise((resolve) => setTimeout(resolve));
          }

          if (timeTilLoadingIndicator > 25 && loadedIndicator == false){
            loadedIndicator = true;
            setIndicatorFunc(<LinearProgress/>);
          }
          
      }
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
          cImg = await _arrayBufferToBase64(result.coverImage.data, setProgressIndicator);
          cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
        }

        /* old
        var cImg = placeholderImage;
        if(result.coverImage != null){
          cImg = result.coverImage;
          cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
        }
        */
  
        
        setCover(cImg);
      }
      setProgressIndicator(<div/>)
    })();


  }, [sMetaData]);

  
    return (
        <div>
            <Card  variant='outlined'  className="card_songinfocard" component={Paper} sx={{ height: "60.5vh", maxWidth: "20vw", maxHeight: "60.5vh"}}>
              <CardContent>

                {progressIndicator}

                <Paper  style={{maxHeight: "28.5vh", overflow: 'auto', scrollbarWidth: 'none'}}>
                  <Typography variant="h5" component="div" >{sMetaData?.name}</Typography>
                  
                  {/*https://stackoverflow.com/questions/72212417/make-cardmedia-images-fit-its-content-in-mui-5
                  https://stackoverflow.com/questions/77707763/extract-image-from-mp3-files-inside-browser-using-javascript 
                  */}
                  <CardMedia
                    component="img"
                    width="100"
                    height="200"
                    image= {cover}
                    alt="Song Thumbnail Image"         
                    sx={{objectFit: "contain" }}
                  />
                </Paper>

                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{fullMetaData?.artist}<br/></Typography>
                
                <Divider/>
                <Paper  style={{maxHeight: "32vh", maxWidth:"20vw", overflow: 'auto', scrollbarWidth: 'none'}}>

                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Song Detail<br/></Typography>
                  <div style={{ textAlign: "left", paddingRight: "5px"}}>
                    <Typography variant="body2" >Genre: {fullMetaData?.genre}<br/></Typography>
                    <Typography variant="body2" >Artist: {fullMetaData?.artist}<br/></Typography>
                    <Typography variant="body2" >Album: {fullMetaData?.album}<br/></Typography>
                    <Typography variant="body2" >Length: {fmtMSS(sMetaData.length)} Mins<br/></Typography>
                  </div>

                  <Divider/>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Technical Detail<br/></Typography>
                  <div style={{ textAlign: "left"}}>
                    <Typography variant="body2" >Bitrate: {fullMetaData?.bitrate} kbps<br/></Typography>
                    <Typography variant="body2" >Format: {fullMetaData?.format}<br/></Typography>
                    <Typography variant="body2" >Embedded Comment: {fullMetaData?.comment}<br/></Typography>
                    <Typography variant="body2" >File Location: {fullMetaData?.songRawPath} <br/></Typography>
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