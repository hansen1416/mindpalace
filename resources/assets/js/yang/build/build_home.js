define([
       "../var/document",
       "../func/ajax",
       "./func/configVar",
       "./func/annulus"

       ], function(document, ajax, configVar, annulus){

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

            ajax('/', callback);

            var callback = function() {
                console.log('callback func');
            }

        },//click end

    };


    window.BuildHome = BuildHome;

});