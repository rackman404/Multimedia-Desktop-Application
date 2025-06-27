import { AppBar, Box, Button, ButtonGroup, Card, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import '../../../../css/BottomMusicControl.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegularButton } from '../../../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useSelectedSongStore } from '../../../../state_stores/MusicStateStores';
import { fmtMSS } from '../../../../Common';





type MusicControlProps = { //constructor variables
  setSeek: (newSeek:number) => void
  setVolume: (newVolume: number)  => void
  setNext: ()  => void
  setPrev: ()  => void
};

export const BottomMusicControl = ({setSeek, setVolume, setNext, setPrev}:MusicControlProps) => {
    

    const updatePlayState = useSelectedSongStore((state) => state.setPlayState);
    const PlayState = useSelectedSongStore((state) => state.playState);
    const currentSeek = useSelectedSongStore((state) => state.currentSeek);
    const currentVolume = useSelectedSongStore((state) => state.currentVolume);

    const currentSong = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

    const userSeekChange = (event: Event, newValue: number) => {
        setSeek(newValue);
    };

    const userVolumeChange = (event: Event, newValue: number) => {
        setVolume(newValue);
    };


    return (

        <div className='content_bottommusiccontrol'>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <div className= "horizontal_grid_bottommusiccontrol"> 
                        <Toolbar></Toolbar>

                        <div>
                            <div className='centered_control_bottommusiccontrol'>
                                <Button onClick={setPrev}><ArrowBackIosNewIcon/></Button>
                                <ToggleButton value="control"  selected={PlayState} onChange={() => updatePlayState(!PlayState)}><PlayCircleIcon/></ToggleButton>
                                <Button onClick={setNext}><ArrowForwardIosIcon/></Button>
                            </div>

                            <div className='seek_component_bottommusiccontrol'>
                                <Toolbar>
                                    {fmtMSS(Math.round(currentSeek))}
                                    <Slider size="small" aria-label="Volume" value={currentSeek} max={currentSong.length} sx={{maxWidth: "50em", marginLeft: "10px", marginRight: "10px"}} onChange={userSeekChange} />
                                    {fmtMSS(Math.round(currentSong.length))}
                                </Toolbar>
                                tes
                            </div>

                        </div>
                        
                        <div>
                            <div className='volume_control_bottommusiccontrol' style={{marginTop: "2.3vh"}}>
                                Volume
                            </div>
                        
                            <Toolbar> {currentVolume} <Slider size="small" aria-label="Volume" value={currentVolume} max={100} onChange={userVolumeChange} /> </Toolbar>
                        </div>
                    </div>
                    
                </AppBar>
            </Box>
        </div>

    );



}