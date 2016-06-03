define([
       "../var/document",
       "../var/trsfm",

       ], function(document, trsfm){

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
        /**
         * 将若干个元素根据指定半径排成环形
         * 顺时针从12点方位开始
         * @param annulusOpt 选项
         * annulusOpt.annu 传入元素选择器和半径 array 每一个键值如下 {'selector':'', 'radius':number}
         */
        annulus: function(annulusOpt){

            var annu = annulusOpt.annu ? annulusOpt.annu : [],  //元素和半径选项数组
                ele  = [],                                      //元素数组
                len  = 0,                                       //元素的个数
                i    = 0,                                       //annu 的键名
                j    = 0,                                       //ele 的键名
                r    = 0,                                       //半径
                x    = 0,                                       //元素的x方向位移
                y    = 0,                                       //元素的y方向位移
                a    = 0;                                       //元素的顺时针弧度角

            while (i < annu.length) {

                ele = document.body.querySelectorAll(annu[i].selector);
                r   = annu[i].radius;
                len = ele.length;
                a   = Math.PI * 2 / len;

                j = x = y = 0;

                while (j < ele.length) {

                    x = r * Math.sin(a * j);
                    y = r * Math.cos(a * j) * -1;

                    ele[j].style[trsfm] = 'translate(' + x + 'px,' + y + 'px)';

                    j++;
                }

                i++;
            }

            annu = ele = null;
        }

    };


    window.BuildHome = BuildHome;

});