import { memo, useEffect } from "react"
import { SongMetaDataSimple } from "../../../../../types"
import { CardActionArea, TableRow, TableCell, SxProps } from "@mui/material"
import { fmtMSS } from "../../../../Common"
import { SongToggleButton } from "./SongToggleButton"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { grey } from "@mui/material/colors"

const dataRowSX: SxProps = {
  display: "table-row",
  '&[data-active]': {
    backgroundColor: 'action.selected',
  },
  '&:hover': {
    backgroundColor: 'action.selectedHover',
  },
  
};

const dataRowSelectedSX: SxProps = {
  display: "table-row",
  '&[data-active]': {
    backgroundColor: 'action.selected',
  },
  '&:hover': {
    backgroundColor: 'action.selectedHover',
  },
  background: grey[800],
};

type SongLiveLyricProps = { //instance variables
  sMetaDataThisRef: SongMetaDataSimple
  indexRef: number

  columnOnRef: boolean[]
  currentSongRef: boolean
  selectedButtonStateRef: boolean
  setSelectStatusRef: (index: number) => void
  selectedPlayDataFunctionRef: (data:SongMetaDataSimple) => void
  selectFullDataInfoCardRef: (rowData: SongMetaDataSimple) => void

  selectedRef: boolean

  //highlightedRef: boolean
}

export const SongTableRow = memo(({sMetaDataThisRef, indexRef, columnOnRef, currentSongRef, selectedButtonStateRef, setSelectStatusRef, selectedPlayDataFunctionRef, selectFullDataInfoCardRef, selectedRef}: SongLiveLyricProps) => { 
    //on mount and unmount
    useEffect(() => {

    //console.log("table row for: " + sMetaDataThisRef.name + " was rerendered");

    //called when the component is unmounted
    return () => {

    };
    }, []);
    
    return (
        <CardActionArea className='row_songtable' id={"tablerow" + sMetaDataThisRef.id} key={"tablerow" + sMetaDataThisRef.id}  component={TableRow} sx={selectedRef === true ? dataRowSelectedSX : dataRowSX } onClick={() => selectFullDataInfoCardRef(sMetaDataThisRef)} 
            onDoubleClick=
            {() => selectedPlayDataFunctionRef(sMetaDataThisRef)}
            > 
                {columnOnRef[0] === true ? <TableCell  component="th" scope="row">
                <SongToggleButton key={selectedButtonStateRef.toString()} songID={indexRef} setListStatus={setSelectStatusRef} selectedRef={selectedButtonStateRef}/>
                </TableCell> : undefined}
                
                {columnOnRef[1] === true ? <TableCell component="th" scope="row"> {currentSongRef === true ? <PlayCircleIcon/> : " "} </TableCell> : undefined}
                {columnOnRef[2] === true ? <TableCell  component="th" scope="row">{sMetaDataThisRef.name}</TableCell> : undefined}
                {columnOnRef[3] === true ? <TableCell align="left">{fmtMSS(sMetaDataThisRef.length)}</TableCell> : undefined}
                {columnOnRef[4] === true ? <TableCell align="left">{sMetaDataThisRef.artist?.map((artist, index) => ( index === 0 ? artist : " and " + artist))}</TableCell> : undefined}
                {columnOnRef[5] === true ? <TableCell align="left">{sMetaDataThisRef.genre?.map((genre, index) => ( index === 0 ? genre : ", " + genre))}</TableCell> : undefined}
                {columnOnRef[6] === true ? <TableCell align="left">{Math.round(sMetaDataThisRef.bitrate)}</TableCell> : undefined}   
                {columnOnRef[7] === true ? <TableCell align="left">{Math.round(sMetaDataThisRef.id)}</TableCell> : undefined}   
        </CardActionArea>

    )

});


//export default memo(SongTableRow);