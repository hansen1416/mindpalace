onmessage = function (e) {

    var webSpace = new WebSpace(e.data);

    postMessage({message: webSpace.messages('request_url', webSpace.url)});

    webSpace.bindEvent();

    webSpace.oReq.open('GET', e.data.url);

    webSpace.oReq.responseType = 'text';

    webSpace.oReq.send(null);

};

function WebSpace(param) {
    this.lang = param.lang || 'en';

    this.url = param.url;

    this.en = {
        request_url            : 'connecting %%',
        loading_progress       : 'loading content, %%',
        unable_get_progress    : 'Unable to compute progress information since the total size is unknown',
        transfer_failed        : 'An error occurred while transferring the file',
        transfer_canceled      : 'The transfer has been canceled by the user',
        transfer_complete_error: 'Transfer completed and an error occurred %%',
        transfer_complete      : 'Transfer completed and processing the content',
        no_body                : 'unable to read the content'
    };

    this.zh = {
        request_url            : '正在连接 %%',
        loading_progress       : '加载内容， %%',
        unable_get_progress    : '总大小未知，无法计算已加载部分',
        transfer_failed        : '连接错误',
        transfer_canceled      : '连接已取消',
        transfer_complete_error: '连接完成，产生错误 %%',
        transfer_complete      : '连接完成，处理内容',
        no_body                : '无法读取内容'
    };

    this.messages = function (key, variable) {

        var str;

        switch (this.lang) {
            case 'zh':
                str = this.zh[key];
                break;
            default:
                str = this.en[key];
        }

        return variable === undefined
            ? str
            : str.replace(/%%/g, variable);
    };

    this.oReq = new XMLHttpRequest();

    var space = this;

    this.C = [];

    this.bindEvent = function () {
        this.oReq.addEventListener("progress", this.updateProgress);
        this.oReq.addEventListener("load", this.transferComplete);
        this.oReq.addEventListener("error", this.transferFailed);
        this.oReq.addEventListener("abort", this.transferCanceled);
    };

    // progress on transfers from the server to the client (downloads)
    this.updateProgress = function (oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = (oEvent.loaded / oEvent.total) * 100;
            postMessage({message: space.messages('loading_progress', percentComplete + '%')});
        } else {
            // Unable to compute progress information since the total size is unknown
            postMessage({message: space.messages('unable_get_progress')});
        }
    };

    this.transferFailed = function (evt) {
        postMessage({message: space.messages('transfer_failed')});
    };

    this.transferCanceled = function (evt) {
        postMessage({message: space.messages('transfer_canceled')});
    };

    this.transferComplete = function (evt) {
        var target = evt.target;

        if (target.status == 200) {

            postMessage({message: space.messages('transfer_complete')});
            //get the title of the website, use it as the base ctg
            var title = target.response.match(/<head[\s\S]+<title>(.*?)<\/title>/m);

            title = title ? title[1] : this.url;

            space.C.push({title: title, content: ''});

            //get the body part
            var body = target.response.match(/<body.*?>([\s\S]+)<\/body>/m);

            if (!body) {
                return postMessage({message: space.messages('no_body')});
            }

            //remove header and footer
            var bodyStr = body[1].replace(/<header[\s\S]+<\/header>|<footer[\s\S]+<\/footer>/m, '');
            //get all the inside links on the page
            var links   = bodyStr.match(/href="\/(?!\/).*?"/g);

            //split string by </h\d>
            var bodyArr = bodyStr.split(/<h\d\s/gm);

            if (bodyArr.length <= 1) {
                return postMessage({message: space.messages('no_body')});
            }
            //remove the first element, it probably not contain any actual content, usually the list
            bodyArr.shift();

            var titles = [];

            for (var i = 0; i < bodyArr.length; i++) {
                //1.title, 2.num, 3.content
                var titleTag = bodyArr[i].match(/>(.*?)<\/h(\d)>([\s\S]+)$/m);

                if (titleTag) {

                    titles.push({
                                    title  : titleTag[1],
                                    num    : titleTag[2],
                                    content: titleTag[3],
                                    son    : []
                                });
                }
            }

            titles = makeDataTree(titles);

            console.log(titles);


        } else {
            postMessage({message: space.messages('transfer_complete_error', target.statusText)});
        }
    };

}

function makeDataTree(data) {

    for (var h = 6; h >= 1; h--) {

        for (var i = 0; i < data.length; i++) {

            if (data[i] && data[i].num == h) {

                for (var j = i; j >= 0; j--) {

                    if (data[j] && data[j].num < h) {
                        data[j].son.push(data[i]);
                        data[i] = null;
                        break;
                    }
                }
            }

        }
    }

    return data.filter(function (value) {
        return value != null;
    });

}

