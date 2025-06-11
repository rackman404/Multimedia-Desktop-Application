import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, CardMedia, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
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


  useEffect(() => {

    (async () => {
      if (sMetaData.songRawPath != ""){
        const result = await window.electron.ipcRenderer.invoke('audio', ["get_metadata_full", sMetaData.id, sMetaData.songRawPath]);
        //console.log("cover image" +  sMetaData?.coverImage);
        var cImg = placeholderImage;
        if(result.coverImage != null){
          cImg = result.coverImage;
          cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
        }
  
        setFullMetaData(result);
        setCover(cImg);

      }

    })();


  }, [sMetaData]);

  
    return (
        <div>
            <Card  variant='outlined'  className="card_songinfocard" component={Paper} sx={{ height: "66.5vh", maxWidth: "20vw", maxHeight: "66.5vh"}}>
              <CardContent>

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
                <Paper  style={{maxHeight: "38vh", maxWidth:"20vw", overflow: 'auto', scrollbarWidth: 'none'}}>

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
                  </div>


                </Paper>
                
              </CardContent>
            </Card>
        </div>

    );



}