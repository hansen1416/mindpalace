define([

           "../../var/prefixJs",
           "../../var/prefixCss",
           "../../func/style/trsfm",
           "../../func/style/getStyle",
           "../../func/math/touchPos",
           "../../func/math/findPos",
           "../../func/math/multiplyMatrix3d",
           "../../func/math/calcAngle",
           "../../func/math/calcZ",
           "../../func/math/normalize",
           "../../func/math/crossVector",
           "../../func/math/rotateMatrix",
           "../../func/math/matrixToArr",
           "../../func/event/bindEvent",
           "../../func/event/unbindEvent",
           "../../func/ajax/ajax",
           "../../func/anim/requestAnim",
           "../../func/anim/cancelAnim",
           "../../func/anim/roll",
           "../../func/anim/reveal",
           "../../func/anim/conceal",
           "../../func/anim/resetTrackball",
           "../layout/YangSpaceLayout"

       ], function (prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, multiplyMatrix3d, calcAngle, calcZ, normalize, crossVector, rotateMatrix, matrixToArr,
                    bindEvent, unbindEvent, ajax, requestAnim, cancelAnim, roll, reveal, conceal, resetTrackball, YangSpaceLayout) {
    "use strict";

    let o               = null,
        editor          = new WeakMap(),
        aimedStar       = new WeakMap(),
        radius          = Symbol(),
        pos             = Symbol(),
        mouseDownVector = Symbol(),
        mouseMoveVector = Symbol(),
        impulse         = Symbol(),
        axis            = Symbol(),
        oldAngle        = Symbol(),
        angle           = Symbol(),
        oldTime         = Symbol(),
        time            = Symbol(),
        omega           = Symbol(),
        resetMotion     = Symbol(),
        omegaCap        = Symbol(),
        lambda          = Symbol(),
        rs              = Symbol(),
        rd              = Symbol(),
        rsf             = Symbol(),
        originTransform = Symbol();

    const createCtgUrl = document.getElementById('create_ctg_url').value;       //创建分类的URL
    const updateCtgUrl = document.getElementById('update_ctg_url').value;       //编辑分类的URL
    const ctgDetailUrl = document.getElementById('ctg_detail_url').value;       //获取分类详情的URL
    const moveCtgUrl   = document.getElementById('move_ctg_url').value;         //改变分类的父分类

    class YangSpaceEvent extends YangSpaceLayout {

        constructor(param) {
            super(param);

            this.rotateObj        = param.rotateObj;
            //starting matrix of every action
            this.startMatrix      = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            //visual trackball radius
            this[radius]          = 0;
            //top & left of the stage
            this[pos]             = 0;
            //the vector of the cursor position when the mouse down
            this[mouseDownVector] = [];
            //the vector of the cursor position during the mouse is moving
            this[mouseMoveVector] = [];
            //true有惯性，false没有惯性
            this[impulse]         = false;
            //rotating axis, calculated by mouseDownVector & mouseMoveVector
            this[axis]            = [1, 1, 1];
            //旋转实施之前的角度
            this[oldAngle]        = 0;
            //rotate3d angle旋转的角度
            this[angle]           = 0;
            //鼠标点击时刻的时间
            this[oldTime]         = 0;
            //鼠标放开时刻的时间
            this[time]            = 0;
            //单位角速度
            this[omega]           = 0;
            //当鼠标点击目标元素时，是否停止当前运动
            this[resetMotion]     = true;
            //单位角速度的cap,必须是大于0的数，默认为0.5
            this[omegaCap]        = 0.5;
            //阻力系数，越大阻力越大，默认0.01
            this[lambda]          = 0.01;
            //requestAnimationFrame slide
            this[rs]              = null;
            //requestAnimationFrame deceleration
            this[rd]              = null;
            //slide 的标示
            this[rsf]             = false;
            //最初的变换样式
            this[originTransform] = null;

            o = this;
        }

        set setStartMatrix(arr) {
            this.startMatrix = arr;
        }

        get getStartMatrix() {
            return this.startMatrix;
        }

        /**
         * trackball 整体思路
         * trackball 的半径取的是 stage 的半径，stage 的宽高必须一致，
         * 否则会出现旋转时不符合实际的运动轨迹的情况
         * step1 页面加载后，先获取stage的top、left，去stage的宽、高中小的一个作为trackball的半径，获取目标元素的transform属性，并将其转换为matrix3d的数组，赋值给startmatrix。并给stage元素绑定mousedown事件。
         * step2 旋转运动开始时，判断元素是否还在运动，若还在运动则停止。更新元素的旋转角度。获取鼠标点击的坐标。解除目标元素的mousedown事件，给document绑定mousemove & mouseup。
         * step3 旋转过程中，根据鼠标移动轨迹计算出每一次的坐标，计算出旋转轴axis和旋转角度angle，通过axis和angle计算出matrix3d，做出动画。
         * step4 旋转结束后，将document上的两个绑定事件mousemove & mouseup解除，重新给目标元素绑定mousedown。判断是否设置了冲量，以及冲量是否大于0，若有冲量计算出角速度omega，角度参数使用1000/60，之后设置减速度。若没有冲量或者冲量耗尽，则去除动画，计算出当前的startmatrix，将angle和omega归0；]
         * @param trackballParam confObj [stage, obj, impulse]
         */
        trackball(trackballParam) {

            this[impulse]     = trackballParam.impulse;
            this[resetMotion] = trackballParam.resetMotion;
            this[omegaCap]    = trackballParam.omegaCap;
            this[lambda]      = trackballParam.lambda;

            //旋转空间的top、left
            this[pos] = findPos(this.stage);

            //取空间的宽高中大的一个作为trackball半径
            this[radius] = this.stage.offsetWidth < this.stage.offsetHeight ? this.stage.offsetHeight / 2 : this.stage.offsetWidth / 2;

            //元素最初设置的transform值
            this[originTransform] = getStyle(this.rotateObj, prefixCss + "transform");

            if (this[originTransform] != "none") {

                this.setStartMatrix = matrixToArr(this[originTransform]);
            }
            //目标元素绑定mousedown事件
            bindEvent(this.stage, "mousedown", this.rotateStart);

            /**
             * 跟随鼠标3d转动部分需要用到的函数
             * rotateStart
             * rotate
             * rotateFinish
             * slide
             * angularDeceleration
             * deceleration
             * stopMotion
             */

        }//trackball ends

        /**
         * 旋转开始阶段，计算出鼠标点击时刻的坐标，
         * 并由此计算出点击时的空间三维向量，
         * 初始化时间和角度，在目标元素上移除事件，
         * 在document上绑定事件
         * @param e
         */
        rotateStart(e) {

            /**
             * 如果初始动画正在运行
             * 获取当前的 transform 位置
             * 移除动画样式
             * 设置 startMatrix 和 旋转元素的位置 = 当前的 transform 位置
             */
            if (o.rotateObj.classList.contains('rotate_animation')) {

                let rotateObj    = o.rotateObj,
                    currentStyle = getStyle(rotateObj, prefixCss + "transform");

                rotateObj.classList.remove('rotate_animation');

                o.setStartMatrix       = matrixToArr(currentStyle);
                rotateObj.style[trsfm] = currentStyle;
            }

            //如果之前的惯性没有耗尽，停止运动
            if (o[resetMotion] && o[omega] !== 0) {
                o.stopMotion()
            }

            //非常重要，如果没有这一句，会出现鼠标点击抬起无效
            //e.preventDefault();

            o[mouseDownVector] = calcZ(touchPos(e), o[pos], o[radius], true);
            //获得当前已旋转的角度
            o[oldAngle]        = o[angle];

            o[oldTime] = new Date().getTime();
            //绑定三个事件
            unbindEvent(o.stage, "mousedown", o.rotateStart);
            bindEvent(window.document, "mousemove", o.rotate);
            bindEvent(window.document, "mouseup", o.rotateFinish);

        }//rotateStart ends

        /**
         * 旋转函数，
         * 计算鼠标经过位置的向量，计算旋转轴，旋转的角度，
         * 请求动画，更新每一帧的时间
         * @param e
         * @returns {boolean}
         */
        rotate(e) {
            //非常重要，如果没有这一句，会出现鼠标点击抬起无效
            e.preventDefault();
            //计算鼠标经过轨迹的空间坐标
            o[mouseMoveVector] = calcZ(touchPos(e), o[pos], o[radius], true);

            //当mouseMoveVector == mouseDownVector时（点击事件，有时候不是点击事件也会出现这种情况，有待进一步调查），向量单位化会出现分母为0的状况，这样便可以避免出现axis里面有NaN的情况，解决了卡死问题。
            if (o[mouseMoveVector][0] == o[mouseDownVector][0] && o[mouseMoveVector][1] == o[mouseDownVector][1] && o[mouseMoveVector][2] == o[mouseDownVector][2]) {
                return false;
            }

            //以下这段会使在计算惯性运动时，只计算最后一个转动帧里的角度变化，而不是从鼠标点下起的角度变化，比较符合实际的运动模型。
            o[oldAngle] = o[angle];
            //旋转轴为空间向量的叉积
            o[axis]     = normalize(crossVector(o[mouseDownVector], o[mouseMoveVector]));
            //旋转的角度
            o[angle]    = calcAngle(o[mouseDownVector], o[mouseMoveVector]);
            //将 slide animation 标示置为 false，表示动画运行
            o[rsf]      = false;
            o.slide();
        }//rotate ends

        /**
         * 旋转结束，
         * 移除document上的两个绑定事件mousemove & mouseup，
         * 重新给目标元素绑定事件mousedown，
         * 计算初始矩阵，取消动画
         * @param e
         */
        rotateFinish(e) {
            e.preventDefault();
            //解除 document 上的 mousemove 和 mouseup 事件
            unbindEvent(window.document, 'mousemove', o.rotate);
            unbindEvent(window.document, 'mouseup', o.rotateFinish);
            bindEvent(o.stage, 'mousedown', o.rotateStart);
            //当第一下为点击时，axis还是空数组，会出现计算出的startMatrix包含NaN的情况，所以在这里解除绑定的事件并且结束流程。其实可以不需要判断里面的数字是否为NaN，在前面rotate哪里已经把这种情况预防了，在这里只是以防万一
            if (o[axis] == [] || isNaN(o[axis][0]) || isNaN(o[axis][1]) || isNaN(o[axis][2])) {
                return false;
            }

            o[time] = new Date().getTime();
            //计算单位角速度，这里不能在 下面的 if 条件里面，否则会没有惯性
            o.angularDeceleration();

            if (o[impulse] && o[omega] > 0) {

                o[rsf] = true;
                requestAnim(o.deceleration);     //有单位角速度做惯性运动
            } else {
                o.stopMotion();
            }

            //what's the condition mean? to be found out..
            // else if(!(isNaN(this[axis][0]) || isNaN(this[axis][1]) || isNaN(this[axis][2]))){
            //     stopMotion();
            // }
        }//rotateFinish ends

        /**
         * 使用动画
         */
        slide() {

            o.rotateObj.style[trsfm] = "rotate3d(" + o[axis] + ", " + o[angle] + "rad) matrix3d(" + o.getStartMatrix + ")";

            o[rs] = requestAnim(o.slide);
            //如果标示为 true ，则取消动画
            if (o[rsf]) {
                cancelAnim(o[rs]);
            }
        }//slide ends

        /**
         * 计算鼠标抬起后的单位角速度
         */
        angularDeceleration() {
            let da = this[angle] - this[oldAngle],      //鼠标点下到放开转动的角度
                dt = this[time] - this[oldTime];        //鼠标点下到放开经过的时间

            this[omega] = Math.abs(da * (1000 / 60) / dt);  //算出单位单位角速度，参数1000/60

            //若设置了最大单位角速度，则单位角速度不得超过
            if (isNaN(this[omega])) {
                this[omega] = 0;
            } else if (this[omegaCap] > 0 && this[omega] > this[omegaCap]) {
                this[omega] = this[omegaCap];
            }
        }//angularDeceleration ends

        /**
         * 计算鼠标抬起后的角减速运动
         */
        deceleration() {
            o[angle] += o[omega];
            o[omega] = o[omega] > 0 ? o[omega] - o[lambda] * Math.sqrt(o[omega]) : 0;

            o.rotateObj.style[trsfm] = "rotate3d(" + o[axis] + "," + o[angle] + "rad) matrix3d(" + o.getStartMatrix + ")";
            //如果角速度为 0 了，则取消动画，并做结束处理
            if (o[omega] === 0) {
                cancelAnim(o[rd]);
                o.stopMotion();
            } else {
                o[rd] = requestAnim(o.deceleration);
            }
        }//deceleration ends

        /**
         * 运动停止后的一系列动作,获得开始矩阵，
         * 并且将角度和omega设为0
         */
        stopMotion() {
            //将 slide 标示置为 true，表示取消 slide animation
            this[rsf] = true;

            /**
             * 获得运动停止时的矩阵，并且赋值给startMatrix
             * rotateMatrix(axis, angle) 是结束时的axis & angle
             */
            this.setStartMatrix = multiplyMatrix3d(this.getStartMatrix, rotateMatrix(this[axis], this[angle]));

            //次初始化步骤一定是在获得startMatrix之后，
            //否则运动停止之后元素会回到ratate3d(x,y,x,0)的位置
            //将开始、结束角度和角速度置为 0
            this[oldAngle] = this[angle] = this[omega] = 0;
        }//stopMotion ends

        /**
         * 同心球面的缩放
         */
        zoom() {

            bindEvent(this.stage, 'wheel', this.zoomCallback);

        }//zoom ends

        /**
         * 滚轮向下转动一次隐藏一层，直到隐藏倒数第二层，同时所有显示的元素向球心移动一个 gap 的距离
         * 滚轮向上转动一次显示一层，直到显示出最内层，同时所有显示的元素背向球心移动一个 gap 的距离
         * 通过向页面中的 style[id='style_zoom'] 添加和删除规则来显示和隐藏元素
         * styleSheet 中的规则条数应该和隐藏的层数相同
         * @param e
         */
        zoomCallback(e) {
            e.preventDefault();

            let style_zoom = document.getElementById('style_zoom'),
                sheet      = style_zoom['sheet'] || style_zoom['styleSheet'],
                sign       = e.deltaY / Math.abs(e.deltaY),           //sign > 0收缩，sign < 0 扩展
                lens       = sheet.cssRules.length,
                tier       = sign > 0 ? lens : lens - 1;

            //如果当前需要隐藏的层大于等于最外层，则不可以再扩展
            //如果当前需要隐藏的层小于等于最外层，则不可以再收缩
            if ((tier >= o.tiers && sign > 0) || (tier < 0 && sign < 0)) {
                return false;
            }

            /**
             * sign > 0 滚轮向下滚动，同心球收缩
             * sign < 0 滚轮向上滚动，同新求扩展
             */
            if (sign > 0) {
                sheet.insertRule('.tier-' + tier + '{display:none;}', tier);
            } else {
                sheet.deleteRule(tier);
            }

            let not = '';

            //获取已经隐藏掉的层，在其后不选择
            do {
                not += ':not(.tier-' + tier + ')';
                tier--;
            } while (tier > -1);

            let stars = o.stage.querySelectorAll('.star' + not),
                str   = o.gap * sign + 'px',
                i     = 0;
            //缩放所有显示的元素
            do {
                stars[i].style[trsfm] = getStyle(stars[i], 'transform') + 'translateZ(' + str + ')';
                i++;
            } while (i < stars.length);

        }//zoomCallback ends


        /**
         * 页面的所有点击事件
         */
        click() {

            editor.set(this, new Quill('#editor'));

            bindEvent(window.document, 'click', this.clickCallback);

        }//click ends


        clickCallback(e) {

            let target = e.target;
            //如果是 a 标签，则只执行默认行为
            if (target.nodeName === 'A') {
                return false;
            }

            e.preventDefault();

            if (target.classList.contains('star')) {
                //点击分类或者内容题目时的点击事件
                o.starClick(target);

            } else if (target.classList.contains('btn')) {
                //.operation 包含的所有 .btn 的点击
                o.btnClick(target);

            } else if (target.classList.contains('submit')) {
                //ajax提交表单
                o.submitForm(target);

            }

        }//clickCallback ends


        /**
         * 所有 .star 元素，点击后环绕其出现一圈按钮，可以增删改查
         * 并且给所有.btn 的 dataset 中添加该 star 的 id,pid,tier
         * 显示对应的 operation
         * @param target 点击的目标元素
         */
        starClick(target) {

            let data    = target.dataset,
                ctg_id  = data['ctg_id'] ? data['ctg_id'] : 0,       //分类的ID
                ctg_box = document.getElementById('ctg_box');        //分类对应的操作面板

            if (ctg_id) {
                reveal(ctg_box);
            }

            aimedStar.set(this, target);

        }//starClick ends


        /**
         * ajax 提交表单
         * @param target 提交按钮，是 form 的子元素
         */
        submitForm(target) {

            let form = target.parentNode,
                data = new FormData(form),
                success;

            data.append('content', editor.get(this).getHTML());

            /**
             * 请求成功的回调函数
             * @param res json对象 res.status == 1 成功, 0 失败
             */
            success = function (res) {

                if (res.status) {
                    window.location.reload();
                }

            };

            ajax(form.action, success, data);

        }//submitForm ends


        clearForm(form) {

            form.reset();

            if (form.querySelector('#editor')) {
                editor.get(this).setHTML('');
            }
        }//clearForm ends


        /**
         * .operation 中各个 .btn 的点击事件
         * @param target .btn 元素
         */
        btnClick(target) {
            /**
             * star 选中的 .star 元素
             * cList target的classList
             * form 当前操作界面中的表单
             */
            let star   = aimedStar.get(this),
                sData  = star ? star.dataset : [],
                bData  = target.dataset,
                form   = document.getElementById('ctg_form'),
                inputs = [],
                i      = 0;

            if (form) {

                inputs = form.querySelectorAll("input[type='hidden']:not([name='space_id'])");

                /**
                 * 从 star 或 target 中取出 表单隐藏域需要的数据
                 * @type {NodeList}
                 */
                while (i < inputs.length) {
                    inputs[i].value = sData[inputs[i].getAttribute('name')] || bData[inputs[i].getAttribute('name')];
                    i++;
                }
            }


            switch (bData.func) {

                /*
                 * 将选中的 .star 元素旋转到屏幕正中
                 * 目前可以显示正确，但是缺少动画效果
                 */
                case 'focus':

                    let destiny                 = roll(star.style[trsfm]);
                    this.setStartMatrix         = matrixToArr(destiny);
                    this.rotateObj.style[trsfm] = destiny;
                    break;
                /**
                 * 隐藏当前的操作界面
                 */
                case 'hide':

                    conceal(target.parentNode);
                    break;
                /**
                 * 查看某一个分类的子分类
                 */
                case 'descendant':

                    window.location.href = window.location.origin + window.location.pathname + '?pid=' + sData['ctg_id'] + '&space_id=' + document.getElementById('space_id').value;
                    break;
                /**
                 * 给指定分类添加一个子分类
                 */
                case 'add_desc':

                    this.clearForm(form);
                    form.action = createCtgUrl;
                    reveal(form);

                    break;
                /**
                 * 给指定分类添加一个同级分类
                 */
                case 'add_peer':

                    this.clearForm(form);
                    form.action = createCtgUrl;
                    reveal(form);

                    break;
                /**
                 * 编辑分类的信息
                 */
                case 'edit_ctg':

                    ajax(ctgDetailUrl, function (res) {

                        if (res.status) {
                            form.querySelector('#ctg_title').value = res.message['title'];
                            form.querySelector('#ctg_sort').value  = res.message['sort'];

                            let content = res.message.item ? res.message.item['content'] : '';

                            editor.get(o).setHTML(content);

                            form.action = updateCtgUrl;
                            reveal(form);
                        }

                    }, new FormData(form));

                    break;
                /**
                 * 改变一个分类的父级分类
                 */
                case 'edit_pid':

                    unbindEvent(window.document, 'click', this.clickCallback);

                    bindEvent(window.document, 'click', this.editPid);
                    break;
                /**
                 * 将 Trackball 重置到初始视角
                 */
                case 'reset_trackball':

                    this.setStartMatrix = resetTrackball(this.rotateObj);
                    break;

                case 'theme':

                    let themes = document.getElementById('themes');

                    if (themes.childElementCount) {
                        reveal(themes);
                        return false;
                    }

                    ajax(bData.action, function (res) {

                        let fragment = document.createDocumentFragment();

                        for (let theme in res.message) {

                            if (res.message.hasOwnProperty(theme)) {
                                let a = document.createElement('a');

                                a.setAttribute('href', res.message[theme]);
                                a.appendChild(document.createTextNode(theme));

                                fragment.appendChild(a);
                            }
                        }

                        themes.appendChild(fragment);

                        reveal(themes);
                    });

                    break;
            }//switch ends


        }//btnClick ends

        editPid(e) {

            let target = e.target;

            if (!target.classList.contains('star') || !target.classList.contains('ctg')) {
                return false;
            }

            let sData = aimedStar.get(o).dataset,
                tData = target.dataset,
                data  = new FormData();

            if (sData['ctg_id']) {
                data.append('ctg_id', sData['ctg_id']);
                data.append('pid', tData['ctg_id']);
            }

            ajax(moveCtgUrl, function (res) {

                if (res.status) {
                    window.location.reload();
                }

            }, data);

        }


    }//YangHomeEvent ends

    return YangSpaceEvent;

});