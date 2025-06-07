import { AppBar, Box, Button, ButtonGroup, Card, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, TextField, Toolbar, Typography } from '@mui/material';
import '../../../css/BottomMusicControl.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegularButton } from '../../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export const BottomMusicControl = () => {
    const [seek, setSeek] = React.useState(30);
    const [playState, setPlay] = React.useState(false);

    const userSeekChange = (event: Event, newValue: number) => {
        setSeek(newValue);

        //add code to 
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
                                <Button><PlayCircleIcon/></Button>
                                <Button><ArrowForwardIosIcon/></Button>
                            </div>

                            <Toolbar>
                                <Slider size="small" aria-label="Volume" value={seek} onChange={userSeekChange} />
                            </Toolbar>
                        </div>
                        
                        
                        <Toolbar></Toolbar>
                    </div>
                    
                </AppBar>
            </Box>
        </div>

    );



}