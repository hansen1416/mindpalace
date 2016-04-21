"use strict";
define([
		"../var/document",
		"../var/trsfm",
        "../var/colorCircle",
        "../var/bindEvent",
        "../var/unbindEvent",
        "./func/configVar",
        "./func/closestPoint",
        "./func/maxPoint",
        "./func/fibonacciSphere",

	], function(document, trsfm, colorCircle, bindEvent, unbindEvent, configVar, closestPoint, maxPoint, fibonacciSphere){

	    /**
	     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
	     */
	    var Build = function(confObj){
            this.config = {};
            this.setup(confObj);
        };

        Build.prototype = {

            setup : function (confObj) {

                var THIS     = this,
                    stage    = document.getElementById('stage'),
                    prevTier = 0,
                    R        = 200,         //每层球面实际半径
                    gap      = 100,         //每一层球面的间隔
                    unit     = 'px',        //距离单位，px、em、vw、vh
                    N        = 0,           //每一层球面上均匀分布的点的数量，不小于该层的元素数量
                    allPos   = [],          //记录每一个 id 对应的空间位置的数据
                    tierPos  = [],          //记录当前球面的所有点位位置和旋转，用于赋值，已经复制的点位即删除
                    savedPos = [];          //记录当前球面的所有点位位置和旋转，如果下一层点的数量和上层相等，则不用计算直接从这里取值

                (function init() {

                    //将设置参数传给对象
                    for (var property in confObj) {
                        THIS.config[property] = confObj[property];
                    }

                    R    = configVar(R, THIS.config.radius);
                    gap  = configVar(gap, THIS.config.gap);
                    unit = configVar(unit, THIS.config.unit);

                    //在空间中定位元素
                    diffuse();

                    tierPos = allPos = savedPos = null;

                    THIS.R = R;
                })();

                /**
                 * [fibonacciSphere 将每一层的元素均匀分布到空间当中，
                 * 每一层都在同一个球面上，并且每一个面都朝向圆心
                 * 从第一层开始，递归的取到最后一层元素
                 * 通过 translate3d 定位偏离圆心的距离
                 * 通过 rotate3d 使得面和球面相切，并且转动到和纬线相平行的角度]
                 * @author Hanlongzhen 2016-04-19 10:39
                 */
                function diffuse() {

                    var stars = stage.querySelectorAll('.tier-' + prevTier);
                    //如果没有下一层了，则停止
                    if (!stars.length) {
                        return false;
                    }

                    /**
                     * 如果是最内层，则空间中的点的数量就是元素的数量
                     * 如果不是，则先算出该层的上一层的分类数，记为 elders，再计算哪个父分类中的子分类最多，记为 sons，
                     * 然后取 elders*sons，stars.length，N 中的最大者，作为该层球面包含的点的数量
                     */
                    N = prevTier ? maxPoint(stars, N) : stars.length;

                    //当前层的半径
                    R += gap;

                    /**
                     * 如果计算出的球面的点的数量 N 等于当前储存的 savedPos
                     * 那么就直接将 savedPos 赋值给 tierPos
                     * 否则通过 fibonacciSphere 计算出球面点的位置和旋转角度
                     * 并将返回值赋值给 savedPos 和 tierPos
                     */
                    tierPos = (N == savedPos.length) ? savedPos : savedPos = fibonacciSphere(N, R);

                    /**
                     * 如果是最内层，则直接给元素定位，不需要考虑上级分类元素的位置
                     * 如果不是最内层，则先把这一层所有元素的位置和旋转信息储存起来，
                     * 再根据父分类的位置，计算元素所在位置，需要多一次循环
                     * 在最内层中给每一个元素赋予一个背景颜色，他所有的后代分类全部继承此颜色
                     * 颜色从预定义的颜色数组 colorCircle 中循环获取
                     */
                    var i   = 0,
                        pos = {},
                        clr = '';

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
                        if (prevTier) {

                            var p = allPos[stars[i].dataset.pid],
                                k = closestPoint(p, tierPos);

                            pos = tierPos[k];
                            clr = p.c;
                            //取过的点即删去
                            tierPos.splice(k, 1);

                        } else {

                            pos = tierPos[i];
                            clr = colorCircle[i % colorCircle.length];
                        }

                        stars[i].style[trsfm] =
                            "translate3d(" + pos.tx + unit + ", " + pos.ty + unit + ", " + pos.tz + unit + ")" +
                            "rotateY(" + pos.ry + "rad)" +
                            "rotateX(" + pos.rx + "rad)";

                        stars[i].style['backgroundColor'] = clr;

                        //记录每一个id对应的位置，他的子集分类依据此点计算空间中的位置
                        allPos[stars[i].dataset.id] = {x: pos.tx, y: pos.ty, z: pos.tz, c: clr};

                        i++;

                    } while (i < stars.length);

                    //深入到下一层
                    prevTier++;

                    diffuse();
                }


            },

            zoom : function() {

                bindEvent(document, 'wheel', callback);

                function callback(e) {
                    e.preventDefault();

                    var stars = document.getElementsByClassName('star');

                    for (var i = 0; i < stars.length; i++) {
                        var t = stars[i].style[trsfm];
                        stars[i].style[trsfm] = t + 'translateZ(10px)';
                    }
                }

            },

        };


        window.Build = Build;

});