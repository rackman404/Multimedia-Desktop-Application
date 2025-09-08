
const { workerData, parentPort } = require('worker_threads');

const buffer = workerData.data;


var binary = '';
var bytes = new Uint8Array( buffer );
var len = bytes.byteLength;

var count = 0;
//var progressCheck = 0;

var timeTilLoadingIndicator = 0;
var loadedIndicator = false;
for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );

    count++;
}
//return window.btoa( binary );

var result = btoa(binary);

parentPort.postMessage(count);
//parentPort.postMessage(result);