import { TableContainer, Paper, Table, TableHead, TableCell, TableBody, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { SongMetaDataSimple, ColumnEnumArray } from "../../../../types";
import { TableHeaderRow } from "../../../elements/CustomButtons";
import { useSelectedSongStore } from "../../../state_stores/MusicStateStores";
import { SongTableRow } from "../Audio/Music/SongTableRow";
import { SongTableTopBar } from "../Audio/Music/SongTableTopBar";

import { DataGrid, GridRowsProp, GridColDef, gridClasses, useGridApiContext, GridEventListener, useGridEvent, GridFooter } from '@mui/x-data-grid';
import { FFmpegConsoleLog } from "./FFmpegConsoleLog";

import './FileBrowser.css';
import { IPCReturnMethodAPI, IPCServicesMessageReturnInterface, ServicesEnum } from "../../../../typesIPC";
import { ConsoleLog } from "../../../../typesAudioEdit";

type FileBrowserTableProps = { //constructor variables
    rows: GridRowsProp
    rawRows: SongMetaDataSimple[]
    selectedSongFunction : (data:SongMetaDataSimple) => void

    showDuplicate: boolean
};

export type FileSongMetaDataSimple = { //constructor variables
    id: number
    name: string
    songRawPath: string
    duplicated: boolean
};

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Song Name', width: 150 },
    { field: 'songRawPath', headerName: 'Song Path', width: 500 },
];

const columnsExtended: GridColDef[] = [
    { field: 'duplicated', headerName: 'Converted', width: 1 }, 
    { field: 'name', headerName: 'Song Name', width: 150 },
    { field: 'songRawPath', headerName: 'Song Path', width: 500 },
];

export const FileBrowser = ({rows, rawRows, showDuplicate, selectedSongFunction}: FileBrowserTableProps) => { 


    function Footer() {
        const [message, setMessage] = useState('');
        const apiRef = useGridApiContext();

        const handleRowClick: GridEventListener<'rowClick'> = (params) => {
            selectedSongFunction(rawRows[params.id as number]);
            
            //setMessage(`Song "${params.row.name}" Selected (${rawRows[params.id as number]})`);
        };

        useGridEvent(apiRef, 'rowClick', handleRowClick);

        return (
            <Fragment>
                <GridFooter/>
                {message && <Alert severity="info">{message}</Alert>}
            </Fragment>
        );
    }



    return(
        <div className="file_browser">
            <DataGrid rows={rows} columns={showDuplicate === true ? columnsExtended : columns} sx={{
            /* https://github.com/mui/mui-x/issues/8104 */
            height: '36.5vh',
            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
            outline: 'transparent',
            },
            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
            },
            ".duplicated": {
                    bgcolor: "green",
                    "&:hover": {
                    bgcolor: "darkgreen",
                }},
            borderRadius: 0

            }} getRowClassName={(params) => {return params.row.duplicated === true ? "duplicated" : "normal"}} 
            slots={{ footer: Footer }} disableRowSelectionOnClick={true} columnHeaderHeight={24} rowHeight={24} />

            
        </div>
    );

}