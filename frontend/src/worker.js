var oReq = new XMLHttpRequest();

oReq.addEventListener("progress", updateProgress);
oReq.addEventListener("load", transferComplete);
oReq.addEventListener("error", transferFailed);
oReq.addEventListener("abort", transferCanceled);

// ...

// progress on transfers from the server to the client (downloads)
function updateProgress(oEvent) {
    if (oEvent.lengthComputable) {
        var percentComplete = oEvent.loaded / oEvent.total;
        console.log(percentComplete);
        // ...
    } else {
        // Unable to compute progress information since the total size is unknown
        console.log('Unable to compute progress information since the total size is unknown');
    }
}

function transferComplete(evt) {
    var target = evt.target;

    if (target.status == 200) {
        
        console.log(target.response);
        
    } else {
        console.log(target.statusText);
    }
}

function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
    console.log("The transfer has been canceled by the user.");
}

onmessage = function (e) {

    console.log(e.data.url);

    oReq.open('GET', e.data.url);

    oReq.responseType = 'text';

    oReq.send(null);

};