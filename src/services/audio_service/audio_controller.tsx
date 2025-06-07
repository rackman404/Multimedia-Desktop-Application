import { AudioBroker } from "./audio_IPC_broker";
import { AudioPlayBackController } from "./audio_playback_controller";


export class AudioManager{
    broker: AudioBroker;
    audioPlayback: AudioPlayBackController;

    constructor() {
        this.broker = new AudioBroker(this);
        this.audioPlayback = new AudioPlayBackController();
    }

}