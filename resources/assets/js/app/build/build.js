define([
		"../var/document",
		"../var/trsfm",
        "../var/colorCircle",
        "./func/closestPoint",

	], function(document, trsfm, colorCircle, closestPoint){

	    /**
	     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
	     */

	    var Build = function(confObj){
            this.config = {};
            this.setup(confObj);
        };

        Build.prototype.setup = function(confObj){

            var THIS     = this,
                stage    = document.getElementById('stage'),
                prevTier = 0,
                R        = 200,           //每层球面实际半径
                gap      = 100,            //每一层球面的间隔
                tierPos  = allPos = secColor = [];

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

                tierPos = allPos = null;
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

                var stars = stage.querySelectorAll('.tier-' + prevTier);
                var N     = stars.length;

                //如果没有下一层了，则停止
                if (!N) {return false;}

                //当前层的半径
                R += gap;
                //初始化位置和旋转数组
                tierPos = [];

                //X方向的位移，Y方向的位移，Z方向的位移，X轴的旋转，Y轴的旋转，Z位移的正负号
                var tx = ty = tz = rx = ry = sz =0;

                //code from
                //http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
                //positioning the points by spiral Fibonacci method
                /* ~2.39996323 */
                var dlong = Math.PI * (3 - Math.sqrt(5)),
                    dz    = 2.0 / N,
                    long  = 0,
                    z     = 1 - dz / 2,
                    r     = 0;

                for (var i = 0; i < N; i++) {

                    r    = Math.sqrt(1 - z * z);
                    tx   = Math.cos(long) * r * R;
                    ty   = Math.sin(long) * r * R;
                    tz   = z * R;
                    z    = z - dz;
                    long = long + dlong;
                    //如果不是 DOM 对象，则跳出当前 for 循环
                    if (typeof stars[i] !== 'object') {break;}

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
                    //如果是最内层，则直接给元素定位，不需要考虑上级分类元素的位置
                    //如果不是最内层，则先把这一层所有元素的位置和旋转信息储存起来，
                    //再根据父分类的位置，计算元素所在位置，需要多一次循环
                    if (!prevTier) {

                        var clr = colorCircle[i % colorCircle.length];

                        allPos[stars[i].dataset.id] = {x:tx, y:ty, z:tz, c:clr};

                        stars[i].style[trsfm] =
                            "translate3d("+ tx +"px, "+ ty +"px, "+ tz +"px)" +
                            "rotateY("+ ry +"rad)" +
                            "rotateX("+ rx +"rad)";

                        stars[i].style['backgroundColor'] = clr;

                    }else{
                        tierPos[i] = {tx:tx, ty:ty, tz:tz, ry:ry, rx:rx};
                    }

                }
                //对于非最内层，先获取元素父级分类的位置，
                //然后选出当前层中离父级位置最近的位置，给本层元素定位和旋转
                if (prevTier) {
                    for (var i = 0; i < N; i++) {

                        var p = allPos[stars[i].dataset.pid],
                            k = closestPoint(p, tierPos);

                        stars[i].style[trsfm] =
                            "translate3d("+ tierPos[k]['tx'] +"px, "+ tierPos[k]['ty'] +"px, "+ tierPos[k]['tz'] +"px)" +
                            "rotateY("+ tierPos[k]['ry'] +"rad)" +
                            "rotateX("+ tierPos[k]['rx'] +"rad)";

                        stars[i].style['backgroundColor'] = p.c;

                        allPos[stars[i].dataset.id] = {x:tx, y:ty, z:tz, c:p.c};

                        tierPos.splice(k, 1);
                    }
                }

                //深入到下一层
                prevTier++;

                fibonacciShpere();
            }


        }

        window.Build = Build;

})