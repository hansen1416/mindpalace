define([
       "../var/document",
       "../var/bindEvent",
       "../var/urls",
       "../func/ajax",
       "./func/configVar",
       "./func/annulus"

       ], function(document, bindEvent, urls, ajax, configVar, annulus){

    /**
     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
     */
    var BuildHome = function(confObj){
        this.config = {};
        this.setup(confObj);
    };

    BuildHome.prototype = {

        setup: function (confObj) {

            var THIS = this;

            (function init() {

                //将设置参数传给对象
                for (var property in confObj) {
                    THIS.config[property] = confObj[property];
                }

                var annu = configVar(annu, THIS.config.annu);
                //环形排列按钮
                annulus(annu);


            })();

        },//setup end

        click: function() {

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
                            url     = urls.authenticate;
                            data    = new FormData(document.getElementById('portrait_form'));
                            success = function (res) {
                                console.log(res);
                            };

                            break;
                        case 'logout':  //登出

                            break;
                        default:        //非控制按钮直接停止
                            return false;
                    }

                    ajax(url, success, data);
                }



            }


        },//click end

    };


    window.BuildHome = BuildHome;

});