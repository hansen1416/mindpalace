var oReq = new XMLHttpRequest();

oReq.addEventListener("progress", updateProgress);
oReq.addEventListener("load", transferComplete);
oReq.addEventListener("error", transferFailed);
oReq.addEventListener("abort", transferCanceled);


onmessage = function (e) {

    var webSpace = new WebSpace(e.data);

    postMessage({'message': webSpace.messages('request_url')});

    oReq.open('GET', e.data.url);

    oReq.responseType = 'text';

    oReq.send(null);

};

function WebSpace(param) {
    this.lang = param.lang || 'en';

    this.en = {
        'request_url': 'connecting ' + param.url
    };

    this.zh = {
        'request_url': '正在连接 ' + param.url
    };

    this.messages = function (key) {
        return this.lang == 'en' ? this.en[key] : this.zh[key];
    }
};

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

        var match = target.response.match(/<body[\s\S]+<\/body>/gi);

        console.log(match);

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