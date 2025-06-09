import { AppBar, Box, Button, ButtonBase, ButtonGroup, Card, CardContent, Checkbox, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import './SongEditCard.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';


export const SongEditCard = () => { 
    const [currentViewText, setCurrentViewText] = React.useState("Dashboard");

    return (
        <div>
            <Card variant='outlined'  className="card_songeditcard" component={Paper} sx={{ height: "26.5vh", width: "20vw"}}>
              <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  
                </Typography>
                <Typography variant="h5" component="div">
                  Edit Properties
                </Typography>

                <div style={{ textAlign: "left", padding: "5px"}}>
                  <Typography variant="body2" >Genre: <br/></Typography>
                  <Typography variant="body2" >Artist: <br/></Typography>
                  <Typography variant="body2" >Album: <br/></Typography>
                  <Typography variant="body2" >Length: <br/></Typography>
                </div>

              </CardContent>
            </Card>
        </div>
    );



}