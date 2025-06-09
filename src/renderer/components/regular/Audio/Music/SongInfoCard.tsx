import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, CardMedia, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongInfoCard.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import placeholderImage from '../../../../../../assets/icons/256x256.png';
import { SongMetaData } from '../../../../../types';

type SongInfoProps = { //constructor variables
  sMetaData: SongMetaData
}

export const SongInfoCard = ({sMetaData} : SongInfoProps) => { 
  const [cover, setCover] = useState<string>(placeholderImage);

  useEffect(() => {
    console.log("cover image" +  sMetaData?.coverImage);
    var cImg = placeholderImage;
      if(sMetaData.coverImage != null){
        cImg = sMetaData.coverImage;
        cImg = 'data:' + sMetaData.coverImageFormat + ';base64,'+ cImg;
      }

      setCover(cImg);

  }, [sMetaData]);

  
    return (
        <div>
            <Card variant='outlined'  className="card_songinfocard" component={Paper} sx={{ height: "66.5vh", width: "20vw"}}>
              <CardContent>
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

                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{sMetaData?.artist}<br/></Typography>

                <Divider/>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Song Detail<br/></Typography>
                <div style={{ textAlign: "left", padding: "5px"}}>
                  <Typography variant="body2" >Genre: {sMetaData?.genre}<br/></Typography>
                  <Typography variant="body2" >Artist: {sMetaData?.artist}<br/></Typography>
                  <Typography variant="body2" >Album: {sMetaData?.album}<br/></Typography>
                  <Typography variant="body2" >Length: {sMetaData?.length}<br/></Typography>
                </div>

                <Divider/>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Technical Detail<br/></Typography>
                <div style={{ textAlign: "left", paddingRight: "5px"}}>
                  <Typography variant="body2" >Bitrate: {sMetaData?.bitrate}<br/></Typography>
                  <Typography variant="body2" >Format: {sMetaData?.format}<br/></Typography>
                  <Typography variant="body2" >Embedded Comment: {sMetaData?.comment}<br/></Typography>
                  <Typography variant="body2" >File Location: {sMetaData?.songRawPath} <br/></Typography>
                </div>

                <Divider/>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Other Detail<br/></Typography>
                <div style={{ textAlign: "left", padding: "5px"}}>
                  <Typography variant="body2" >Play Count: <br/></Typography>
                  <Typography variant="body2" >Data Added: <br/></Typography>
                </div>

              </CardContent>
            </Card>
        </div>

    );



}