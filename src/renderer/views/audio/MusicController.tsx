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

import { Howl, Howler } from 'howler';

export const Layout = () => {
    const playState = useSelectedSongStore((state) => state.playState);
    const setPlayState = useSelectedSongStore((state) => state.setPlayState);

    
    const setSeek = useSelectedSongStore((state) => state.setCurrentSeek);
    const setVolume = useSelectedSongStore((state) => state.setCurrentVolume);

    const selectedPlaySongMetaData = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
    const setSelectedPlaySongMetaData = useSelectedSongStore((state) => state.setSelectedPlaySongMetaData);

    const allSongMetaData = useSelectedSongStore((state) => state.allSongMetaData);

    const trackObject = useSelectedSongStore((state) => state.currentPlayer);
    const setTrackObject = useSelectedSongStore((state) => state.setCurrentPlayer);

    trackObject?.on('end', function(){
        console.log('Finished!');

        

        if (allSongMetaData != null){
            if ((selectedPlaySongMetaData.id + 1) < allSongMetaData.length ){
                console.log((selectedPlaySongMetaData.id + 1) + " " + allSongMetaData[selectedPlaySongMetaData.id].name);
                setSelectedPlaySongMetaData(allSongMetaData[selectedPlaySongMetaData.id + 1]);
            }
            else{
                setPlayState(false);
                setTrackObject(null);
            }

        }
        


    });
    
    useEffect(() => {// pause and play song
        console.log("play state is: " + playState)

        if (playState == true){
            if (trackObject != null){
                trackObject.play();
            }
            else{
                if (selectedPlaySongMetaData.songRawPath != ""){
                    var newHowl = new Howl({src: selectedPlaySongMetaData.songRawPath, html5: true});
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

    useEffect(() => {//set new song
        //setPlayState(false);

        console.log("playing new song");

        trackObject?.stop();
        trackObject?.unload();
        
        if (selectedPlaySongMetaData.songRawPath != ""){
            var newHowl = new Howl({src: selectedPlaySongMetaData.songRawPath, html5: true});
            newHowl.play();
            setTrackObject(newHowl);
            setPlayState(true);
        }


    }, [selectedPlaySongMetaData]);   


    useEffect(() => {
            const interval = setInterval(() => {  
                
                if (playState == true){      
                    if (trackObject != null){        
                        //console.log("music controller, current song seek is: " + trackObject?.seek());             
                        setSeek(trackObject.seek());                       
                    }
                }
    
            }, 1000);
    
            return () => clearInterval(interval);
    }, [playState, trackObject]); 

    

    window.addEventListener("beforeunload", (event) => {
        trackObject?.stop();
        trackObject?.unload();
        setPlayState(false);
        console.log("UNLOADING MUSIC CONTROLLER");
    });

    function changeSeek(newSeek: number){
        if (trackObject != null){
            trackObject.seek(newSeek);
            setSeek(newSeek);
        }
    }

    function changeVolume(newVolume: number){
        if (trackObject != null){
            Howler.volume(newVolume/100);
            setVolume(newVolume);
        }
    }
    

    return (
        
        <div>
            <><BottomMusicControl setSeek={changeSeek} setVolume={changeVolume}/> <LeftAudioSidebar/> <Outlet/></>
        </div>
    )
  };
export default Layout;