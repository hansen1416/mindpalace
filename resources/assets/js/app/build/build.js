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

			var THIS 		= this;
			var common_clas = '.star';
            var start_tier  = 0;
            var stage       = document.getElementById('stage');
            var R           = 200;           //每层球面实际半径
            var gap         = 80;            //每一层球面的间隔
            

        	(function init(){

        		//将设置参数传给对象
                for(var property in confObj){
                    THIS.config[property] = confObj[property];
                }

                if (THIS.config.common_clas !== undefined) {
                	common_clas = THIS.config.common_clas;
                }

                fibonacciShpere();
                // diffuse();

        	})();

            /**
             * [fibonacciShpere 将每一层的元素均匀分布到空间当中，
             * 每一层都在同一个球面上，并且每一个面都朝向圆心
             * 从第一层开始，递归的取到最后一层元素
             * 通过 translate3d 定位偏离圆心的距离
             * 通过 rotate3d 使得面和球面相切，并且转动到和纬线相平行的角度]
             * @AuthorName Hanlongzhen
             * @DateTime   2016-03-28T21:58:56+0800
             * @return     {[type]} [description]
             */
            function fibonacciShpere() {

                var stars = stage.querySelectorAll('.tier-' + start_tier);
                var N     = stars.length;

                if (!N) {return false;}

                var dlong = Math.PI*(3-Math.sqrt(5));  /* ~2.39996323 */
                var dz    = 2.0/N;
                var long  = 0;
                var z     = 1 - dz/2;

                var tx = 0;
                var ty = 0;
                var tz = 0;

                var rx = 0;
                var ry = 0;
                var rz = 0;

                var a = [];

                R += gap * start_tier;

                for (var k = 0; k < N; k++){
                    
                    r    = Math.sqrt(1-z*z);
                    a[k] = {x:Math.cos(long)*r, y:Math.sin(long)*r, z:z};
                    z    = z - dz;
                    long = long + dlong;
                    //如果不是 DOM 对象，则跳出当前 for 循环
                    if (typeof stars[k] !== 'object') {break;}

                    tx = a[k]['x'] * R;
                    ty = a[k]['y'] * R;
                    tz = a[k]['z'] * R;

                    rx = Math.asin(ty/R) * -0;
                    ry = Math.atan(tx/tz);
                    rz = 0;

                    stars[k].style[prefixJs+"Transform"] = 
                            "translateX("+ tx +"px)" +
                            "translateY("+ ty +"px)" +
                            "translateZ("+ tz +"px)" +
                            "rotateX("+ rx +"rad)" +
                            "rotateY("+ ry +"rad)" +
                            "rotateZ("+ rz +"rad)";

                }

                start_tier++;
                
                fibonacciShpere();
            }


        }

        window.Build = Build;

})