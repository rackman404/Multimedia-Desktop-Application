import { TableContainer, Paper, Table, TableHead, TableCell, TableBody, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect, Fragment } from "react";
import { SongMetaDataSimple, ColumnEnumArray } from "../../../../types";
import { TableHeaderRow } from "../../../elements/CustomButtons";
import { useSelectedSongStore } from "../../../state_stores/MusicStateStores";
import { SongTableRow } from "../Audio/Music/SongTableRow";
import { SongTableTopBar } from "../Audio/Music/SongTableTopBar";

import { DataGrid, GridRowsProp, GridColDef, gridClasses, useGridApiContext, GridEventListener, useGridEvent, GridFooter } from '@mui/x-data-grid';
import { FFmpegConsoleLog } from "./FFmpegConsoleLog";

type FileBrowserTableProps = { //constructor variables
    rows: GridRowsProp
    rawRows: SongMetaDataSimple[]
    selectedSongFunction : (data:SongMetaDataSimple) => void
};

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Song Name', width: 200 },
  { field: 'songRawPath', headerName: 'Song Path', width: 500 },
];

export const FileBrowser = ({rows, rawRows, selectedSongFunction}: FileBrowserTableProps) => { 

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
                <GridFooter />
                {message && <Alert severity="info">{message}</Alert>}
            </Fragment>
        );
    }



    return(
        <div>
            <div >
                <DataGrid rows={rows} columns={columns} sx={{
                /* https://github.com/mui/mui-x/issues/8104 */
                height: '73vh',
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
                },
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                outline: 'none',
                },

                }}  slots={{ footer: Footer }} disableRowSelectionOnClick={true} />

                
            </div>
        </div>
    );

}