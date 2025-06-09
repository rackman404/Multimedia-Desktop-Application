import { AppBar, Box, Button, ButtonGroup, Card, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, TextField, Toolbar, Typography } from '@mui/material';
import '../../css/TopHeader.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LinkButton, RegularButton } from '../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export const TopHeader = () => {
    const [currentViewText, setCurrentViewText] = React.useState("Dashboard");

    return (
        <div className='content_topheader'>

                 <AppBar position="sticky">
                    <div className= "horizontal_grid_topheader"> 

                    <Toolbar>                       
                        <LinkButton component={Link} to={'/'} onClick={(e) => {setCurrentViewText("Dashboard")}} variant="contained">Dashboard</LinkButton>

                        <Divider orientation="vertical" variant="middle" sx={{margin: "5px"}} />

                        <Card>
                            <Chip label="Music" variant="filled" sx={{margin: "5px"}}/> 
                            <LinkButton component={Link} to={'/audio/music/home'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Music")}} variant="contained">Music</LinkButton>
                            <LinkButton component={Link} to={'/audio/music/playlists'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Playlists")}} variant="contained">Playlists</LinkButton>
                        </Card>

                        <Divider orientation="vertical" variant="middle" flexItem />

                        <Card >
                            <Chip label="Audio Utils" variant="filled" sx={{margin: "5px"}}/>   
                            <LinkButton component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Audio Edit")}} variant="contained">FFmpeg</LinkButton>
                            <LinkButton component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Audio Edit")}} variant="contained">Soulseek</LinkButton>
                        </Card>
                        
                        
                     </Toolbar>
                    <div style={{textAlign: "center", paddingTop: "1.5vh"}}>
                        Current:
                        <Chip label={currentViewText} variant="outlined" />                        
                    </div>

                    <Toolbar className='right_align_toolbar_topheader'>
                        <Card >                            
                            <LinkButton component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Settings")}} variant="contained">Settings</LinkButton>
                            <LinkButton component={Link} to={'/settings'} sx={{margin: "5px"}} variant="contained">About</LinkButton>
                            <LinkButton component={Link} to={'/settings'} sx={{margin: "5px"}} variant="contained">Help</LinkButton>
                            <Chip label="Utility" variant="filled" sx={{margin: "5px"}}/>   
                        </Card>
                    </Toolbar>

                    </div>
                     
                    <Divider />
                 </AppBar>
        </div>

    );



}