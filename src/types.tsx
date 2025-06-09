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

    coverImage: string
    coverImageFormat: string

    //misc data
    songRawPath: string,
    comment: string

}