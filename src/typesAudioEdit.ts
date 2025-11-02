

export type ConversionData = {
    statusCode: number, //let 100 = ongoing process, 200 = success, 300 = failure
    output: string[]
}

export type ConsoleLog = {
    id: number
    output: string
    outputType: ConsoleOutputType
}

export enum ConsoleOutputType {
    stdout, error, endOfConversion
}