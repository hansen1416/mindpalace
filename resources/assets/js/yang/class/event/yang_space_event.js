define([

           "../../var/document",
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
           "../../func/anim/requestAnim",
           "../../func/anim/cancelAnim",
           "../../func/ajax/ajax",
           "../../func/anim/roll",
           "../../func/anim/reveal",
           "../../func/anim/conceal",
           "../layout/yang_space_layout"

       ], function (document, prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, multiplyMatrix3d, calcAngle, calcZ, normalize, crossVector, rotateMatrix, matrixToArr,
                    bindEvent, unbindEvent, requestAnim, cancelAnim, ajax, roll, reveal, conceal, yang_space_layout) {

    /**
     * 引入 class YangSpaceLayout
     * @type {null}
     */
    yang_space_layout = null;

    class YangSpaceEvent extends YangSpaceLayout {

        constructor(param) {
            super(param);

            this.rotateObj   = param.rotateObj;
            this.startMatrix = new Float32Array(16);    //starting matrix of every action

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

            var upper           = this,
                impulse         = true,                     //true有惯性，false没有惯性
                radius          = 0,                        //visual trackball radius
                pos             = 0,                        //top & left of the stage
                mouseDownVector = [],                       //the vector of the cursor position when the mouse down
                mouseMoveVector = [],                       //the vector of the cursor position during the mouse is moving
                axis            = [1, 1, 1],                //rotating axis, calculated by mouseDownVector & mouseMoveVector
                oldAngle        = 0,                        //旋转实施之前的角度
                angle           = 0,                        //rotate3d angle旋转的角度
                oldTime         = 0,                        //鼠标点击时刻的时间
                time            = 0,                        //鼠标放开时刻的时间
                omega           = 0,                        //单位角速度
                resetMotion     = true,                     //当鼠标点击目标元素时，是否停止当前运动
                omegaCap        = 0.5,                      //单位角速度的cap,必须是大于0的数，默认为0.5
                lambda          = 0.01,                     //阻力系数，越大阻力越大，默认0.01
                rs              = null,                     //requestAnimationFrame slide
                rd              = null,                     //requestAnimationFrame deceleration
                rsf             = false,                    //slide 的标示
                originTransform;


            impulse     = trackballParam.impulse;
            resetMotion = trackballParam.resetMotion;
            omegaCap    = trackballParam.omegaCap;
            lambda      = trackballParam.lambda;

            //旋转空间的top、left
            pos = findPos(this.stage);

            //取空间的宽高中大的一个作为trackball半径
            radius = this.stage.offsetWidth < this.stage.offsetHeight ? this.stage.offsetHeight / 2 : this.stage.offsetWidth / 2;

            //元素最初设置的transform值
            originTransform = getStyle(this.rotateObj, prefixCss + "transform");

            if (originTransform == "none") {
                this.startMatrix[0]  = 1;
                this.startMatrix[5]  = 1;
                this.startMatrix[10] = 1;
                this.startMatrix[15] = 1;
            } else {
                //将字符串处理成数组
                this.startMatrix = matrixToArr(originTransform);
            }
            //目标元素绑定mousedown事件
            bindEvent(this.stage, "mousedown", rotateStart);


            //跟随鼠标3d转动部分需要用到的函数--------------------------------------------------------开始
            //旋转开始阶段，计算出鼠标点击时刻的坐标，并由此计算出点击时的空间三维向量，初始化时间和角度，在目标元素上移除事件，在document上绑定事件
            function rotateStart(e) {
                if (resetMotion && omega !== 0) {
                    stopMotion()
                }    //如果之前的惯性没有耗尽，停止运动
                //非常重要，如果没有这一句，会出现鼠标点击抬起无效
                //e.preventDefault();
                mouseDownVector = calcZ(touchPos(e), pos, radius);
                //获得当前已旋转的角度
                oldAngle        = angle;

                oldTime = new Date().getTime();
                //绑定三个事件
                unbindEvent(upper.stage, "mousedown", rotateStart);
                bindEvent(document, "mousemove", rotate);
                bindEvent(document, "mouseup", rotateFinish);

            }

            // 旋转函数，计算鼠标经过位置的向量，计算旋转轴，旋转的角度，请求动画，更新每一帧的时间
            function rotate(e) {
                //非常重要，如果没有这一句，会出现鼠标点击抬起无效
                e.preventDefault();
                //计算鼠标经过轨迹的空间坐标
                mouseMoveVector = calcZ(touchPos(e), pos, radius);

                //当mouseMoveVector == mouseDownVector时（点击事件，有时候不是点击事件也会出现这种情况，有待进一步调查），向量单位化会出现分母为0的状况，这样便可以避免出现axis里面有NaN的情况，解决了卡死问题。
                if (mouseMoveVector[0] == mouseDownVector[0] && mouseMoveVector[1] == mouseDownVector[1] && mouseMoveVector[2] == mouseDownVector[2]) {
                    return false;
                }

                //以下这段会使在计算惯性运动时，只计算最后一个转动帧里的角度变化，而不是从鼠标点下起的角度变化，比较符合实际的运动模型。
                oldAngle = angle;
                //旋转轴为空间向量的叉积
                axis     = normalize(crossVector(mouseDownVector, mouseMoveVector));
                //旋转的角度
                angle    = calcAngle(mouseDownVector, mouseMoveVector);
                //将 slide animation 标示置为 false，表示动画运行
                rsf      = false;
                slide();
            }

            /**
             * rotateFinish 旋转结束，移除document上的两个绑定事件mousemove & mouseup，重新给目标元素绑定事件mousedown，计算初始矩阵，取消动画
             * @param  e object
             */
            function rotateFinish(e) {
                e.preventDefault();
                //解除 document 上的 mousemove 和 mouseup 事件
                unbindEvent(document, 'mousemove', rotate);
                unbindEvent(document, 'mouseup', rotateFinish);
                bindEvent(upper.stage, 'mousedown', rotateStart);
                //当第一下为点击时，axis还是空数组，会出现计算出的startMatrix包含NaN的情况，所以在这里解除绑定的事件并且结束流程。其实可以不需要判断里面的数字是否为NaN，在前面rotate哪里已经把这种情况预防了，在这里只是以防万一
                if (axis == [] || isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2])) {
                    return false;
                }

                time = new Date().getTime();
                //计算单位角速度，这里不能在 下面的 if 条件里面，否则会没有惯性
                angularDeceleration();

                if (impulse && omega > 0) {

                    rsf = true;
                    requestAnim(deceleration);     //有单位角速度做惯性运动
                } else {
                    stopMotion();
                }

                //what's the condition mean? to be found out..
                // else if(!(isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2]))){
                //     stopMotion();
                // }
            }

            //使用动画
            function slide() {

                upper.rotateObj.style[prefixJs + "Transform"] = "rotate3d(" + axis + ", " + angle + "rad) matrix3d(" + upper.getStartMatrix + ")";

                rs = requestAnim(slide);
                //如果标示为 true ，则取消动画
                if (rsf) {
                    cancelAnim(rs);
                }
            }

            /**
             * angularDeceleration 计算鼠标抬起后的单位角速度
             * @return number omega
             */
            function angularDeceleration() {
                var da = angle - oldAngle,      //鼠标点下到放开转动的角度
                    dt = time - oldTime;        //鼠标点下到放开经过的时间

                omega = Math.abs(da * (1000 / 60) / dt);  //算出单位单位角速度，参数1000/60

                //若设置了最大单位角速度，则单位角速度不得超过
                if (isNaN(omega)) {
                    omega = 0;
                } else if (omegaCap > 0 && omega > omegaCap) {
                    omega = omegaCap;
                }
            }

            /**
             * deceleration 计算鼠标抬起后的角减速运动
             */
            function deceleration() {
                angle += omega;
                omega = omega > 0 ? omega - lambda * Math.sqrt(omega) : 0;

                upper.rotateObj.style[prefixJs + "Transform"] = "rotate3d(" + axis + "," + angle + "rad) matrix3d(" + upper.getStartMatrix + ")";
                //如果角速度为 0 了，则取消动画，并做结束处理
                if (omega === 0) {
                    cancelAnim(rd);
                    stopMotion();
                } else {
                    rd = requestAnim(deceleration);
                }
            }

            /**
             * stopMotion 运动停止后的一系列动作,获得开始矩阵，并且将角度和omega设为0
             */
            function stopMotion() {
                //将 slide 标示置为 true，表示取消 slide animation
                rsf = true;

                //获得运动停止时的矩阵，并且赋值给startMatrix
                var stopMatrix       = rotateMatrix(axis, angle);                //结束时的axis & angle
                upper.setStartMatrix = multiplyMatrix3d(upper.getStartMatrix, stopMatrix);

                //次初始化步骤一定是在获得startMatrix之后，
                //否则运动停止之后元素会回到ratate3d(x,y,x,0)的位置
                //将开始、结束角度和角速度置为 0
                oldAngle = angle = omega = 0;
            }

            //跟随鼠标3d转动部分需要用到的函数--------------------------------------------------------结束


        }//trackball ends


        /**
         * 同心球面的缩放
         */
        zoom() {

            bindEvent(this.stage, 'wheel', callback);

            var upper      = this,
                style_zoom = document.getElementById('style_zoom'),
                sheet      = style_zoom['sheet'] || style_zoom['styleSheet'];

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
                if ((tier >= upper.tiers && sign > 0) || (tier < 0 && sign < 0)) {
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

                var not = '';

                //获取已经隐藏掉的层，在其后不选择
                do {
                    not += ':not(.tier-' + tier + ')';
                    tier--;
                } while (tier > -1);

                var stars = upper.stage.querySelectorAll('.star' + not),
                    str   = upper.gap * sign + 'px',
                    i     = 0;
                //缩放所有显示的元素
                do {
                    stars[i].style[trsfm] = getStyle(stars[i], 'transform') + 'translateZ(' + str + ')';
                    i++;
                } while (i < stars.length);

            }

        }//zoom ends


        /**
         * 页面的所有点击事件
         */
        click() {

            bindEvent(document, 'click', callback);

            var upper = this;

            function callback(e) {

                var target = e.target;
                //如果是 a 标签，则只执行默认行为
                if (target.nodeName === 'A') {
                    return false;
                }

                e.preventDefault();

                if (target.classList.contains('star')) {
                    //点击分类或者内容题目时的点击事件
                    starClick(target);

                } else if (target.classList.contains('btn')) {
                    //.operation 包含的所有 .btn 的点击
                    btnClick(target);

                } else if (target.classList.contains('submit')) {
                    //ajax提交表单
                    submitClick(target);

                } else if (target.classList.contains('pop')) {
                    //内容详情浮层的点击事件
                    popClick(target);

                }

            }//callback ends


            /**
             * 所有 .star 元素，点击后环绕其出现一圈按钮，可以增删改查
             * 并且给所有.btn 的 dataset 中添加该 star 的 id,pid,tier
             * 显示对应的 operation
             * @param target 点击的目标元素
             */
            function starClick(target) {

                var dataset  = target.dataset,
                    ctg_id   = dataset['ctg_id'] ? dataset['ctg_id'] : 0,       //分类的ID
                    item_id  = dataset['item_id'] ? dataset['item_id'] : 0,     //内容的ID
                    ctg_box  = document.getElementById('ctg_box'),              //分类对应的操作面板
                    item_box = document.getElementById('item_box');             //内容对应的操作面板

                if (ctg_id) {
                    reveal(ctg_box);
                    conceal(item_box);
                } else if (item_id) {
                    reveal(item_box);
                    conceal(ctg_box);
                }

                upper.aimedStar = target;

            }//starClick ends


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
                var star      = upper.aimedStar,
                    s_dataset = star.dataset,
                    b_dataset = target.dataset,
                    cList     = target.classList,
                    i         = 0,
                    form;
                /**
                 * 分类元素和内容元素选择不同的表单
                 */
                if (cList.contains('ctg_btn')) {
                    form = document.getElementById('ctg_form');
                } else if (cList.contains('item_btn')) {
                    form = document.getElementById('item_form');
                }
                /**
                 * 从 star 或 target 中取出 表单隐藏域需要的数据
                 * @type {NodeList}
                 */
                var inputs = form.querySelectorAll("input[type='hidden']");

                while (i < inputs.length) {
                    inputs[i].value = s_dataset[inputs[i].getAttribute('name')] || b_dataset[inputs[i].getAttribute('name')];
                    i++;
                }

                /**
                 * 如果按钮是操作表单的，会有 dataset.action
                 * 其他是操作样式或动画
                 */
                if (b_dataset.action) {

                    form.action = b_dataset.action;
                    reveal(form);

                    /**
                     * 将按钮的 title 属性赋予 textarea
                     * @type {Element}
                     */
                    var textarea = form.querySelector('textarea');

                    textarea.setAttribute('title', target.getAttribute('title'));

                    /**
                     * 如果是编辑名称，将 star 的内容传递到 form 中
                     * 其他的按钮，将 form.textarea 的内容清空
                     */
                    if (b_dataset.message == 'edit-self') {
                        textarea.innerHTML = star.innerHTML;
                    } else {
                        textarea.innerHTML = '';
                    }

                } else {

                    switch (target.dataset.func) {
                        /*
                         * 将选中的 .star 元素旋转到屏幕正中
                         * 目前可以显示正确，但是缺少动画效果
                         */
                        //TODO
                        case 'focus':

                            var destiny                  = roll(star.style[trsfm]);
                            upper.rotateObj.style[trsfm] = destiny;
                            upper.setStartMatrix         = matrixToArr(destiny);

                            break;
                    /**
                     * 隐藏当前的操作界面
                     */
                        case 'hide':

                            conceal(form);
                            conceal(form.parentNode);

                            break;
                    /**
                     * 显示内容的详细内容
                     */
                        case 'detail':

                            var pop_item = document.getElementById('pop_item'),
                                url      = document.getElementById('item_detail_url').value,
                                data     = new FormData(),
                                success  = function (res) {

                                    if (res.status) {

                                        var content  = pop_item.querySelector('.content'),
                                            pop_save = pop_item.querySelector('#pop_save');

                                        content.innerHTML        = res.message;
                                        pop_save.dataset.ctg_id  = s_dataset['pid'];
                                        pop_save.dataset.item_id = s_dataset['item_id'];

                                        var css = document.createElement('link'),
                                            js  = document.createElement('script');

                                        css.rel  = 'stylesheet';
                                        css.href = '../content-tool/content-tools.min.css';

                                        document.getElementsByTagName('head')[0].appendChild(css);

                                        js.src = '../content-tool/content-tools.min.js';


                                        js.onload = function(){
                                            var editor;

                                            ContentTools.StylePalette.add([
                                                                              new ContentTools.Style('Author', 'author', ['p'])
                                                                          ]);

                                            editor = ContentTools.EditorApp.get();
                                            editor.init('*[data-editable]', 'data-name');
                                        }


                                        document.body.appendChild(js);


                                        pop_item.style['display'] = 'block';
                                    }
                                };

                            data.append('item_id', s_dataset['item_id']);

                            ajax(url, success, data);

                            break;
                    }

                }


            }//btnClick ends


            /**
             * ajax 提交表单
             * @param target 提交按钮，是 form 的子元素
             */
            function submitClick(target) {
                var form = target.parentNode,
                    success;

                /**
                 * 请求成功的回调函数
                 * @param res json对象 res.status == 1 成功, 0 失败
                 */
                success = function (res) {
                    //TODO
                    console.log(res);
                };

                ajax(form.action, success, new FormData(form));

            }//submitClick ends


            /**
             * 弹出框里的点击事件
             * @param target
             */
            function popClick(target) {

                var id       = target.id,
                    pop_item = document.getElementById('pop_item'),
                    content  = pop_item.querySelector('.content');

                switch (id) {

                    case 'pop_close':

                        conceal(pop_item);

                        break;

                    case 'pop_save':

                        var url     = document.getElementById('edit_item_detail_url').value,
                            data    = new FormData(),
                            success = function (res) {
                                //TODO
                                console.log(res);
                            };

                        data.append('item_id', target.dataset.item_id);
                        data.append('ctg_id', target.dataset.ctg_id);
                        data.append('content', content.innerHTML);


                        ajax(url, success, data);

                        break;
                }

            }//popClick ends


        }//click ends


    }//YangHomeEvent ends

    window.YangSpaceEvent = YangSpaceEvent;

});