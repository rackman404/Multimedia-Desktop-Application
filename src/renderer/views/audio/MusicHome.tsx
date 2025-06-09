import React, { useState, useEffect } from 'react';
import './../../css/audio/MusicHome.css';
import { LeftAudioSidebar } from '../../components/static/Audio/LeftAudioSidebar';
import { SongTable } from '../../components/regular/Audio/Music/SongTable';
import { SongInfoCard } from '../../components/regular/Audio/Music/SongInfoCard';
import { SongEditCard } from '../../components/regular/Audio/Music/SongEditCard';
import { SongMetaData } from '../../../types';

export const Layout = () => {
    const [metaData, setMetaData] = useState<SongMetaData[]>([{
        name: "NO MUSIC",
        format: '',
        fileSize: 0,
        metadataFormat: '',
        id: 0,
        length: 0,
        artist: [],
        genre: [],
        playCount: 0,
        bitrate: 0,
        coverImage: '',
        songRawPath: '',
        album: '',
        comment: ''
    }]);

    const [selectedMetaData, setSelectedMetaData] = useState<SongMetaData>({
        name: "Song Placeholder",
        format: '',
        fileSize: 0,
        metadataFormat: '',
        id: 0,
        length: 0,
        artist: [],
        genre: [],
        playCount: 0,
        bitrate: 0,
        coverImage: '',
        songRawPath: '',
        album: '',
        comment: ''
    });

        useEffect(() => {
            (async () => {
                const result = await window.electron.ipcRenderer.invoke('audio', "get_all_metadata");
                setMetaData(result);
                
        })();
           
        }, []); 

    return (
        <div className='content_musichome'>
            <div className=''>
                <SongInfoCard sMetaData={selectedMetaData} />
                <SongEditCard/>
            </div>
            
            <SongTable sMetaData={metaData} setSelectedDataFunction={setSelectedMetaData}/>
            
        </div>
    )
  };
export default Layout;