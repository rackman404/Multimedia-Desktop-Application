

export function checkTextOverflow(text: HTMLDivElement){
    //console.log("Text Overflow Check: " +  text.offsetWidth + ", " + text.scrollWidth + ", " );

    if (text.offsetHeight < text.scrollHeight || text.offsetWidth < text.scrollWidth){
        return true;
    }
    else{
        return false;
    }
}