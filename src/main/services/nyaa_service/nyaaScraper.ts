import { promises } from "dns";
import { NyaaWebData } from "../../../types";

const axios = require('axios'); 
const cheerio = require('cheerio'); 

const THROTTLE_TIMER = 6;
const URL_QUERY = 'https://nyaa.si/?f=0&c=0_0&q=';

export class NyaaScraper{

    //https://www.zenrows.com/blog/axios-web-scraping#cheerio-with-axios
    //https://github.com/ggorlen/cheerio-cheat-sheet
    constructor() {
        //this.requestData('armou');
    }

    async requestData(search: string): Promise<NyaaWebData[]>{
        var dataList = [] as NyaaWebData[]
        try{
            axios.get(URL_QUERY + search) 
            // @ts-ignore
            .then(({ data }) => { 
                const $ = cheerio.load(data);
                $("tr").each((index: any, element: any) =>

                    {var dataRow = {} as NyaaWebData;
                    
                    
                    /*
                    //https://stackoverflow.com/questions/22322572/remove-all-occurences-of-new-lines-and-tabs/22322705
                    [...$(row).find("td")].map(e => $(e).text().replace(/[\t\n\r]/gm, ''))
                    );
                    */
                
                    /*
                    [...$(row).find("td")].map((e) => {
                        if ($(e).text().replace(/[\t\n\r]/gm, '') == ''){
                            var text = $(e).find('a').attr('href');
                        }
                        else{
                            var text = $(e).text().replace(/[\t\n\r]/gm, '');
                        }

                        if (text.includes("/?c")){
                            return null;
                        }
                        return text;
                        
                    })
                    */

                    $(element).find("td").each((index: any, subElement: any) =>
                    {
                        switch (index){
                            case 1:
                                dataRow.title = $(subElement).text().replace(/[\t\n\r]/gm, '');
                                break;
                            case 2:
                                //dataRow.magnet = $(subElement).find('a').attr('href');
                                dataRow.magnet = $(subElement).find('a').next().attr('href');
                                break;
                            case 3:
                                dataRow.size = $(subElement).text().replace(/[\t\n\r]/gm, '');
                                break;
                            case 4:
                                dataRow.dateCreated = $(subElement).text().replace(/[\t\n\r]/gm, '');
                                break;
                            case 5:
                                dataRow.leechers = $(subElement).text().replace(/[\t\n\r]/gm, '');
                                break;
                            case 6:
                                dataRow.seeders = $(subElement).text().replace(/[\t\n\r]/gm, '');
                                break;
                            case 7:
                                dataRow.totalDownloads = $(subElement).text().replace(/[\t\n\r]/gm, '');
                                break;
                        }
                    }
                    );

                    
                    

                    dataList.push(dataRow);
                    
                    }
                );   

                console.table(dataList);
                return dataList;
            })
        } catch (error: any) {
            console.error('Error scraping Nyaa:', error.message);
        }

        
        return dataList;
    }



}