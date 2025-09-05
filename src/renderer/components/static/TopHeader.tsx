import { AppBar, Box, Button, ButtonGroup, Card, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, TextField, Toolbar, Typography } from '@mui/material';
import './TopHeader.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LinkButton, RegularButton } from '../../elements/CustomButtons';
import MenuIcon from '@mui/icons-material/Menu';

const FONTSCALE = "0.75vw";

export const TopHeader = () => {
    const [currentViewText, setCurrentViewText] = React.useState("Dashboard");

    return (
        <div className='content_topheader'>

                 <AppBar position="sticky">
                    <div className= "horizontal_grid_topheader"> 

                    <Toolbar>                       
                        <LinkButton className='button_element' component={Link} to={'/'} onClick={(e) => {setCurrentViewText("Dashboard")}} variant="contained">Dashboard</LinkButton>

                        <Divider orientation="vertical" variant="middle" sx={{margin: "5px"}} />

                        <Card className='card_element'>
                            <Chip className='button_element' label="Music" variant="filled" sx={{margin: "5px"}} onClick ={() => {} }/> 
                            <LinkButton className='button_element' component={Link} to={'/audio/music/home'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Music")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Music</Typography></LinkButton>
                            <LinkButton className='button_element' component={Link} to={'/audio/music/playlists'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Playlists")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Playlists</Typography></LinkButton>
                        </Card>

                        <Divider orientation="vertical" variant="middle" flexItem />

                        <Card className='card_element'>
                            <Chip className='button_element' label="Audio Utils" variant="filled" sx={{margin: "5px"}} onClick ={() => {} }/>   
                            <LinkButton className='button_element' disabled component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Audio Edit")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">FFmpeg</Typography></LinkButton>
                            <LinkButton className='button_element' disabled component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Audio Edit")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Soulseek</Typography></LinkButton>
                        </Card>
                        
                        
                     </Toolbar>
                    <div style={{textAlign: "center", paddingTop: "1.5vh"}}>
                        Current:
                        <Chip className='button_element' label={currentViewText} variant="outlined" onClick ={() => {} }/>                        
                    </div>

                    <Toolbar className='right_align_toolbar_topheader'>
                        <Card className='card_element'>                            
                            <LinkButton className='button_element' component={Link} to={'/utility/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Settings")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Settings</Typography></LinkButton>
                            <LinkButton className='button_element' component={Link} to={'/utility/about'} sx={{margin: "5px"}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">About</Typography></LinkButton>
                            <LinkButton className='button_element' component={Link} to={'/utility/help'} sx={{margin: "5px"}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Help</Typography></LinkButton>
                            <Chip className='button_element'label="Utility" variant="filled" sx={{margin: "5px"}} onClick ={() => {} }/>   
                        </Card>

                        <Card className='card_element'>                            
                            <LinkButton className='button_element' disabled component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Settings")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Player</Typography></LinkButton>
                            <LinkButton className='button_element' disabled component={Link} to={'/settings'} sx={{margin: "5px"}} onClick={(e) => {setCurrentViewText("Settings")}} variant="contained"><Typography fontSize={FONTSCALE} noWrap component="div">Nyaa</Typography></LinkButton>
                            <Chip className='button_element' label="Video" variant="filled" sx={{margin: "5px"}} onClick ={() => {} }/>   
                        </Card>
                    </Toolbar>

                    </div>
                     
                    <Divider />
                 </AppBar>
        </div>

    );



}