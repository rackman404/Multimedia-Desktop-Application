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

import Marquee from "react-fast-marquee";
import { checkTextOverflow } from '../../../../../utils';
import { grey } from '@mui/material/colors';
import { BottomMusicImageHandler } from './BottomMusicImageHandler';


export const BottomMusicTextHandler = () => {
    const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

    const [artistElement, setArtistElement] = useState<HTMLDivElement | null>();
    const [nameElement, setNameElement] = useState<HTMLDivElement | null>();


    const [artistMarqueeState, setArtistMarqueeState] = useState(false);
    const [nameMarqueeState, setNameMarqueeState] = useState(false);

    //on mount and unmount
    useEffect(() => {
        //called when the component is unmounted
        return () => {
            setArtistElement(null);
            setNameElement(null);
        };
    }, []);
    
    //check for overflow and set a marquee if it does
    useEffect(() => {

        if (artistElement != null && nameElement != null){
            setArtistMarqueeState(checkTextOverflow(artistElement));
            setNameMarqueeState(checkTextOverflow(nameElement));
        }
        

    }, [artistElement, nameElement]);


    return (     
        <div>
            <div ref={(el) => {setNameElement(el)}} id = "name" className='left_card_text_container_bottommusiccontrol'>
            {nameMarqueeState === true ? 
            <Marquee speed={25} delay={1}>{<div style={{paddingRight: "5px"}}>{currentSong.name} {" "} | </div>}</Marquee>
            : currentSong.name}
            </div>

            <br/>
            
            
            <div ref={(el) => {setArtistElement(el)}} id = "artist" className='left_card_text_container_bottommusiccontrol'>
                {artistMarqueeState === true ? 
                <Marquee speed={25} delay={1}><div  style={{paddingRight: "5px"}}>{currentSong.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))} {" "} |</div></Marquee>
                : currentSong.artist.map((artist, index) => ( index === 0 ? artist : " and " + artist))}
            </div>
        </div>

                
    );



}