define([
           "../../var/document",
           "../anim/conceal",
           "../anim/reveal"
       ], function (document, conceal, reveal) {
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

                reveal(progress);

            };

        beforeSend();

        let R = new XMLHttpRequest();

        R.onreadystatechange = function () {
            if (R.readyState === XMLHttpRequest.DONE) {
                if (R.status === 200) {

                    function callback(r) {

                        if (r.status) {

                            success(r);

                            progress.classList.remove('taiji');
                            progress.classList.add('correct');

                            setTimeout(function(){
                                conceal(progress);
                            }, 2000);

                        } else {

                            //TODO
                            console.log('fan hui zhi cuo wu');
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