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
                R        = 200,         //每层球面实际半径
                gap      = 100,         //每一层球面的间隔
                N        = 0,           //每一层球面上均匀分布的点的数量，不小于该层的元素数量
                allPos   = [],
                tierPos  = [],
                savedPos = [];

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
                diffuse();

                tierPos = allPos = savedPos = null;
        	})();

            /**
             * [fibonacciShpere 将每一层的元素均匀分布到空间当中，
             * 每一层都在同一个球面上，并且每一个面都朝向圆心
             * 从第一层开始，递归的取到最后一层元素
             * 通过 translate3d 定位偏离圆心的距离
             * 通过 rotate3d 使得面和球面相切，并且转动到和纬线相平行的角度]
             * @author Hanlongzhen 2016-04-19 10:39
             */
            function diffuse() {

                var stars = stage.querySelectorAll('.tier-' + prevTier);
                //如果没有下一层了，则停止
                if (!stars.length) {return false;}

                /**
                 * 如果是最内层，则空间中的点的数量就是元素的数量
                 * 如果不是，则先算出该层的上一层的分类数，记为 elders，再计算哪个父分类中的子分类最多，记为 sons，
                 * 然后取 elders*sons，stars.length，N 中的最大者，作为该层球面包含的点的数量
                 */
                N = prevTier ? maxPoint(stars, N) : stars.length;

                console.log(N, stars.length);
                //当前层的半径
                R += gap;

                if (N == savedPos.length) {
                    tierPos = savedPos;
                }else {

                    tierPos = savedPos = fibonacciShpere(N, R);
                }

                /**
                 * 如果是最内层，则直接给元素定位，不需要考虑上级分类元素的位置
                 * 如果不是最内层，则先把这一层所有元素的位置和旋转信息储存起来，
                 * 再根据父分类的位置，计算元素所在位置，需要多一次循环
                 * 在最内层中给每一个元素赋予一个背景颜色，他所有的后代分类全部继承此颜色
                 * 颜色从预定义的颜色数组 colorCircle 中循环获取
                 */
                for (var i = 0; i < stars.length; i++) {
                    //如果不是 DOM 对象，则跳出当前 for 循环
                    if (!(stars[i] instanceof Object)) {
                        continue;
                    }

                    var tx = ty = tz = ry = rx = 0;

                    if (prevTier) {

                        var p = allPos[stars[i].dataset.pid],
                            k = closestPoint(p, tierPos);

                            tx = tierPos[k]['tx'];
                            ty = tierPos[k]['ty'];
                            tz = tierPos[k]['tz'];
                            ry = tierPos[k]['ry'];
                            rx = tierPos[k]['rx'];
                        
                        stars[i].style[trsfm] =
                            "translate3d("+ tierPos[k]['tx'] +"px, "+ tierPos[k]['ty'] +"px, "+ tierPos[k]['tz'] +"px)" +
                            "rotateY("+ tierPos[k]['ry'] +"rad)" +
                            "rotateX("+ tierPos[k]['rx'] +"rad)";

                        stars[i].style['backgroundColor'] = p.c;

                        allPos[stars[i].dataset.id] = {x:tx, y:ty, z:tz, c:p.c};

                        tierPos.splice(k, 1);

                    }else{

                        var clr = colorCircle[i % colorCircle.length];
                            tx  = tierPos[i]['tx'];
                            ty  = tierPos[i]['ty'];
                            tz  = tierPos[i]['tz'];
                            ry  = tierPos[i]['ry'];
                            rx  = tierPos[i]['rx'];

                        allPos[stars[i].dataset.id] = {x:tx, y:ty, z:tz, c:clr};

                        stars[i].style[trsfm] =
                            "translate3d(" + tx + "px, " + ty + "px, " + tz + "px)" +
                            "rotateY(" + ry + "rad)" +
                            "rotateX(" + rx + "rad)";

                        stars[i].style['backgroundColor'] = clr;

                    }
                }

                //深入到下一层
                prevTier++;

                diffuse();
            }

            /**
             * 则先算出该层的上一层的分类数，记为 elders，再计算哪个父分类中的子分类最多，记为 sons，
             * 然后取 elders*sons，arr.length，n 中的最大者，作为该层球面包含的点的数量
             * @param arr
             * @param n
             * @returns {number}
             */
            function maxPoint(arr, n) {
                /**
                 * keys 储存父级分类的 id
                 * values 储存每一个父级分类包含的子分类的个数
                 * j 表示 values 的键名
                 */
                var keys   = [],
                    values = [],
                    j      = -1;

                for (var i = 0; i < arr.length; i++) {

                    if (!(arr[i] instanceof Object)) {
                        continue;
                    }
                    var pid = arr[i].dataset.pid;

                    if (keys[pid] === undefined) {

                        j++;
                        keys[pid] = true;
                        values[j] = 1;
                    }else{
                        values[j]++;
                    }

                }

                var f = values.length,
                    m = Math.max(...values);

                return Math.max(f * m, arr.length, n);
            }

            //code from
            //http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
            //positioning the points by spiral Fibonacci method
            function fibonacciShpere(N, R) {
                var dlong = Math.PI * (3 - Math.sqrt(5)),  // ~2.39996323
                    dz    = 2.0 / N,
                    long  = 0,
                    z     = 1 - dz / 2,
                    r     = 0;
                //X方向的位移，Y方向的位移，Z方向的位移，X轴的旋转，Y轴的旋转，Z位移的正负号
                var tx = ty = tz = rx = ry = sz = 0,
                    arr = [];

                for (var i = 0; i < N; i++) {

                    r    = Math.sqrt(1 - z * z);
                    tx   = Math.cos(long) * r * R;
                    ty   = Math.sin(long) * r * R;
                    tz   = z * R;
                    z    = z - dz;
                    long = long + dlong;

                    //判断元素是在z轴正方向还是负方向
                    sz = tz / Math.abs(tz);
                    sz = isNaN(sz) ? 1 : sz;
                    //如果是在Z轴正方向，
                    //则把元素沿y轴多旋转180度，使得正面朝向圆心
                    if (sz > 0) {
                        ry = Math.atan(tx / tz) + Math.PI;
                    } else {
                        ry = Math.atan(tx / tz);
                    }

                    rx = Math.asin(ty / R);

                    arr[i] = {tx: tx, ty: ty, tz: tz, ry: ry, rx: rx};

                }

                return arr;
            }

        }

        window.Build = Build;

});