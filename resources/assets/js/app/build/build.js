define([
		"../var/document",
		"../var/prefixJs",

	], function(document, prefixJs){

	    /**
	     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
	     */

	    var Build = function(confObj){
            this.config = {};
            this.setup(confObj);
        };

        Build.prototype.setup = function(confObj){

            var THIS       = this;
            var stage      = document.getElementById('stage');
            var start_tier = 0;
            var R          = 200;           //每层球面实际半径
            var gap        = 80;            //每一层球面的间隔
            var pos1       = [];
            var pos2       = [];

        	(function init(){

        		//将设置参数传给对象
                for(var property in confObj){
                    THIS.config[property] = confObj[property];
                }

                if(THIS.config.radius !== undefined){
                    R = THIS.config.radius;
                }

                if(THIS.config.gap !== undefined){
                    gap = THIS.config.gap;
                }

                //在空间中定位元素
                fibonacciShpere();

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

                //如果没有下一层了，则停止
                if (!N) {return false;}

                var tx = 0;     //X方向的位移
                var ty = 0;     //Y方向的位移
                var tz = 0;     //Z方向的位移

                var rx = 0;     //X轴的旋转
                var ry = 0;     //Y轴的旋转
                var sz = 1;     //Z位移的符号

                //当前层的半径
                R += gap * start_tier;
                pos1 = [];
                //code from
                //http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
                //positioning the points by spiral Fibonacci method
                /* ~2.39996323 */
                var dlong = Math.PI * (3 - Math.sqrt(5));
                var dz    = 2.0 / N;
                var long  = 0;
                var z     = 1 - dz / 2;
                var r     = 0;

                for (var k = 0; k < N; k++){

                    r    = Math.sqrt(1 - z * z);
                    tx   = Math.cos(long) * r * R;
                    ty   = Math.sin(long) * r * R;
                    tz   = z * R;
                    z    = z - dz;
                    long = long + dlong;
                    //如果不是 DOM 对象，则跳出当前 for 循环
                    if (typeof stars[k] !== 'object') {break;}

                    //判断元素是在z轴正方向还是负方向
                    sz = tz / Math.abs(tz);
                    sz = isNaN(sz) ? 1 : sz;
                    //如果是在Z轴正方向，
                    //则把元素沿y轴多旋转180度，使得正面朝向圆心
                    if (sz > 0){
                        ry = Math.atan(tx/tz) + Math.PI;
                    }else{
                        ry = Math.atan(tx/tz);
                    }

                    rx = Math.asin(ty/R);

                    if (!start_tier) {
                        stars[k].style[prefixJs+"Transform"] =
                            "translate3d("+ tx +"px, "+ ty +"px, "+ tz +"px)" +
                            "rotateY("+ ry +"rad)" +
                            "rotateX("+ rx +"rad)";

                        pos2[stars[k].dataset.id] = {tx:tx, ty:ty, tz:tz, ry:ry, rx:rx};
                    }else{
                        pos1[k] = {tx:tx, ty:ty, tz:tz, ry:ry, rx:rx};
                    }

                }

                if (start_tier) {
                    for (var i = 0; i < N; i++) {
                        stars[i].style[prefixJs+"Transform"] =
                            "translate3d("+ pos1[i]['tx'] +"px, "+ pos1[i]['ty'] +"px, "+ pos1[i]['tz'] +"px)" +
                            "rotateY("+ pos1[i]['ry'] +"rad)" +
                            "rotateX("+ pos1[i]['rx'] +"rad)";
                    }
                }

                //深入到下一层
                start_tier++;

                fibonacciShpere();
            }



        }

        window.Build = Build;

})