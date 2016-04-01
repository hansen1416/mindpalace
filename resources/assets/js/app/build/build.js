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
                radius      = 200;

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
             * [diffuse 将每一层的元素均匀分布到空间当中，每一层都在同一个球面上
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

                            var rotate = [],
                                trans  = '';
                            //如果是第一层，则需要计算初始位置
                            var phi   = Math.PI / n * (i + 1),
                                theta = 2 * Math.PI / n * (i + 1),
                                trans = SphericalToCartesian(theta, phi, radius * (start_tier + 1));

                            stars[i].style[prefixJs+"Transform"] = "translate3d("+ trans +")";
                        }

                    }

                    start_tier++;

                    diffuse();
                }

            }

            /**
             * [SphericalToCartesian 将球面坐标系转化为笛卡尔坐标系]
             * @AuthorName Hanlongzhen
             * @DateTime   2016-04-01T11:51:30+0800
             * @param      {[number]} theta [longtitude]
             * @param      {[number]} phi [colatitude]
             * @param      {[number]} r [radius]
             */
            function SphericalToCartesian(theta, phi, r) {

                var a = [];

                a[0] = r * Math.sin(phi) * Math.cos(theta) + 'px';
                a[1] = r * Math.sin(phi) * Math.sin(theta) + 'px';
                a[2] = r * Math.cos(phi) + 'px';

                return a.join(',');
            }




        }

        window.Build = Build;

})