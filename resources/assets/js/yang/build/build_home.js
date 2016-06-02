define([
       "../var/document",

       ], function(document){

    /**
     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
     */
    var BuildHome = function(confObj){
        this.config = {};
        this.setup(confObj);
    };

    BuildHome.prototype = {

        setup: function (confObj) {


        },//setup end

        annulus: function(annulusOpt){
            console.log(annulusOpt);
        }

    };


    window.BuildHome = BuildHome;

});