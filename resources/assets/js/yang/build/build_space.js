define([
		"../var/document",
		"../var/trsfm",
        "../var/getStyle",
        "../var/colorCircle",
        "../var/bindEvent",
        "../var/unbindEvent",
        "../var/touchPos",
        "../func/ajax",
        "./func/reveal",
        "./func/conceal",
        "./func/configVar",
        "./func/closestPoint",
        "./func/maxPoint",
        "./func/fibonacciSphere",
        "./func/annulus",

	], function(document, trsfm, getStyle, colorCircle, bindEvent, unbindEvent, touchPos, ajax, reveal, conceal, configVar, closestPoint, maxPoint, fibonacciSphere, annulus){

	    /**
	     * 将每一个分类或者内容元素 star，均匀的分布到3D空间当中，根据 tier 分层
	     */
	    var BuildSpace = function(confObj){
            this.config = {};
            this.setup(confObj);
        };

        BuildSpace.prototype = {

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
            //控制面板部分布局
            setOperation : function(annu){
                annulus(annu);
            },//setOperation end
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

            /**
             * 选中的.star元素
             */
            aimedStar: null,

            /**
             * 页面的所有点击事件
             */
            click : function() {

                bindEvent(document, 'click', callback);

                function callback(e){

                    var target    = e.target;
                    //如果是submit 或 a 标签，则只执行默认行为
                    if (target.nodeName === 'A') {
                        return false;
                    }

                    e.preventDefault();

                    if(target.classList.contains('star')) {
                        //点击分类或者内容题目时的点击事件
                        starClick(target);

                    }else if (target.classList.contains('btn')) {
                        //.operation 包含的所有 .btn 的点击
                        btnClick(target);

                    }else if (target.classList.contains('submit')) {
                        //ajax提交表单
                        submitClick(target);
                    }

                }//callback end

                /**
                 * 所有 .star 元素，点击后环绕其出现一圈按钮，可以增删改查
                 * 并且给所有.btn 的 dataset 中添加该 star 的 id,pid,tier
                 * 显示对应的 operation
                 * @param target 点击的目标元素
                 */
                function starClick(target){

                    var ctg_id   = target.dataset.ctg_id ? target.dataset.ctg_id : 0,       //分类的ID
                        item_id  = target.dataset.item_id ? target.dataset.item_id : 0,     //内容的ID
                        ctg_box  = document.getElementById('ctg_box'),                      //分类对应的操作面板
                        item_box = document.getElementById('item_box');                     //内容对应的操作面板

                    if (ctg_id) {
                        reveal(ctg_box);
                        conceal(item_box);
                    }else if (item_id) {
                        reveal(item_box);
                        conceal(ctg_box);
                    }

                    BuildSpace.prototype.aimedStar = target;

                }//starClick end

                /**
                 * .operation 中各个 .btn 的点击事件
                 * @param target .btn 元素
                 */
                function btnClick(target) {
                    /**
                     * star 选中的 .star 元素
                     * cList target的classList
                     * form 当前操作界面中的表单
                     */
                    var star  = BuildSpace.prototype.aimedStar,
                        cList = target.classList,
                        i     = 0,
                        form;

                    if (cList.contains('ctg_btn')) {
                        form = document.getElementById('ctg_form');
                    }else if (cList.contains('item_btn')) {
                        form = document.getElementById('item_form');
                    }
                    /**
                     * 从 star 或 target 中取出 表单隐藏域需要的数据
                     * @type {NodeList}
                     */
                    var inputs = form.querySelectorAll("input[type='hidden']");

                    while (i < inputs.length) {
                        inputs[i].value = star.dataset[inputs[i].getAttribute('name')] || target.dataset[inputs[i].getAttribute('name')];
                        i++;
                    }

                    /**
                     * 如果按钮是操作表单的，会有 dataset.action
                     * 其他是操作样式或动画
                     */
                    if (target.dataset.action) {
                        form.action = target.dataset.action;
                        reveal(form);
                    }else{

                        if (cList.contains('btn-focus')) {

                        }else if (cList.contains('btn-hide')) {
                            form.action = '';
                            conceal(form);
                            conceal(form.parentNode);
                        }

                    }

                    return false;

                }//btnClick ends

                /**
                 * ajax 提交表单
                 * @param target 提交按钮，是 form 的子元素
                 */
                function submitClick(target){
                    var form = target.parentNode,
                        success;

                    success = function(res){
                        console.log(res);
                    }

                    ajax(form.action, success, new FormData(form));

                }//submitClick ends

            },//click ends

        };//BuildSpace.prototype ends


        window.BuildSpace = BuildSpace;

});