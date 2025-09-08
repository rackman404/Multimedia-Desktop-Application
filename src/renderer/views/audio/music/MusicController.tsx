import React, { useState, useEffect } from 'react';
import './MusicHome.css';
import './../../../App.css';
import { SongTable } from '../../../components/regular/Audio/Music/SongTable';
import { SongInfoCard } from '../../../components/regular/Audio/Music/SongInfoCard';
import { SongEditCard } from '../../../components/regular/Audio/Music/SongEditCard';
import { ActiveSongListState, SongMetaData } from '../../../../types';
import { BottomMusicControl } from '../../../components/static/Audio/Music/BottomMusicControl';
import { Outlet, useNavigate } from 'react-router-dom';
import {useSelectedSongStore } from '../../../state_stores/MusicStateStores';

import { Howl, Howler } from 'howler';
import { SongFullscreenOverlay } from '../../../components/static/Audio/Music/SongFullscreenOverlay';
import { IPCMethodAPI, ServicesEnum } from '../../../../typesIPC';

export const Layout = () => {
    const playState = useSelectedSongStore((state) => state.playState);
    const setPlayState = useSelectedSongStore((state) => state.setPlayState);
    
    const setSeek = useSelectedSongStore((state) => state.setCurrentSeek);
    const setVolume = useSelectedSongStore((state) => state.setCurrentVolume);

    const selectedPlaySongMetaData = useSelectedSongStore((state) => state.selectedPlaySongMetaData);
    const setSelectedPlaySongMetaData = useSelectedSongStore((state) => state.setSelectedPlaySongMetaData);

    
    const allSongMetaData = useSelectedSongStore((state) => state.allSongMetaData);
    const searchSongMetaData = useSelectedSongStore((state) => state.searchSongMetaData);
    const playlistSongMetaData = useSelectedSongStore((state) => state.playListSongMetaData);
    const searchPlayListSongMetaData = useSelectedSongStore((state) => state.searchPlayListSongMetaData);

    const trackObject = useSelectedSongStore((state) => state.currentPlayer);
    const setTrackObject = useSelectedSongStore((state) => state.setCurrentPlayer);

    // fullscreen selected song controls --------
    const fullscreenState = useSelectedSongStore((state) => state.fullscreenState);
    const setFullscreenState = useSelectedSongStore((state) => state.setFullscreenState);

    //const [fullscreenComponent, setFullscreenComponent] = useState<any>();

    const activeSongListState = useSelectedSongStore((state) => state.activeSongListState);
    const currentlySelectedSongList = useSelectedSongStore((state) => state.currentlySelectedSongList);
    const setCurrentlySelectedSongList = useSelectedSongStore((state) => state.setCurrentlySelectedSongList);

    
    useEffect(() => {

        //(async () => {

        
            switch(activeSongListState){
                case (ActiveSongListState.Main):
                    console.log("LOADING MUSIC DATA");
                    setCurrentlySelectedSongList(allSongMetaData);
                    break;
                case (ActiveSongListState.SearchMain):
                    setCurrentlySelectedSongList(searchSongMetaData);
                    break;
                case (ActiveSongListState.Playlist):
                    setCurrentlySelectedSongList(playlistSongMetaData);
                    break;
                case (ActiveSongListState.SearchPlaylist):
                    setCurrentlySelectedSongList(searchPlayListSongMetaData);
                    break;
            }
        //})();

    }, [activeSongListState, , allSongMetaData, searchSongMetaData, playlistSongMetaData, searchPlayListSongMetaData]);
    

    // fullscreen selected song controls --------

    //on mount and unmount
    useEffect(() => {
        setFullscreenState(false); //reset full screen upon reentering music service

    //called when the component is unmounted
    return () => {
        console.log("unmounted music controller");
        Howler.unload();
        setPlayState(false);

        setFullscreenState(false);
        setSelectedPlaySongMetaData(
            {
                metadataFormat: '',
                id: 0,
                name: '',
                length: 0,
                artist: [],
                album: '',
                genre: [],
                playCount: 0,
                bitrate: 0,
                songRawPath: ''
            }
        );
    };

    }, []);

    trackObject?.on('end', function(){

        if (useSelectedSongStore.getState().loopState == true){
            playSong();
        }
        else if (useSelectedSongStore.getState().shuffleState == true){
            console.log('Finished! shuffle state is:' + useSelectedSongStore.getState().shuffleState); // unsure why shuffle bool value is delayed by 1 song unless we get it directly
            
            /*
            switch (activeSongListState) {
                case ActiveSongListState.Main:
                    if (allSongMetaData != null){
                        var num = Math.floor(Math.random() * allSongMetaData.length - 1);
                        console.log('Shuffling song, new song id is: ' + num);
                            setSelectedPlaySongMetaData(allSongMetaData[num])
                    }
                    break;
                case ActiveSongListState.SearchMain:
                    if (searchSongMetaData != null){
                        var num = Math.floor(Math.random() * searchSongMetaData.length - 1);
                        console.log('Shuffling song, new song id is: ' + num);
                            setSelectedPlaySongMetaData(searchSongMetaData[num])
                    }
                    break;
                default:
                    break;
            }
            */


            if (currentlySelectedSongList != null){
                var num = Math.floor(Math.random() * currentlySelectedSongList.length - 1);
                console.log('Shuffling song, new song id is: ' + num);
                    setSelectedPlaySongMetaData(currentlySelectedSongList[num])
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
                        
                        //console.log(Howler.ctx);
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
        /*
        var list = null;
        switch (activeSongListState) {
            case ActiveSongListState.Main:
                list = allSongMetaData;
                break;
            case ActiveSongListState.SearchMain:
                list = searchSongMetaData;
                break;
            default:
                break;
        }
        */

        if (currentlySelectedSongList != null && selectedPlaySongMetaData.id < currentlySelectedSongList.length){
            if ((selectedPlaySongMetaData.id + 1) < currentlySelectedSongList.length ){
                console.log((selectedPlaySongMetaData.id + 1) + " " + currentlySelectedSongList[selectedPlaySongMetaData.id].name);
                setSelectedPlaySongMetaData(currentlySelectedSongList[selectedPlaySongMetaData.id + 1]);
            }
            else{
                setPlayState(false);
                setTrackObject(null);
                Howler.unload();
            }

        }
    }

    function prevSong(){
        /*
        var list = null;
        switch (activeSongListState) {
            case ActiveSongListState.Main:
                list = allSongMetaData;
                break;
            case ActiveSongListState.SearchMain:
                list = searchSongMetaData;
                break;
            default:
                break;
        }
        */

        if (currentlySelectedSongList != null && selectedPlaySongMetaData.id < currentlySelectedSongList.length){
            if ((selectedPlaySongMetaData.id - 1) != -1){
                //console.log((selectedPlaySongMetaData.id - 1) + " " + list[selectedPlaySongMetaData.id].name);
                setSelectedPlaySongMetaData(currentlySelectedSongList[selectedPlaySongMetaData.id - 1]);
            }
            else{
                setPlayState(false);
                Howler.unload();
                setTrackObject(null);
            }

        }
    }
    
    function playSong(){
        //setPlayState(false);

        //console.log("playing new song");

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


            window.electron.ipcRenderer.sendMessage(ServicesEnum.discord, {service: IPCMethodAPI.DiscordOneWayIPC.songNotification, content: ["Song: " + selectedPlaySongMetaData.name, "Artist: " + selectedPlaySongMetaData.artist, "0", "0", "https://www.iconsdb.com/icons/preview/gray/note-xxl.png"]});
            window.electron.ipcRenderer.sendMessage(ServicesEnum.audio, {service: IPCMethodAPI.AudioOneWayIPC.storeLastPlayedSong, content: [selectedPlaySongMetaData]});
        }
    }


    return (
        
        <div>
            { <SongFullscreenOverlay visible={fullscreenState}/> /*fullscreenComponent*/}
            {/* yet another render of a component needed to fix async iamge loading issue, must refactor entire controller into backend to realistically fix this*/}
            {/* <> <div style={{animation:  "fadeIn 0.5s"}}> <BottomMusicControl key={selectedPlaySongMetaData.id} setSeek={changeSeek} setVolume={changeVolume} setNext={nextSong} setPrev={prevSong}/><Outlet/></div></> */}
            <> <div style={{animation:  "fadeIn 0.5s"}}> <BottomMusicControl setSeek={changeSeek} setVolume={changeVolume} setNext={nextSong} setPrev={prevSong}/><Outlet/></div></>

        </div>
    )
  };
export default Layout;