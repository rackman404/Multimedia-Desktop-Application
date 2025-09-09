import { useEffect, useState } from "react";
import { DEFAULTSONGMETADATASIMPLE, SongMetaData, SongMetaDataSimple } from "../../../../../types";
import { Card, CardMedia, Paper, Typography } from "@mui/material";
import './SongLastPlayedCard.css';
import { IPCMethodAPI, ServicesEnum } from "../../../../../typesIPC";

import placeholderImage from '../../../../../../assets//music_no_thumbnail.png';

export const SongLastPlayedCard = () => { 
  const [lastPlayed, setLastPlayed] = useState<SongMetaDataSimple>(DEFAULTSONGMETADATASIMPLE);

  const [thumbnail, setThumbnail] = useState<any>(<CardMedia
                    component="img"
                    width="100"
                    height="200"
                    image= {placeholderImage}
                    alt="Song Thumbnail Image"         
                    sx={{objectFit: "contain" }}
                  />);

  //on mount
  useEffect(() => {
    (async () => {

        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.retrieveLastPlayedSong, content: ['']}) as SongMetaDataSimple;
        const resultFull = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.getSelectedMetadataFull, content: [result.id, result.songRawPath]}) as SongMetaData;

        if (result.name != '' || result.length != 0){ //get thumbnail img

            var img = placeholderImage;
            
            if(resultFull.coverImage != null){
                console.log(resultFull.coverImage);

                img = await window.electron.ipcRenderer.invoke(ServicesEnum.utility, {service: IPCMethodAPI.UtilityTwoWayIPC.imgStringToThumbnail, content: [resultFull.coverImage]});
                
                //console.log('data:' + resultFull.coverImageFormat + ';base64,'+ img);
                //img = window.btoa(img);
                img = 'data:' + resultFull.coverImageFormat + ';base64,'+ img;
            }

            setThumbnail(<CardMedia
                component="img"
                width="100"
                height="200"
                image= {img}
                alt="Song Thumbnail Image"         
                loading="lazy" 
                sx={{objectFit: "contain" }}
            />)
        }


        setLastPlayed(result);

    })();
  }, []);

  return (
    <Card  variant='outlined'  className="card_songlastplayedcard" component={Paper} sx={{ height: "60.5vh", maxWidth: "20vw", maxHeight: "60.5vh"}}>
        
        <Typography variant="h5" component="div" >{lastPlayed?.name}</Typography>

        {thumbnail}


        <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Genre: {lastPlayed?.genre} <br/></div> </Typography>
        <Typography variant="body2" ><div className='text_fade_in_songinfocard'>Artist: {lastPlayed?.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))} <br/></div></Typography>


    </Card>


  )

}