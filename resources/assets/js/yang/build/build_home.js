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

                annulus(annu);


            })();

        },//setup end

        click: function() {

            bindEvent(document, 'click', callback);

            function callback(e){

                if (e.target.classList.contains('panel')) {

                    var tid  = e.target.id,
                        url  = '',
                        form = null,
                        data = null,
                        success;

                    switch (tid)
                    {
                        case 'login':
                            url     = urls.authenticate;
                            form    = document.getElementById('portrait_form');
                            data    = new FormData(form);
                            success = function (res) {
                                console.log(res);
                            };

                            break;
                        case 'logout':

                            break;
                        default:
                            return false;
                    }

                    ajax(url, success, data);
                }



            }


        },//click end

    };


    window.BuildHome = BuildHome;

});