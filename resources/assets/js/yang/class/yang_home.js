define([
           "../var/document",
           "../func/event/bindEvent",
           "../func/ajax/ajax",
           "../func/style/annulus"

       ], function(document, bindEvent, ajax, annulus){


    class YangHome {

        constructor() {

        }

        static setRings(param) {
            annulus(param);
        }

        click() {

            bindEvent(document, 'click', callback);

            function callback(e){
                //所有控制按钮的点击事件
                if (e.target.classList.contains('panel')) {

                    var tid  = e.target.id,     //按钮的id
                        url  = '',              //请求地址
                        data = null,            //传送的数据
                        success;                //成功回调函数

                    switch (tid)
                    {
                        case 'login':   //登录
                            url     = document.getElementById('login_url').value;
                            data    = new FormData(document.getElementById('portrait_form'));
                            success = function (res) {
                                //登陆成功
                                if (res.status) {
                                    window.location.reload(true);
                                    //登陆失败
                                }else{

                                }
                            };

                            break;
                        case 'logout':  //登出
                            url     = document.getElementById('logout_url').value;
                            success = function (res) {
                                console.log(res);
                                if (res.status) {
                                    window.location.reload(true);
                                    //登陆失败
                                }else{

                                }
                            };

                            break;
                        default:        //非控制按钮直接停止
                            return false;
                    }

                    ajax(url, success, data);
                }

            }

        }
        //click ends

    }

    window.YangHome = YangHome;


});