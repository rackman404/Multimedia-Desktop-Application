import { SongLyricAPIData, SongMetaDataSimple } from "../../../../../types";
import { AudioLocalLyricReader } from "./audioLocalLyricReader";
import { AudioWebLyricReader } from "./audioWebLyricReader";


export class AudioLyricReaderManager{

    webLyricReader: AudioWebLyricReader;
    localLyricReader: AudioLocalLyricReader;

    constructor() {
        this.webLyricReader = new AudioWebLyricReader();
        this.localLyricReader = new AudioLocalLyricReader();
    }

    async requestLyrics(songSearchData: SongMetaDataSimple): Promise<SongLyricAPIData>{
        var lyrics = await this.localLyricReader.requestLyricData(songSearchData);

        if (lyrics.statusCode != 100){ //failed to get lyrics, find online next
            lyrics = await this.webLyricReader.requestLyricData(songSearchData);
        }

        return lyrics;

    }

}