define([
		"../var/document",
		"../var/prefixJs",
        "../var/prefixCss",
        "../var/trsfm",
        "../var/getStyle",

	], function(document, prefixJs, prefixCss, trsfm, getStyle){

	    /**
	     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
	     */

	    var Build = function(confObj){
            this.config = {};
            this.setup(confObj);
        };

        Build.prototype.setup = function(confObj){

			var THIS 		= this,
				common_clas = 'star',
                start_tier  = 0,
                stage       = document.getElementById('stage'),
                core        = 200;
                gap         = 150;

        	(function init(){

        		//将设置参数传给对象
                for(var property in confObj){
                    THIS.config[property] = confObj[property];
                }

                if (THIS.config.common_clas !== undefined) {
                	common_clas = THIS.config.common_clas;
                }

                diffuse();

        	})();

            /**
             * [diffuse 将每一层的元素均匀分布到空间当中，
             * 每一层都在同一个球面上，并且每一个面都朝向圆心
             * 从第一层开始，递归的取到最后一层元素
             * 通过 rotate3d 定位空间中的旋转角度
             * 通过 translate3d 定位偏离圆心的距离]
             * @AuthorName Hanlongzhen
             * @DateTime   2016-03-28T21:58:56+0800
             * @return     {[type]} [description]
             */
            function diffuse() {

                var stars = stage.querySelectorAll('.tier-' + start_tier),
                    n     = stars ? stars.length : 0;
                //如果能取到元素
                if (n) {
                    //遍历处于这一层的元素
                    for (var i in stars) {

                        //如果是 DOM 对象
                        if (typeof stars[i] === 'object') {

                            r = core + start_tier * gap;
                            
                        }

                    }

                    start_tier++;

                    diffuse();
                }

            }


        }

        window.Build = Build;

})