define([
           "../../var/document"
       ], function (document) {
    /**
     * url 地址
     * callback 成功回调函数
     * dataObj FormData 对象
     * method 请求方式
     * async 是否异步
     */
    return function (url, callback, dataObj, method, async, beforeSend) {

        method     = method || 'POST';
        async      = async || true;
        beforeSend = beforeSend || function () {

                let progress = document.getElementById('progress');

                progress.style['display'] = 'block';

            }

        beforeSend();

        let R = new XMLHttpRequest();

        R.onreadystatechange = function () {
            if (R.readyState === XMLHttpRequest.DONE) {
                if (R.status === 200) {
                    callback(JSON.parse(R.responseText));
                } else {
                    throw 'error occured during request';
                }
            }
        };

        R.open(method, url, async);
        // cross-site request forgery protection
        R.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf_token"]').getAttribute('content'));
        R.send(dataObj);

    }

});