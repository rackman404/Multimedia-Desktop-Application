import React, { useState, useEffect } from 'react';
import './../../css/audio/MusicHome.css';
import { LeftAudioSidebar } from '../../components/static/Audio/LeftAudioSidebar';
import { SongTable } from '../../components/regular/Audio/Music/SongTable';
import { SongInfoCard } from '../../components/regular/Audio/Music/SongInfoCard';
import { SongEditCard } from '../../components/regular/Audio/Music/SongEditCard';
import { SongMetaData } from '../../../types';
import { BottomMusicControl } from '../../components/static/Audio/BottomMusicControl';
import { Outlet, useNavigate } from 'react-router-dom';
import {useSelectedSongStore } from '../../state_stores/MusicStateStores';

import { Howl } from 'howler';

export const Layout = () => {
    const playState = useSelectedSongStore((state) => state.playState);
    const setPlayState = useSelectedSongStore((state) => state.setPlayState);

    const selectedPlaySongMetaData = useSelectedSongStore((state) => state.selectedPlaySongMetaData);

    const [trackObject, setTrackObject] = useState<Howl | null>(null
    );

    trackObject?.on('end', function(){
        console.log('Finished!');

        setTrackObject(null);

        setPlayState(false);
    });
    
    useEffect(() => {
        console.log("play state is: " + playState)

        if (playState == true){
            if (trackObject != null){
                trackObject.play();
            }
            else{
                if (selectedPlaySongMetaData.songRawPath != ""){
                    var newHowl = new Howl({src: selectedPlaySongMetaData.songRawPath, html5: false});
                    newHowl.play();
                    setTrackObject(newHowl);
                }
                else{
                    console.log('Metadata was empty while trying to play');
                }
            }
            
        }
        else{
            if (trackObject != null){
                trackObject.pause();
            }
        }
    }, [playState]);   

    useEffect(() => {//stop current song
        setPlayState(false);
        if (trackObject != null){
            trackObject.stop();
        }
        setTrackObject(null);

    }, [selectedPlaySongMetaData]);   

    return (
        <div>
            <><BottomMusicControl/> <LeftAudioSidebar/> <Outlet/></>
        </div>
    )
  };
export default Layout;