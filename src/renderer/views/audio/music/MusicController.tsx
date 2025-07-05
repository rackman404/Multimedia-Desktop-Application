import React, { useState, useEffect } from 'react';
import './MusicHome.css';
import './../../../App.css';
import { SongTable } from '../../../components/regular/Audio/Music/SongTable';
import { SongInfoCard } from '../../../components/regular/Audio/Music/SongInfoCard';
import { SongEditCard } from '../../../components/regular/Audio/Music/SongEditCard';
import { SongMetaData } from '../../../../types';
import { BottomMusicControl } from '../../../components/static/Audio/Music/BottomMusicControl';
import { Outlet, useNavigate } from 'react-router-dom';
import {useSelectedSongStore } from '../../../state_stores/MusicStateStores';

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


    //on mount and unmount
    useEffect(() => {

    //called when the component is unmounted
    return () => {
        console.log("unmounted music controller");
        Howler.unload();
        setPlayState(false);
    };

    }, []);

    trackObject?.on('end', function(){

        if (useSelectedSongStore.getState().loopState == true){
            playSong();
        }
        else if (useSelectedSongStore.getState().shuffleState == true){
            console.log('Finished! shuffle state is:' + useSelectedSongStore.getState().shuffleState); // unsure why shuffle bool value is delayed by 1 song unless we get it directly
            if (allSongMetaData != null){
            var num = Math.floor(Math.random() * allSongMetaData.length - 1);
            console.log('Shuffling song, new song id is: ' + num);
                setSelectedPlaySongMetaData(allSongMetaData[num])
            }
        }
        else{
            nextSong();

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
                    var newHowl = new Howl({src: decodeURIComponent(selectedPlaySongMetaData.songRawPath), html5: false});
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
       playSong();
    }, [selectedPlaySongMetaData]);   


    useEffect(() => {
            const interval = setInterval(() => {  
                
                if (playState == true){      
                    if (trackObject != null){        
                        //console.log("music controller, current song seek is: " + trackObject?.seek());             
                        setSeek(trackObject.seek());  

                    }
                }
    
            }, 100);
    
            return () => clearInterval(interval);
    }, [playState, trackObject]); 



    useEffect(() => {
            const interval = setInterval(() => {  
                
                if (playState == true){      
                    if (trackObject != null){        
                        //console.log("music controller, current song seek is: " + trackObject?.seek());             
                        setSeek(trackObject.seek());  
                        
                        console.log(Howler.ctx);
                    }
                }
    
            }, 1000);
    
            return () => clearInterval(interval);
    }, [playState, trackObject]); 


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

    function nextSong(){
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
    }

    function prevSong(){
        if (allSongMetaData != null){
            if ((selectedPlaySongMetaData.id - 1) != -1 ){
                console.log((selectedPlaySongMetaData.id - 1) + " " + allSongMetaData[selectedPlaySongMetaData.id].name);
                setSelectedPlaySongMetaData(allSongMetaData[selectedPlaySongMetaData.id - 1]);
            }
            else{
                setPlayState(false);
                setTrackObject(null);
            }

        }
    }
    
    function playSong(){
        //setPlayState(false);

        console.log("playing new song");

        trackObject?.stop();
        trackObject?.unload();
        Howler.unload();
        
        if (selectedPlaySongMetaData.songRawPath != ""){
            setSeek(0);
            console.log(selectedPlaySongMetaData.songRawPath);
            var newHowl = new Howl({src: (selectedPlaySongMetaData.songRawPath), html5: true});
            newHowl.play();
            setTrackObject(newHowl);
            setPlayState(true);


            window.electron.ipcRenderer.sendMessage('discord', ["song_notification", "Song: " + selectedPlaySongMetaData.name, "Artist: " + selectedPlaySongMetaData.artist, "0", "0", "https://www.iconsdb.com/icons/preview/gray/note-xxl.png"]);
        }
    }


    return (
        
        <div>
            {/* yet another render of a component needed to fix async iamge loading issue, must refactor entire controller into backend to realistically fix this*/}
            <> <div style={{animation:  "fadeIn 0.5s"}}> <BottomMusicControl key={selectedPlaySongMetaData.id} setSeek={changeSeek} setVolume={changeVolume} setNext={nextSong} setPrev={prevSong}/><Outlet/></div></>
        </div>
    )
  };
export default Layout;