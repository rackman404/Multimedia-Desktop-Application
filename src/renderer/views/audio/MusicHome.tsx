import React, { useState, useEffect } from 'react';
import './../../css/audio/MusicHome.css';
import { LeftAudioSidebar } from '../../components/static/Audio/LeftAudioSidebar';
import { SongTable } from '../../components/regular/Audio/Music/SongTable';
import { SongInfoCard } from '../../components/regular/Audio/Music/SongInfoCard';
import { SongEditCard } from '../../components/regular/Audio/Music/SongEditCard';
import { SongMetaData, SongMetaDataSimple } from '../../../types';
import { useSelectedSongStore } from '../../state_stores/MusicStateStores';

export const Layout = () => {
    const [refreshState, setRefreshState] = useState(false);

    const [metaData, setMetaData] = useState<SongMetaDataSimple[]>([{
        name: "NO MUSIC",
        metadataFormat: '',
        id: 0,
        length: 0,
        artist: [],
        genre: [],
        playCount: 0,
        bitrate: 0,
        songRawPath: '',
        album: ''
    }]);

    //const selectedPlayMetaData = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
    const setSelectedPlayMetaData = useSelectedSongStore((state) => state.setSelectedPlaySongMetaData);
    const setAllMetaData = useSelectedSongStore((state) => state.setAllSongMetaData);

    const [selectedInfoCardMetaData, setSelectedInfoCardMetaData] = useState<SongMetaData>({
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
        comment: '',
        coverImageFormat: ''
    });

    useEffect(() => {
        (async () => {
            const result = await window.electron.ipcRenderer.invoke('audio', ["get_all_metadata_simple"]);
            setMetaData(result);         
            setAllMetaData(result);
    })();
        
    }, []); 

    
    useEffect(() => {
        const interval = setInterval(async () => {  
            if (refreshState == true){
                
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [refreshState]); 
    


    

    return (
        <div className='content_musichome'>
            <div className=''>
                <SongInfoCard sMetaData={selectedInfoCardMetaData} />
                <SongEditCard/>
            </div>
            
            <SongTable sMetaData={metaData} selectedInfoCardFunction={setSelectedInfoCardMetaData} selectedPlayDataFunction={setSelectedPlayMetaData}/>
            
        </div>
    )
  };
export default Layout;