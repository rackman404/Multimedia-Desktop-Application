const axios = require('axios'); 
const cheerio = require('cheerio'); 

const THROTTLE_TIMER = 6;
const URL_QUERY = 'https://nyaa.si/?f=0&c=0_0&q=';

export class NyaaScraper{

    //https://www.zenrows.com/blog/axios-web-scraping#cheerio-with-axios
    //https://github.com/ggorlen/cheerio-cheat-sheet
    constructor() {
        axios.get(URL_QUERY + 'armou') 
        // @ts-ignore
	    .then(({ data }) => { 
            const $ = cheerio.load(data)
            const tableData = [...$("tr")].map(row =>
                

                /*
                //https://stackoverflow.com/questions/22322572/remove-all-occurences-of-new-lines-and-tabs/22322705
                [...$(row).find("td")].map(e => $(e).text().replace(/[\t\n\r]/gm, ''))
                );
                */
                [...$(row).find("td")].map((e) => {
                    if ($(e).text().replace(/[\t\n\r]/gm, '') == ''){
                        text = $(e).find('a').attr('href');
                    }
                    else{
                        var text = $(e).text().replace(/[\t\n\r]/gm, '');
                    }

                    if (text.includes("/?c")){
                        return null;
                    }
                    return text;
                    
                })
            );

            console.table(tableData);
    
        })
    }

    playAudio(){

    }

    pauseAudio(){

    }

    seekAudio(){

    }

    setNewAudio(){

    }



}