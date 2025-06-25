import { Box, Button, ButtonGroup, Card, Chip, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import '../../../../css/LeftAudioSidebar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegularButton } from '../../../../elements/CustomButtons';
 
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export const LeftAudioSidebar = () => {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
     setOpen(newOpen);
    };

      const DrawerList = (
    <Box sx={{ width: '20vw' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
            
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

    return (
        
        <div className='access_button'>
            <RegularButton onClick={toggleDrawer(true)} style={{height: '10vh', width: '10px'}}><ChevronRightIcon /></RegularButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>

    );



}