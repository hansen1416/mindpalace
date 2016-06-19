define([
    "../var/document",
    "../var/trsfm",
    "../var/getStyle",
    "../var/colorCircle",
    "../var/bindEvent",
    "../var/unbindEvent",
    "../var/touchPos",
    "../func/ajax/ajax",
    "../func/anim/focus",
    "../func/anim/reveal",
    "../func/anim/conceal",
    "../func/math/closestPoint",
    "../func/math/maxPoint",
    "../func/math/fibonacciSphere",
    "../func/style/annulus",

], function (document, trsfm, getStyle, colorCircle, bindEvent, unbindEvent, touchPos, ajax, focus, reveal, conceal, closestPoint, maxPoint, fibonacciSphere, annulus) {

    class BuildSpace {

        constructor(param) {

            this.stage     = param.stage;
            this.rotateObj = param.rotateObj;
            this.radius    = param.radius;       //每层球面实际半径
            this.gap       = param.gap;     //每一层球面的间隔
            this.N         = 0;             //每一层球面上均匀分布的点的数量，不小于该层的元素数量
            this.prevTier  = 0;
            this.allPos    = [];            //记录每一个 id 对应的空间位置的数据
            this.tierPos   = [];            //记录当前球面的所有点位位置和旋转，用于赋值，已经复制的点位即删除
            this.savedPos  = [];            //记录当前球面的所有点位位置和旋转，如果下一层点的数量和上层相等，则不用计算直接从这里取值
        }

        spheres() {


            //在空间中定位元素
            this.diffuse();

            delete this.N;
            delete this.prevTier
            delete this.allPos
            delete this.tierPos
            delete this.savedPos;
        }


        diffuse() {
            var stars = this.stage.querySelectorAll('.tier-' + this.prevTier);
            //如果没有下一层了，则停止
            if (!stars.length) {
                return false;
            }

            /**
             * 如果是最内层，则空间中的点的数量就是元素的数量
             * 如果不是，则先算出该层的上一层的分类数，记为 elders，再计算哪个父分类中的子分类最多，记为 sons，
             * 然后取 elders*sons，stars.length，N 中的最大者，作为该层球面包含的点的数量
             */
            this.N = this.prevTier ? maxPoint(stars, this.N) : stars.length;

            //当前层的半径
            this.radius += this.gap;

            /**
             * 如果计算出的球面的点的数量 N 等于当前储存的 savedPos
             * 那么就直接将 savedPos 赋值给 tierPos
             * 否则通过 fibonacciSphere 计算出球面点的位置和旋转角度
             * 并将返回值赋值给 savedPos 和 tierPos
             */
            this.tierPos = (this.N == this.savedPos.length) ? this.savedPos : this.savedPos = fibonacciSphere(this.N, this.radius);

            /**
             * 如果是最内层，则直接给元素定位，不需要考虑上级分类元素的位置
             * 如果不是最内层，则先把这一层所有元素的位置和旋转信息储存起来，
             * 再根据父分类的位置，计算元素所在位置，需要多一次循环
             */
            var i   = 0,
                pos = {};

            do {
                //如果不是 DOM 对象，则跳出当前 for 循环
                //if (!(stars[i] instanceof Object)) {
                //    continue;
                //}

                /**
                 * 外层球面通过父级分类的位置和当前球面的位置数组 tierPos，
                 * 计算出应当取哪一个当前点，取到此点之后即将此点从 tierPos 中删除，
                 * 如果是最内层，因为 N == stars.length，依序取 tierPos 中的点即可
                 */
                if (this.prevTier) {

                    var p = this.allPos[stars[i].dataset.pid],
                        k = closestPoint(p, this.tierPos);

                    pos = this.tierPos[k];
                    //取过的点即删去
                    this.tierPos.splice(k, 1);

                } else {

                    pos = this.tierPos[i];
                }

                stars[i].style[trsfm] =
                    "translate3d(" + pos.tx + "px, " + pos.ty + "px, " + pos.tz + "px)" +
                    "rotateY(" + pos.ry + "rad)" +
                    "rotateX(" + pos.rx + "rad)";

                stars[i].style[trsfm] = getStyle(stars[i], 'transform');

                //记录每一个ctg_id对应的位置，他的子集分类依据此点计算空间中的位置
                if (stars[i].dataset.ctg_id) {
                    this.allPos[stars[i].dataset.ctg_id] = {x: pos.tx, y: pos.ty, z: pos.tz};
                }

                i++;

            } while (i < stars.length);

            //深入到下一层
            this.prevTier++;

            this.diffuse();
        }





    }

    window.BuildSpace = BuildSpace;
});