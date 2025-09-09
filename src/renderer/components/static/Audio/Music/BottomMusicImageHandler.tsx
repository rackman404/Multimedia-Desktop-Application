import { AppBar, Box, Button, ButtonGroup, Card, CardMedia, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import './BottomMusicControl.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RegularButton } from '../../../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';

import placeholderImage from '../../../../../../assets/music_no_thumbnail.png';
import { SongMetaData } from '../../../../../types';
import { IPCMethodAPI, ServicesEnum } from '../../../../../typesIPC';




export const BottomMusicImageHandler = () => {
    const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

    const setThumbnailString = useSelectedSongStore((state) => state.setThumbnailString);

    const [cover, setCover] = useState<any>(<CardMedia
        component="img"
        width="100%"
        height="65%"
        image= {placeholderImage}
        alt="Song Thumbnail Image"         
        sx={{objectFit: "contain" }}
    />);

    //on mount and unmount
    useEffect(() => {
    //called when the component is unmounted
    return () => {
        //console.log("UNMOUNTING BOTTOM THUMBNAIL");
    };
    }, []);

    useEffect(() => {
        //var abort = false;
        (async () => {
            if (currentSong.songRawPath != ""){
                setThumbnailString("");

                const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.getSelectedMetadataFull, content: [currentSong.id, currentSong.songRawPath]}) as SongMetaData;
                //console.log("cover image" +  sMetaData?.coverImage);
                //console.log(result);


                var cImg = placeholderImage;
                if(result.coverImage != null){
                    cImg = await window.electron.ipcRenderer.invoke(ServicesEnum.utility, {service: IPCMethodAPI.UtilityTwoWayIPC.imgStringToThumbnail, content: [result.coverImage]});
                    
                    //console.log('data:' + resultFull.coverImageFormat + ';base64,'+ img);
                    //img = window.btoa(img);
                    cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;

                    setThumbnailString(cImg);
                }

                /* old method (without using multithreaded backend)
                if(result.coverImage != null){
                    cImg = await _arrayBufferToBase64(result.coverImage.data);
                    cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;

                    console.log("was this song: + " + currentSong.name + " aborted? " + abort);
                    if (abort == false){
                        setThumbnailString(cImg);
                    }
                    
                }
                else{
                    setThumbnailString(placeholderImage);
                }
                */

                /* old
                var cImg = placeholderImage;
                if(result.coverImage != null){
                cImg = result.coverImage;
                cImg = 'data:' + result.coverImageFormat + ';base64,'+ cImg;
                }
                */
        
                
        setCover(<img
        width="100%"
        height="100%"
        src= {cImg}
        alt="Song Thumbnail Image"
        loading="lazy"  
        style={{objectFit: "contain", animation: "fadeIn 0.50s"}}
                />);
            }
        })();

        return () => { //needed to discard old lyrics if the user skips through multiple songs (which may cause multiple lyric requests at once)
            //console.log("DISCARDING IMAGE DATA (no need as this image is outdated), was for: " + currentSong.name);
           // abort = true;
        }

        
    }, [currentSong]);

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
    
        }
        return window.btoa( binary );
    }

    return (
        <div>
            {cover}
        </div>
        
    );



}