define([
       "../var/document",
       "../var/bindEvent",
       "../func/ajax",
       "./func/configVar",
       "./func/annulus"

       ], function(document, bindEvent, ajax, configVar, annulus){

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

                annulus(annu);


            })();

        },//setup end

        click: function() {

            bindEvent(document, 'click', callback);

            function callback(e){

                var tid     = e.target.id,
                    url     = '',
                    data    = {},
                    success;

                switch (tid)
                {
                    case 'login':
                        url = '/public/auth/auth/authenticate';
                        data = {'email': 'hansen1416@163.com', 'password': 'hs198546'};
                        success = function(res){
                            console.log(res);
                        }
                        break;
                    case 'logout':

                        break;
                }

                ajax(url, success, data);

            }


        },//click end

    };


    window.BuildHome = BuildHome;

});