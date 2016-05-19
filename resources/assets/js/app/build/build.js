"use strict";
define([
		"../var/document",
		"../var/trsfm",
        "../var/getStyle",
        "../var/colorCircle",
        "../var/bindEvent",
        "../var/unbindEvent",
        "../var/touchPos",
        "./func/reveal",
        "./func/conceal",
        "./func/configVar",
        "./func/closestPoint",
        "./func/maxPoint",
        "./func/fibonacciSphere",

	], function(document, trsfm, getStyle, colorCircle, bindEvent, unbindEvent, touchPos, reveal, conceal, configVar, closestPoint, maxPoint, fibonacciSphere){

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

                    //给每一个区域赋予不同的颜色
                    section();

                    //在空间中定位元素
                    diffuse();

                    tierPos = allPos = savedPos = null;

                    THIS.tiers = prevTier - 1;

                })();

                /**
                 * 取最内层的元素，在 style_section 中给每一个相应的 section 添加不同的样式
                 */
                function section() {

                    var core  = stage.querySelectorAll('.tier-' + prevTier),
                        sheet = document.getElementById('style_section').sheet || document.getElementById('style_section').styleSheet,
                        i     = 0,
                        clr   = '';

                    while (i < core.length) {
                        clr = colorCircle[i % colorCircle.length];

                        sheet.insertRule('.sec-' + core[i].dataset.ctg_id + '{border: 2px solid ' +clr+ ';}', i);

                        i++;
                    }
                }

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
                        if (prevTier) {

                            var p = allPos[stars[i].dataset.pid],
                                k = closestPoint(p, tierPos);

                            pos = tierPos[k];
                            //取过的点即删去
                            tierPos.splice(k, 1);

                        } else {

                            pos = tierPos[i];
                        }

                        stars[i].style[trsfm] =
                            "translate3d(" + pos.tx + unit + ", " + pos.ty + unit + ", " + pos.tz + unit + ")" +
                            "rotateY(" + pos.ry + "rad)" +
                            "rotateX(" + pos.rx + "rad)";

                        stars[i].style[trsfm] = getStyle(stars[i], 'transform');

                        //记录每一个ctg_id对应的位置，他的子集分类依据此点计算空间中的位置
                        if (stars[i].dataset.ctg_id) {
                            allPos[stars[i].dataset.ctg_id] = {x: pos.tx, y: pos.ty, z: pos.tz};
                        }

                        i++;

                    } while (i < stars.length);

                    //深入到下一层
                    prevTier++;

                    diffuse();
                }


            },//setup end
            //同心球的缩放
            zoom : function() {

                bindEvent(document, 'wheel', callback);

                var stage = document.getElementById('stage'),
                    gap   = this.config.gap,
                    unit  = this.config.unit,
                    tiers = this.tiers,
                    sheet = document.getElementById('style_zoom').sheet || document.getElementById('style_zoom').styleSheet;

                /**
                 * 滚轮向下转动一次隐藏一层，直到隐藏倒数第二层，同时所有显示的元素向球心移动一个 gap 的距离
                 * 滚轮向上转动一次显示一层，直到显示出最内层，同时所有显示的元素背向球心移动一个 gap 的距离
                 * 通过向页面中的 style[id='style_zoom'] 添加和删除规则来显示和隐藏元素
                 * styleSheet 中的规则条数应该和隐藏的层数相同
                 * @param e
                 */
                function callback(e) {
                    e.preventDefault();

                    var sign = e.deltaY / Math.abs(e.deltaY),           //sign > 0收缩，sign < 0 扩展
                        lens = sheet.cssRules.length,
                        tier = sign > 0 ? lens : lens - 1;

                    //如果当前需要隐藏的层大于等于最外层，则不可以再扩展
                    //如果当前需要隐藏的层小于等于最外层，则不可以再收缩
                    if ((tier >= tiers && sign > 0) || (tier < 0 && sign < 0)) {
                        return false;
                    }

                    if (sign > 0) {
                        sheet.insertRule('.tier-'+ tier +'{display:none;}', tier);
                    }else{
                        sheet.deleteRule(tier);
                    }

                    var not = '';

                    //获取已经隐藏掉的层，在其后不选择
                    do {
                        not += ':not(.tier-'+ tier +')';
                        tier--;
                    } while (tier > -1);

                    var stars = stage.querySelectorAll('.star' + not),
                        str   = gap * sign + unit,
                        i     = 0;
                    //缩放所有显示的元素
                    do {
                        stars[i].style[trsfm] = getStyle(stars[i], 'transform') + 'translateZ('+ str +')';
                        i++;
                    } while (i < stars.length);

                }

            },//zoom end
            //页面的所有点击事件
            click : function() {

                bindEvent(document, 'click', callback);

                function callback(e){

                    var target    = e.target,
                        classList = target.classList,
                        core      = document.getElementById('core'),
                        operation = document.getElementById('operation'),
                        form      = operation.querySelector('form');

                    if (target.type !== 'submit') {e.preventDefault();}

                    if (target.id == 'core'){

                        reveal(operation);
                        conceal(target);

                    }else if(classList.contains('star')) {

                        starClick(target);

                    }else if (classList.contains('btn')) {
                        //#operation 包含的所有 .btn 的点击
                        btnClick(target);

                    }

                    /**
                     * 所有 .star 元素，点击后环绕其出现一圈按钮，可以增删改查
                     * 并且给所有.btn 的 dataset 中添加该 star 的 id,pid,tier
                     * 显示 operation
                     * @param target 点击的目标元素
                     */
                    function starClick(target){

                        form.querySelector("input[name='ctg_id']").value  = target.dataset.ctg_id ? target.dataset.ctg_id : 0;
                        form.querySelector("input[name='item_id']").value = target.dataset.item_id ? target.dataset.item_id : 0;
                        form.querySelector("input[name='pid']").value     = target.dataset.pid;
                        form.querySelector("input[name='tier']").value    = target.dataset.tier;
                        form.querySelector('textarea').placeholder        = target.dataset.title;

                        conceal(core);
                        reveal(operation);

                    }//starClick end

                    /**
                     * #operation 中各个 .btn 的点击事件
                     * @param target
                     */
                    function btnClick(target) {

                        var url     = '',
                            tid     = target.id,
                            act     = form.querySelector("input[name='act']"),
                            ctg_id  = form.querySelector("input[name='ctg_id']").value,
                            item_id = form.querySelector("input[name='item_id']").value;

                        //首先将 act 和 form.action 置空
                        act.value   = '';
                        form.action = '';

                        /**
                         * 根据按钮的 id ，加入相应的操作
                         */
                        switch (tid)
                        {
                        case 'focus':

                            break;
                        case 'addDesc':
                            act.value = 'desc';
                            
                            if (ctg_id != 0) {
                                url = target.dataset.ctg_action;
                            }
                            
                            break;
                        case 'addSibl':
                            act.value = 'sibl';

                            if (ctg_id != 0) {
                                url = target.dataset.ctg_action;
                            }

                            break;
                        case 'editSelf':

                            if (ctg_id != 0) {
                                url = target.dataset.ctg_action;
                            }

                            break;
                        case 'hideOper':
                            conceal(operation);
                            reveal(core);
                            break;
                        }

                        form.action = url;

                        if (url) {
                            reveal(form);
                        }else{
                            conceal(form);
                        }


                    }//btnClick end


                }//callback end

            },//click end

        };


        window.Build = Build;

});