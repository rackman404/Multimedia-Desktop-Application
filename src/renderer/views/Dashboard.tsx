import './Dashboard.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, ThemeProvider, useColorScheme } from '@mui/material';
import { RegularButton } from '../elements/CustomButtons';
import { ipcRenderer } from 'electron';
import { IPCMethodAPI, ServicesEnum } from '../../typesIPC';


export const Layout = () => {



    return (
        <div className='page_content_dashboard'>

            <Card className='card_dashboard'> <h2>Music</h2><Divider/>  </Card>
            
            <Card className='card_dashboard'> <h2>Welcome</h2><Divider/> 
            

            <Divider/>

            <RegularButton onClick={    
                () => {
                    
                window.electron.ipcRenderer.sendMessage(ServicesEnum.settings , {service: IPCMethodAPI.SettingsOneWayIPC.exit, content: [""]});

                
            }}>Exit</RegularButton>
            
            </Card>

            <Card className='card_dashboard'> <h2>Changelog</h2><Divider/> </Card>

            {/*
            <Card className='card_dashboard'> <h2>Debug</h2> 

            <RegularButton onClick={() => window.electron.ipcRenderer.sendMessage('audio', ['msg'])}>Test send one way</RegularButton>

            <RegularButton onClick={    
                () => {
                    
                window.electron.ipcRenderer.sendMessage('discord', ["song_notification", "test", "testbottom", "3", "4", "https://www.iconsdb.com/icons/preview/gray/note-xxl.png"]);

                
            }}>Test Discord Rich Presence</RegularButton>
            

            
            <RegularButton onClick={    
                async () => {
                    
                await window.electron.ipcRenderer.sendMessage('discord', ["song_notification", "secondary", "testbottom", "3", "4", "https://www.iconsdb.com/icons/preview/gray/note-xxl.png"]);

                
            }}>Test Discord Rich Presence (Secondary)</RegularButton>
            

            </Card>
            */}

            
        </div>
    )
  };
export default Layout;