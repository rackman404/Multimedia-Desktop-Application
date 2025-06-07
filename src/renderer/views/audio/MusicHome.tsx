import React, { useState, useEffect } from 'react';
import './../../css/audio/MusicHome.css';
import { LeftAudioSidebar } from '../../components/static/Audio/LeftAudioSidebar';
import { SongTable } from '../../components/regular/Audio/Music/SongTable';

export const Layout = () => {
    return (
        <div className='content_musichome'>
            <SongTable/>
            
        </div>
    )
  };
export default Layout;