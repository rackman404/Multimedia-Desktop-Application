import './../css/Dashboard.css';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button, ButtonGroup, Chip, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, ThemeProvider, useColorScheme } from '@mui/material';
import { LeftAudioSidebar } from '../components/static/Audio/LeftAudioSidebar';


export const Layout = () => {
    return (
        <div className='page_content_dashboard'>

            <Card className='card_dashboard'> <h2>Music</h2>  </Card>
            
            <Card className='card_dashboard'> <h2>Welcome</h2> </Card>

            <Card className='card_dashboard'> <h2>Conversions</h2> </Card>

             
        </div>
    )
  };
export default Layout;