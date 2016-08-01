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
    "use strict";

    let o               = null,
        //visual trackball radius
        radius          = 0,
        //top & left of the stage
        pos             = 0,
        //the vector of the cursor position when the mouse down
        mouseDownVector = [],
        //the vector of the cursor position during the mouse is moving
        mouseMoveVector = [],
        //rotating axis, calculated by mouseDownVector & mouseMoveVector
        axis            = [1, 1, 1],
        //旋转实施之前的角度
        oldAngle        = 0,
        //rotate3d angle旋转的角度
        angle           = 0,
        //鼠标点击时刻的时间
        oldTime         = 0,
        //鼠标放开时刻的时间
        time            = 0,
        //单位角速度
        omega           = 0,
        //requestAnimationFrame slide
        rs              = null,
        //requestAnimationFrame deceleration
        rd              = null,
        //slide 的标示
        rsf             = false,
        //最初的变换样式
        originTransform = null,
        //true有惯性，false没有惯性
        impulse         = true,
        //当鼠标点击目标元素时，是否停止当前运动
        resetMotion     = true,
        //单位角速度的cap,必须是大于0的数，默认为0.5
        omegaCap        = 0.8,
        //阻力系数，越大阻力越大，默认0.01
        lambda          = 0.001;

    class YangTrackball {

        constructor(param) {
            this.stage       = param.stage;
            this.rotateObj   = param.rotateObj;
            //starting matrix of every action
            this.startMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

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
            pos = findPos(this.stage);

            //取空间的宽高中大的一个作为trackball半径
            radius = this.stage.offsetWidth < this.stage.offsetHeight ? this.stage.offsetHeight / 2 : this.stage.offsetWidth / 2;

            //元素最初设置的transform值
            originTransform = getStyle(this.rotateObj, prefixCss + "transform");

            if (originTransform != "none") {

                this.setStartMatrix = matrixToArr(originTransform);
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
            if (resetMotion && omega !== 0) {
                o.stopMotion()
            }

            //非常重要，如果没有这一句，会出现鼠标点击抬起无效
            //e.preventDefault();

            mouseDownVector = calcZ(touchPos(e), pos, radius);

            //获得当前已旋转的角度
            oldAngle = angle;
            oldTime  = new Date().getTime();

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
            if (axis == [] || isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2])) {
                return false;
            }

            time = new Date().getTime();
            //计算单位角速度，这里不能在 下面的 if 条件里面，否则会没有惯性
            o.angularDeceleration();

            if (impulse && omega > 0) {

                rsf = true;
                requestAnim(o.deceleration);     //有单位角速度做惯性运动
            } else {
                o.stopMotion();
            }

            //what's the condition mean? to be found out..
            // else if(!(isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2]))){
            //     stopMotion();
            // }
        }//rotateFinish ends

        /**
         * 使用动画
         */
        slide() {

            o.rotateObj.style[trsfm] = "rotate3d(" + axis + ", " + angle + "rad) matrix3d(" + o.getStartMatrix + ")";

            rs = requestAnim(o.slide);
            //如果标示为 true ，则取消动画
            if (rsf) {
                cancelAnim(rs);
            }
        }//slide ends

        /**
         * 计算鼠标抬起后的单位角速度
         */
        angularDeceleration() {
            let da = angle - oldAngle,      //鼠标点下到放开转动的角度
                dt = time - oldTime;        //鼠标点下到放开经过的时间

            omega = Math.abs(da * (1000 / 60) / dt);  //算出单位单位角速度，参数1000/60

            //若设置了最大单位角速度，则单位角速度不得超过
            if (isNaN(omega)) {
                omega = 0;
            } else if (omegaCap > 0 && omega > omegaCap) {
                omega = omegaCap;
            }
        }//angularDeceleration ends

        /**
         * 计算鼠标抬起后的角减速运动
         */
        deceleration() {
            angle += omega;
            omega = omega > 0 ? omega - lambda * Math.sqrt(omega) : 0;

            o.rotateObj.style[trsfm] = "rotate3d(" + axis + "," + angle + "rad) matrix3d(" + o.getStartMatrix + ")";
            //如果角速度为 0 了，则取消动画，并做结束处理
            if (omega === 0) {
                cancelAnim(rd);
                o.stopMotion();
            } else {
                rd = requestAnim(o.deceleration);
            }
        }//deceleration ends

        /**
         * 运动停止后的一系列动作,获得开始矩阵，
         * 并且将角度和omega设为0
         */
        stopMotion() {
            //将 slide 标示置为 true，表示取消 slide animation
            rsf = true;

            /**
             * 获得运动停止时的矩阵，并且赋值给startMatrix
             * rotateMatrix(axis, angle) 是结束时的axis & angle
             */
            this.setStartMatrix = multiplyMatrix3d(this.getStartMatrix, rotateMatrix(axis, angle));

            //次初始化步骤一定是在获得startMatrix之后，
            //否则运动停止之后元素会回到ratate3d(x,y,x,0)的位置
            //将开始、结束角度和角速度置为 0
            oldAngle = angle = omega = 0;
        }//stopMotion ends


    }//YangTrackball ends

    return YangTrackball;
});