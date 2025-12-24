import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, CardMedia, Checkbox, Chip, CircularProgress, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import './SongInfoHorizontalCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import placeholderImage from '../../../../../assets/music_no_thumbnail.png';
import { DEFAULTSONGMETADATA, SongLyricAPIData, SongMetaData, SongMetaDataSimple } from '../../../../types';
import { fmtMSS } from '../../../Common';
import { RegularButton } from '../../../elements/CustomButtons';
import { IPCMethodAPI, ServicesEnum } from '../../../../typesIPC';

type SongInfoHorizontalProps = { //constructor variables
  sMetaDataFull: SongMetaData
}


export const SongInfoHorizontalCard = ({sMetaDataFull} : SongInfoHorizontalProps) => { 
  const [cover, setCover] = useState<any>(<CardMedia
                    component="img"
                    width="100"
                    height="200"
                    image= {placeholderImage}
                    alt="Song Thumbnail Image"         
                    sx={{objectFit: "contain" }}
                  />);

  const [progressIndicator, setProgressIndicator] = useState(0);
  const [useProgressIndicator, setUseProgressIndicator] = useState(false);

  const [LRClibValid, isLRClibValid] = useState<boolean>(false);
  


  useEffect(() => {

    (async () => {
      if (sMetaDataFull.songRawPath != ""){

        //backend image handling
        var cImg = placeholderImage;
        if(sMetaDataFull.coverImage != null){
          setUseProgressIndicator(true);
          cImg = await window.electron.ipcRenderer.invoke(ServicesEnum.utility, {service: IPCMethodAPI.UtilityTwoWayIPC.imgStringToThumbnail, content: [sMetaDataFull.coverImage]});
          setUseProgressIndicator(false);
          
          //console.log('data:' + resultFull.coverImageFormat + ';base64,'+ img);
          //img = window.btoa(img);
          cImg = 'data:' + sMetaDataFull.coverImageFormat + ';base64,'+ cImg;
        }

        setCover(<CardMedia
                    component="img"
                    width="100"
                    height="200"
                    image= {cImg}
                    loading="lazy" 
                    alt="Song Thumbnail Image"         
                    sx={{objectFit: "contain" , animation: "fadeIn 0.50s" }}
                  />);
      }
    })();
  }, [sMetaDataFull]);

  React.useEffect(() => {
    if (useProgressIndicator == true){
      //setCover(<CircularProgress key={progressIndicator} variant='determinate' size="10vw" value={progressIndicator*100}/>)
      setCover(<CircularProgress key={progressIndicator} size="10vw"/>)
    }

  }, [useProgressIndicator, progressIndicator]);

  
  //on mount and unmount
  useEffect(() => {

    //called when the component is unmounted
    return () => {
      setCover(<div/>);
      
    };
  }, []);

  useEffect(() => {
    if (sMetaDataFull.songRawPath != ""){
      checkLRClibValidity();
    }
  }, [sMetaDataFull]);

    async function checkLRClibValidity(){
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.externalLyrics, content: [sMetaDataFull.songRawPath]}) as SongLyricAPIData;
        
        if (result.statusCode == 100){
          isLRClibValid(true);
        }
        else{
          isLRClibValid(false);
        }
        
    }
  
    return (
        <div>
            <Card  variant='outlined'  className="card_songinfohorizontalcard" component={Paper} sx={{ height: "19.5vh", maxWidth: "40vw", borderRadius: 0}} >


              <CardContent className='card_songinfohorizontalcard_content'>
                
                {/* IMAGE METADATA */}
                <Paper  style={{maxHeight: "20vh", overflow: 'auto', scrollbarWidth: 'none'}}>
                  {cover}    
                </Paper>            
                
                {/* WORDED METADATA */}
                  <div style={{ textAlign: "left", paddingRight: "5px"}}>
                    <Typography variant="body2" component="div" >Name: {sMetaDataFull?.name}</Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Genre: {sMetaDataFull?.genre} <br/></div> </Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Artist: {sMetaDataFull?.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))} <br/></div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Album: {sMetaDataFull?.album} <br/></div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Length: {fmtMSS(sMetaDataFull.length)} Mins <br/></div></Typography>
                  </div>

                  <div style={{ textAlign: "left"}}>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Bitrate: {sMetaDataFull?.bitrate} kbps</div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Format: {sMetaDataFull?.format}</div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Embedded Comment: {sMetaDataFull?.comment}</div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>File Location: {sMetaDataFull?.songRawPath}</div></Typography>
                    <Divider/>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Is LibLRC Valid: {LRClibValid.toString()} </div></Typography>
                    <Typography variant="body2" ><div className='text_fade_in_songinfohorizontalcard'>Open In File Explorer: <Button disabled>Open</Button> </div></Typography>
                  </div>       
              </CardContent>
            </Card>
        </div>

    );



}