import { SongMetaDataSimple, SongSearchTypeState } from "../../../../types";

export class AudioSearch{

    constructor() {

    }

    async searchSongs(search: string, columnSearch: SongSearchTypeState, metadataList: SongMetaDataSimple[] | undefined): Promise<SongMetaDataSimple[] | undefined>{
        var searchedList = [] as SongMetaDataSimple[];

        

        if (metadataList != undefined){
            //https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
            var newArray = structuredClone(metadataList); //must create a deep copy or else we will end up modifiying the original
            
            for (var i = 0; i < metadataList.length; i++){ 
                switch (columnSearch) {
                    case SongSearchTypeState.Name:
                        if (newArray[i].name.toLowerCase().includes(search.toLowerCase()) == true){
                            var original = newArray[i];
                            original.id = searchedList.length;
                            searchedList.push(original);

                            console.log("Found " + original.name);
                        }
                        break;
                    case SongSearchTypeState.Genre:
                        if (newArray[i].genre[0].toLowerCase().includes(search.toLowerCase()) == true){
                            var original = newArray[i];
                            original.id = searchedList.length;
                            searchedList.push(original);

                            console.log("Found " + original.name);
                        }
                        break;
                    case SongSearchTypeState.Album:
                        if (newArray[i].album.toLowerCase().includes(search.toLowerCase()) == true){
                            var original = newArray[i];
                            original.id = searchedList.length;
                            searchedList.push(original);

                            console.log("Found " + original.name);
                        }
                        break;
                    case SongSearchTypeState.Artist:
                        if (newArray[i].artist[0].toLowerCase().includes(search.toLowerCase()) == true){
                            var original = newArray[i];
                            original.id = searchedList.length;
                            searchedList.push(original);

                            console.log("Found " + original.name);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        
        
        return searchedList;
    }
}