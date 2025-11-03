

export type ConversionData = {
    coverPath: string,
    
    songName: string,
    songArtist: string[],
    songGenre: string[],
    songAlbum: string,

    fileFormat: string,
    embeddedComment: string,
    fileName: string,

    fileRawPath: string
}

export const DEFAULT_CONVERSION_DATA: ConversionData = {
    coverPath: "",
    songName: "",
    songArtist: [],
    songGenre: [],
    songAlbum: "",
    fileFormat: "",
    embeddedComment: "",
    fileName: "",
    fileRawPath: ""
}

export type ConsoleLog = {
    id: number
    output: string
    outputType: ConsoleOutputType //let 100 = ongoing process, 200 = success, 300 = failure; change current version later
}

export enum ConsoleOutputType {
    stdout, error, endOfConversion
}