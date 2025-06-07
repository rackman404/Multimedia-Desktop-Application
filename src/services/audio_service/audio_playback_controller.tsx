import {Howl, Howler} from 'howler';

export class AudioPlayBackController{
    #currentAudioStream: Howl;

    constructor() {
        console.log("audio");
        this.#currentAudioStream = new Howl({
        src: ['D:/Programming/Major Projects/FFmpeg-GUI/Build/ConvertedFiles/329.mp3']
        });

        this.#currentAudioStream.play();
    }

    playAudio(){

    }

    pauseAudio(){

    }

    seekAudio(){

    }

    setNewAudio(){

    }



}