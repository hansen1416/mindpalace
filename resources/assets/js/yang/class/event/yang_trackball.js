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
           "../../func/anim/requestAnim",
           "../../func/anim/cancelAnim"

       ], function (prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, multiplyMatrix3d, calcAngle, calcZ, normalize, crossVector, rotateMatrix, matrixToArr,
                    bindEvent, unbindEvent, requestAnim, cancelAnim) {

    let o               = null,
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

    class YangTrackball {

        constructor(param) {
            this.stage            = param.stage;
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
            //requestAnimationFrame slide
            this[rs]              = null;
            //requestAnimationFrame deceleration
            this[rd]              = null;
            //slide 的标示
            this[rsf]             = false;
            //最初的变换样式
            this[originTransform] = null;
            //true有惯性，false没有惯性
            this[impulse]         = param.impulse;
            //当鼠标点击目标元素时，是否停止当前运动
            this[resetMotion]     = param.resetMotion;
            //单位角速度的cap,必须是大于0的数，默认为0.5
            this[omegaCap]        = param.omegaGap;
            //阻力系数，越大阻力越大，默认0.01
            this[lambda]          = param.lambda;

            o = this;
        }

        set setStartMatrix(arr) {
            this.startMatrix = arr;
        }


        get getStartMatrix() {
            return this.startMatrix;
        }

        trackball() {

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

            o[mouseDownVector] = calcZ(touchPos(e), o[pos], o[radius]);
            //获得当前已旋转的角度
            o[oldAngle]        = o[angle];

            o[oldTime] = new Date().getTime();
            //绑定三个事件
            unbindEvent(o.stage, "mousedown", o.rotateStart);
            bindEvent(document, "mousemove", o.rotate);
            bindEvent(document, "mouseup", o.rotateFinish);

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
            o[mouseMoveVector] = calcZ(touchPos(e), o[pos], o[radius]);

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
            unbindEvent(document, 'mousemove', o.rotate);
            unbindEvent(document, 'mouseup', o.rotateFinish);
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


    }//YangTrackball ends

    window.YangTrackball = YangTrackball;

});