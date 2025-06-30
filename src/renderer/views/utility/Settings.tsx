import './Settings.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonBase, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField, ThemeProvider, Tooltip, Typography, useColorScheme } from '@mui/material';
import { ipcRenderer } from 'electron';
import { RegularButton } from '../../elements/CustomButtons';
import { useGlobalSettingsState } from '../../state_stores/GlobalSettingsStateStore';

export const Layout = () => {
    const discordState = useGlobalSettingsState((state) => state.discordRichPresenceState);
    const setDiscordState = useGlobalSettingsState((state) => state.setDiscordRichPresenceState);

    const networkState = useGlobalSettingsState((state) => state.networkState);
    const setNetworkState = useGlobalSettingsState((state) => state.setNetworkState);

    const fullscreenState = useGlobalSettingsState((state) => state.fullscreenState);
    const setFullscreenState = useGlobalSettingsState((state) => state.setFullscreenState);

    //on mount and unmount
    useEffect(() => {

        getDiscordStatus();

        //called when the component is unmounted
        return () => {

        };
    }, []);

    async function getDiscordStatus(){
        console.log("discord: " + discordState);
        setDiscordState (await window.electron.ipcRenderer.invoke('discord', ["client_status"]));
    }

    async function setNetwork(state: boolean){
        console.log("changing network connection");
        if (state == true){
            const result = await window.electron.ipcRenderer.sendMessage('settings', ["network", "true"]);
        }
        if (state == false){
            const result = await window.electron.ipcRenderer.sendMessage('settings', ["network", "false"]);
        }
    }

    async function setFullscreen(state: boolean){
        console.log("changing fullscreen state");
        if (state == true){
            const result = await window.electron.ipcRenderer.sendMessage('settings', ["fullscreen", "true"]);
        }
        if (state == false){
            const result = await window.electron.ipcRenderer.sendMessage('settings', ["fullscreen", "false"]);
        }
    }

    function setRichPresence(state: boolean){
        console.log("changing fullscreen state");
        if (state == true){
            window.electron.ipcRenderer.sendMessage('discord', ["enable_client"]);
        }
        if (state == false){
            window.electron.ipcRenderer.sendMessage('discord', ["disable_client"]);
        }
    }
    

    return (
        <div className='page_content_settings'>

            <Card className='card_settings' variant='outlined'> 
                
            <h1>Settings</h1>

            <div className='column_settings'>

                <Card className='secondary_card_settings' variant='outlined'> 
                <h2>Status</h2>
                Placeholder 
                </Card>

                <Card className='secondary_card_settings' variant='outlined'> 
                <h2>Parameters</h2>

                <div className='double_row_settings'>
                    <div className='column_settings'>
                        <h3>General Parameters</h3>

                        <div className='row_settings'>
                            <Tooltip title="Disable this if you do not wish to broadcast your activities in this application on your Discord Profile (Note: You must be logged into Discord to use Rich Presence at all)">
                                <Typography noWrap component="div" sx={{justifyContent: "flex-start"}}>Discord Rich Presence</Typography>
                            </Tooltip>
                            
                            
                            <RegularButton
                            className={discordState === false ? 'shaded_label_affimative_settings' : 'shaded_label_negative_settings'}
                            sx={{marginLeft: "auto"}}
                            onClick={() => discordState === false ? (setDiscordState(true), setRichPresence(true)) : (setDiscordState(false), setRichPresence(false))}> 
                                {discordState === false ? "Enable" : "Disable"} 
                            </RegularButton>  

                        </div>

                        <h3>Music Parameters</h3>

                        
                        <div className='row_settings'>
                            <Tooltip title="Default offset in miliseconds (ms) (Only has effects if live lyrics are enabled and live lyrics can be found)">
                                <Typography noWrap component="div">Set Default Live Lyrics Offset</Typography>
                            </Tooltip>
        
                            <TextField id="inputfieldoffset" label="Set Offset" variant="standard" sx={{marginLeft: "auto"}} /> 
                            
                            <RegularButton
                            sx={{marginLeft: "auto"}}
                            onClick={() => discordState === false ? setDiscordState(true) : setDiscordState(false)}> 
                                Submit
                            </RegularButton>  
                        </div>

                            <div className='row_settings'>
                            <Tooltip title="Default step increment is 100ms per step">
                                <Typography noWrap component="div">Set Offset Step Increment</Typography>
                            </Tooltip>
        
                            <TextField id="inputfieldoffset" label="Set Step Increment" variant="standard" sx={{marginLeft: "auto"}} /> 
                            
                            <RegularButton
                            sx={{marginLeft: "auto"}}
                            onClick={() => discordState === false ? (setDiscordState(true), setRichPresence(true)) : (setDiscordState(false), setRichPresence(false))}> 
                                Submit
                            </RegularButton>  
                        </div>

                    </div>

                    <div className='column_settings'>


                        <h3>Session Parameters</h3>

                        <div className='row_settings'>
                            <Tooltip title="NOT FUNCTIONAL">
                                <Typography noWrap component="div">Internet Networking</Typography>
                            </Tooltip>

                            <RegularButton className={networkState === false ? 'shaded_label_affimative_settings' : 'shaded_label_negative_settings'}
                            sx={{marginLeft: "auto"}}
                            onClick={() => networkState === false ? (setNetworkState(true), setNetwork(true)) :  (setNetworkState(false), setNetwork(false))}> 
                                {networkState === false ? "Enable" : "Disable"} 
                            </RegularButton>  
                        </div>

                        

                        <div className='row_settings'>
                            <Tooltip title="Set to full screen">
                                <Typography noWrap component="div">Full Screen</Typography>
                            </Tooltip>

                            <RegularButton className={fullscreenState === false ? 'shaded_label_affimative_settings' : 'shaded_label_negative_settings'}
                            sx={{marginLeft: "auto"}}
                            onClick={() => fullscreenState === false ? (setFullscreenState(true), setFullscreen(true)) :  (setFullscreenState(false), setFullscreen(false))}> 
                                {fullscreenState === false ? "Windowed" : "Fullscreen"} 
                            </RegularButton>  
                        </div>

                        
                    </div>
                </div>
            
                </Card>

            </div>


        
            </Card>
            
        

            
        </div>
    )
  };
export default Layout;