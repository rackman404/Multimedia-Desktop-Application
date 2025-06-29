

export function checkTextOverflow(text: HTMLDivElement){
    if (text.offsetHeight < text.scrollHeight || text.offsetWidth < text.scrollWidth){
        return true;
    }
    else{
        return false;
    }
}