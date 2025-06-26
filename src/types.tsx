
export type SongMetaData = {
    //OS metadata
    format: string
    fileSize: number //should be in mb

    //Format specific metadata
    metadataFormat: string,
    id: number,
    name: string,
    length: number, //in seconds
    artist: string[],
    album: string,
    genre: string[],
    playCount: number,
    bitrate: number, //in kbps (-1 if no bitrate can be provided)

    coverImage: any
    coverImageFormat: string

    //misc data
    songRawPath: string,
    comment: string

}

//simplified for performance
export type SongMetaDataSimple = {
    //Format specific metadata
    metadataFormat: string,
    id: number,
    name: string,
    length: number, //in seconds
    artist: string[],
    album: string,
    genre: string[],
    playCount: number,
    bitrate: number, //in kbps (-1 if no bitrate can be provided)

    //misc data
    songRawPath: string,
}

export type NyaaWebData = {
    title: string;
    magnet : string;
    size: string;
    dateCreated : string;
    leechers: number;
    seeders: number;
    totalDownloads: number;
}

export type SongLyricAPIData = {
    timestamps: number[]
    lyrics: string[]
    isInstrumental: boolean
}