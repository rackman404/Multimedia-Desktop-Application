import { AppBar, Box, Button, ButtonGroup, Card, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, TextField, ToggleButton, Toolbar, Typography } from '@mui/material';
import '../../../css/BottomMusicControl.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegularButton } from '../../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useSelectedSongStore } from '../../../state_stores/MusicStateStores';

export const BottomMusicControl = () => {
    const [seek, setSeek] = React.useState(30);
    const [volume, setVolume] = React.useState(50);

    const updatePlayState = useSelectedSongStore((state) => state.setPlayState)
    const PlayState = useSelectedSongStore((state) => state.playState)

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
                                <Button><ArrowBackIosNewIcon/></Button>
                                <ToggleButton value="control"  selected={PlayState} onChange={() => updatePlayState(!PlayState)}><PlayCircleIcon/></ToggleButton>
                                <Button><ArrowForwardIosIcon/></Button>
                            </div>

                            <Toolbar>
                                <Slider size="small" aria-label="Volume" value={seek} onChange={userSeekChange} />
                            </Toolbar>
                        </div>
                        
                        <div>
                            <div className='centered_control_bottommusiccontrol' style={{marginTop: "2.3vh"}}>
                                Volume
                            </div>
                        
                            <Toolbar> <Slider size="small" aria-label="Volume" value={seek} onChange={userSeekChange} /> </Toolbar>
                        </div>
                    </div>
                    
                </AppBar>
            </Box>
        </div>

    );



}