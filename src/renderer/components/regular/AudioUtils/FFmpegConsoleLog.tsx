import { Button, Card, darken, Divider, lighten, styled, Theme, Typography } from "@mui/material";

import './FFmpegConsoleLog.css';
import { IPCMethodAPI, IPCReturnMethodAPI, IPCServicesMessageReturnInterface, ServicesEnum } from "../../../../typesIPC";
import { useEffect, useState } from "react";
import { ConsoleLog, ConsoleOutputType } from "../../../../typesAudioEdit";
import { DataGrid, GridCellCoordinates, gridClasses, GridColDef, gridExpandedRowCountSelector, gridExpandedSortedRowIdsSelector, useGridApiRef } from "@mui/x-data-grid";
import { grey, red } from "@mui/material/colors";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'line', width: 25 },
  { field: 'outputType', headerName: 'type', width: 25 },
  { field: 'output', headerName: 'output', width: 600 },
];

export const FFmpegConsoleLog = () => { 
    const[logs, setLogs] = useState<ConsoleLog[]>([]);
  
    const apiRef = useGridApiRef();

    //Main to Renderer update
    window.electron.ipcRenderer.on(ServicesEnum.audioEdit, (value) => {
        var content = value as IPCServicesMessageReturnInterface;
        
        //console.log(content);
        if (content.service == IPCReturnMethodAPI.AudioReturnIPC.returnConsoleLog){
            console.log("RECIEVING DATA")
            setLogs(content.content[0] as ConsoleLog[]);
            apiRef.current?.scrollToIndexes({rowIndex: logs.length, colIndex: 1});
        }
    })

    /*
    async function RequestConsoleLogs(){
        const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audioEdit, {service: IPCMethodAPI.AudioEditTwoWayIPC.getConsoleLog, content: [true]});  
        
        
        console.log(prevLogs.length + " " + logs.length);
        try{    
            if (prevLogs.length != logs.length){
                apiRef.current?.scrollToIndexes({rowIndex: logs.length-1, colIndex: 1});
            }
        }
        catch{
            console.log("err");
        }

        

        

        setPrevLogs(logs);
        setLogs(result);
    }
    */

    /*
    useEffect(() => {
        const interval = setInterval(() => {
            RequestConsoleLogs();
            console.log(logs); 
        }, 1000);

        return () => clearInterval(interval); 
    }, []); 
    */
 



    return(
        <Card className='console_log_card' variant='outlined' sx={{height: '19.5vh'}}>          
            <div className="console_log_card_header">
                <Typography variant="h5" component="div" style={{textAlign: "left"}}>Console Log</Typography>
                <div className="console_log_card_header">

                    <Typography component="div" >Status: {logs[logs.length-1]?.outputType === ConsoleOutputType.stdout ? "Running" : "Idle"}</Typography>   
     
                    <Button disabled>
                        Clear Logs
                    </Button>
                    <Button disabled>
                        Full Logs
                    </Button>
                    <Button disabled>
                        Current Log
                    </Button>

                    <Button disabled>
                        Auto Scroll
                    </Button>
                    
                </div>  
            </div>

            <Divider/>
            
            <div className='console_log_card_content' > 
                 <DataGrid  apiRef={apiRef} rows={logs} columns={columns} sx={{
                    /* https://github.com/mui/mui-x/issues/8104 */
                    height: '15.75vh',
                    [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                    outline: 'transparent',
                    },
                    [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                    outline: 'none',
                    },
                    ".done": {
                        bgcolor: "blue",
                        "&:hover": {
                        bgcolor: "darkblue",
                    }},
                    ".error": {
                        bgcolor: "red",
                        "&:hover": {
                        bgcolor: "red",
                    }},
                    ".stdout": {
                        bgcolor: "grey",
                        "&:hover": {
                        bgcolor: "grey",
                    }
                    ,
                    borderRadius: 0
                    }
                }}
                getRowClassName={(params) => {return params.row.outputType === 0 ? "stdout" : params.row.outputType === 2 ? "done" : "error"}} 
                disableRowSelectionOnClick={true} hideFooter columnHeaderHeight={24} rowHeight={24} />

                {/* logs?.map((logRow, index) => (
                    <div className='console_log_card_content_row' > 
                    <div>

                        <Typography component="div"> {index} </Typography>   

                    </div>

                    <Typography component="div"> {logRow} </Typography>   

                    </div>
                )) */}
                
            </div>
            
            

            
        </Card>



    );

}