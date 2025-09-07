import './Settings.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonBase, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField, ThemeProvider, Tooltip, Typography, useColorScheme } from '@mui/material';
import { ipcRenderer } from 'electron';
import { RegularButton } from '../../elements/CustomButtons';
import { useGlobalSettingsState } from '../../state_stores/GlobalSettingsStateStore';
import { DeepLStatistics, DefaultSettingParameters, SettingParameters } from '../../../types';
import { IPCMethodAPI, ServicesEnum } from '../../../typesIPC';

export const Layout = () => {
    const discordState = useGlobalSettingsState((state) => state.discordRichPresenceState);
    const setDiscordState = useGlobalSettingsState((state) => state.setDiscordRichPresenceState);

    /*
    const networkState = useGlobalSettingsState((state) => state.networkState);
    const setNetworkState = useGlobalSettingsState((state) => state.setNetworkState);

    const fullscreenState = useGlobalSettingsState((state) => state.fullscreenState);
    const setFullscreenState = useGlobalSettingsState((state) => state.setFullscreenState);
    */

    const [deepLStatistics, setDeepLStatistics] = useState<DeepLStatistics>();

    const [parameters, setParameters] = useState<SettingParameters>();

    //on mount and unmount
    useEffect(() => {

        getDiscordStatus();

        getDeepLStatistics();

        fetchData();

        //called when the component is unmounted
        return () => {

        };
    }, []);

    //https://dev.to/sergioholgado/how-to-fetch-data-before-rendering-in-react-js-3750 
    const fetchData = async () => {
        setParameters(await window.electron.ipcRenderer.invoke(ServicesEnum.settings , {service: IPCMethodAPI.SettingsTwoWayIPC.getParameters, content: [""]}));
    }
    

    async function getDiscordStatus(){
        console.log("discord: " + discordState);
        setDiscordState (await window.electron.ipcRenderer.invoke(ServicesEnum.discord, {service: IPCMethodAPI.DiscordTwoWayIPC.clientStatus, content: [""]}));
    }

    async function getDeepLStatistics(){
        setDeepLStatistics (await window.electron.ipcRenderer.invoke(ServicesEnum.audio, ["external_deepl_stats"]) as DeepLStatistics);
    }

    async function setNetwork(state: boolean){
        console.log("changing network connection");
        if (state == true){
            const result = await window.electron.ipcRenderer.sendMessage(ServicesEnum.settings , {service: IPCMethodAPI.SettingsOneWayIPC.network, content: ["true"]});
        }
        if (state == false){
            const result = await window.electron.ipcRenderer.sendMessage(ServicesEnum.settings , {service: IPCMethodAPI.SettingsOneWayIPC.network, content: ["false"]});
        }

        setParameters(await window.electron.ipcRenderer.invoke(ServicesEnum.settings , {service: IPCMethodAPI.SettingsTwoWayIPC.getParameters, content: [""]}));
    }

    async function setFullscreen(state: boolean){
        console.log("changing fullscreen state");
        if (state == true){
            const result = await window.electron.ipcRenderer.sendMessage(ServicesEnum.settings , {service: IPCMethodAPI.SettingsOneWayIPC.fullscreen, content: ["true"]});
        }
        if (state == false){
            const result = await window.electron.ipcRenderer.sendMessage(ServicesEnum.settings , {service: IPCMethodAPI.SettingsOneWayIPC.fullscreen, content: ["false"]});
        }

        setParameters(await window.electron.ipcRenderer.invoke(ServicesEnum.settings , {service: IPCMethodAPI.SettingsTwoWayIPC.getParameters, content: [""]}));
    }

    function setRichPresence(state: boolean){
        console.log("changing fullscreen state");
        if (state == true){
            window.electron.ipcRenderer.sendMessage(ServicesEnum.discord, {service: IPCMethodAPI.DiscordOneWayIPC.enableClient, content: [""]});
        }
        if (state == false){
            window.electron.ipcRenderer.sendMessage(ServicesEnum.discord, {service: IPCMethodAPI.DiscordOneWayIPC.disableClient, content: [""]});
        }
    }
    

    return (
        <div className='page_content_settings'>

            <Card className='card_settings' variant='outlined'> 
                
            <h1>Settings</h1>

            <div className='column_settings'>

                <Card className='secondary_card_settings' variant='outlined'> 
                    <h2>Status</h2>
                    <div className='row_status'>
                        <Tooltip title="Requires a DeepL Key for this statistic to function">
                            <Typography noWrap component="div" sx={{justifyContent: "flex-start"}}>DeepL Connection Status:</Typography>
                        </Tooltip>
                        
                        <Tooltip title="Limit is capped at 500k for basic, note that DeepL translations will not function after this point (unless a PRO DeepL key is used)">
                            <Typography noWrap component="div" sx={{justifyContent: "flex-start"}}> {deepLStatistics?.deepLConnectionStatus} </Typography>
                        </Tooltip>
                    </div>

                    <div className='row_status'>
                        <Tooltip title="Requires a DeepL Key for this statistic to function">
                            <Typography noWrap component="div" sx={{justifyContent: "flex-start"}}>DeepL Character Usage:</Typography>
                        </Tooltip>
                        
                        <Tooltip title="Limit is capped at 500k for basic, note that DeepL translations will not function after this point (unless a PRO DeepL key is used)">
                            <Typography noWrap component="div" sx={{justifyContent: "flex-start"}}> {deepLStatistics?.characterUsage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / 500,000</Typography>
                        </Tooltip>
                    </div>
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
        
                            <TextField id="inputfieldoffset" label="Set Offset" variant="standard" sx={{marginLeft: "auto"}} defaultValue={parameters?.MusicSettings.DefaultLyricOffset}/> 
                            
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
        
                            <TextField id="inputfieldoffset" label="Set Step Increment" variant="standard" sx={{marginLeft: "auto"}} defaultValue={parameters?.MusicSettings.DefaultOffstepIncrement}/> 
                            
                            <RegularButton
                            sx={{marginLeft: "auto"}}
                            onClick={() => discordState === false ? (setDiscordState(true), setRichPresence(true)) : (setDiscordState(false), setRichPresence(false))}> 
                                Submit
                            </RegularButton>  
                        </div>

                        <div className='Set row_settings Key'>
                            <Tooltip title="Retrieve your key from the following Url: https://www.deepl.com/en/your-account/keys (requires DeepL Account)">
                                <Typography noWrap component="div">DeepL Key</Typography>
                            </Tooltip>
        
                            <TextField id="inputfieldoffset" label="Set Key" variant="standard" sx={{marginLeft: "auto"}} defaultValue={parameters?.MusicSettings.DeepLKey}/> 
                            
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

                            <RegularButton className={parameters?.GeneralSettings.networkState === false ? 'shaded_label_affimative_settings' : 'shaded_label_negative_settings'}
                            sx={{marginLeft: "auto"}}
                            onClick={() => parameters?.GeneralSettings.networkState === false ? (setNetwork(true)) :  (setNetwork(false))}> 
                                {parameters?.GeneralSettings.networkState === false ? "Enable" : "Disable"} 
                            </RegularButton>  
                        </div>

                        

                        <div className='row_settings'>
                            <Tooltip title="Set to full screen">
                                <Typography noWrap component="div">Full Screen</Typography>
                            </Tooltip>

                            <RegularButton className={parameters?.GeneralSettings.fullscreenState === false ? 'shaded_label_affimative_settings' : 'shaded_label_negative_settings'}
                            sx={{marginLeft: "auto"}}
                            onClick={() => parameters?.GeneralSettings.fullscreenState === false ? (setFullscreen(true)) :  (setFullscreen(false))}> 
                                {parameters?.GeneralSettings.fullscreenState === false ? "Windowed" : "Fullscreen"} 
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