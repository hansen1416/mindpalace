define([
           "../../var/document"
       ], function (document) {
    /**
     * url 地址
     * success 成功回调函数
     * dataObj FormData 对象
     * method 请求方式
     * async 是否异步
     * beforeSend 发送前的
     */
    return function (url, success, dataObj, method, async, beforeSend) {

        let progress = document.getElementById('progress');

        method     = method || 'POST';
        async      = async || true;
        beforeSend = beforeSend || function () {

                progress.style['display'] = 'block';

            };

        beforeSend();

        let R = new XMLHttpRequest();

        R.onreadystatechange = function () {
            if (R.readyState === XMLHttpRequest.DONE) {
                if (R.status === 200) {

                    function callback(r) {

                        if (r.status) {

                            success(r);

                            //progress.sud

                            console.log(b);

                        } else {

                            //TODO
                        }

                    }

                    callback(JSON.parse(R.responseText))

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