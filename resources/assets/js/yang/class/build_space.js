define([
           "../var/document",
           "../func/style/trsfm",
           "../func/style/getStyle",
           "../var/colorCircle",
           "../func/math/touchPos",
           "../func/math/findPos",
           "../var/prefixJs",
           "../var/prefixCss",
           "../func/event/bindEvent",
           "../func/event/unbindEvent",
           "../func/anim/requestAnim",
           "../func/anim/cancelAnim",
           "../func/math/closestPoint",
           "../func/math/maxPoint",
           "../func/math/fibonacciSphere",
           "../func/math/multiplyMatrix3d",
           "../func/math/calcAngle",
           "../func/math/calcZ",
           "../func/math/normalize",
           "../func/math/crossVector",
           "../func/math/rotateMatrix",

], function (document, trsfm, getStyle, colorCircle, touchPos, findPos, prefixJs, prefixCss, bindEvent, unbindEvent, requestAnim, cancelAnim, closestPoint, maxPoint, fibonacciSphere, multiplyMatrix3d, calcAngle, calcZ, normalize, crossVector, rotateMatrix) {

    class BuildSpace {

        constructor(param) {

            this.stage       = param.stage;
            this.rotateObj   = param.rotateObj;
            this.radius      = param.radius;            //每层球面实际半径
            this.gap         = param.gap;               //每一层球面的间隔
            this.N           = 0;                       //每一层球面上均匀分布的点的数量，不小于该层的元素数量
            this.prevTier    = 0;
            this.tiers       = 0;
            this.allPos      = [];                      //记录每一个 id 对应的空间位置的数据
            this.tierPos     = [];                      //记录当前球面的所有点位位置和旋转，用于赋值，已经复制的点位即删除
            this.savedPos    = [];                      //记录当前球面的所有点位位置和旋转，如果下一层点的数量和上层相等，则不用计算直接从这里取值
            this.startMatrix = new Float32Array(16);    //starting matrix of every action
        }
        //constructor ends

        set setStartMatrix(array) {
            this.startMatrix = array;
        }

        get getStartMatrix() {
            return this.startMatrix;
        }

        spheres() {

            //给每一个区域赋予不同的颜色
            this.section();

            //在空间中定位元素
            this.diffuse();

            this.tiers = this.prevTier - 1;

            delete this.N;
            delete this.prevTier;
            delete this.allPos;
            delete this.tierPos;
            delete this.savedPos;
        }
        //spheres ends

        /**
         * 取最内层的元素，在 style_section 中给每一个相应的 section 添加不同的样式
         */
        section() {

            var core  = this.stage.querySelectorAll('.tier-' + this.prevTier),
                sheet = document.getElementById('style_section').sheet || document.getElementById('style_section').styleSheet,
                i     = 0,
                clr   = '';

            while (i < core.length) {
                clr = colorCircle[i % colorCircle.length];

                sheet.insertRule('.sec-' + core[i].dataset.ctg_id + '{border: 2px solid ' +clr+ ';}', i);

                i++;
            }
        }
        //section ends

        /**
         * 将每一层的元素均匀分布到空间当中，
         * 每一层都在同一个球面上，并且每一个面都朝向圆心
         * 从第一层开始，递归的取到最后一层元素
         * 通过 translate3d 定位偏离圆心的距离
         * 通过 rotate3d 使得面和球面相切，并且转动到和纬线相平行的角度]
         * @author Hanlongzhen 2016-04-19 10:39
         */
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
        //diffuse ends


        /**
         * trackball 整体思路
         * trackball 的半径取的是 stage 的半径，stage 的宽高必须一致，
         * 否则会出现旋转时不符合实际的运动轨迹的情况
         * step1 页面加载后，先获取stage的top、left，去stage的宽、高中小的一个作为trackball的半径，获取目标元素的transform属性，并将其转换为matrix3d的数组，赋值给startmatrix。并给stage元素绑定mousedown事件。
         * step2 旋转运动开始时，判断元素是否还在运动，若还在运动则停止。更新元素的旋转角度。获取鼠标点击的坐标。解除目标元素的mousedown事件，给document绑定mousemove & mouseup。
         * step3 旋转过程中，根据鼠标移动轨迹计算出每一次的坐标，计算出旋转轴axis和旋转角度angle，通过axis和angle计算出matrix3d，做出动画。
         * step4 旋转结束后，将document上的两个绑定事件mousemove & mouseup解除，重新给目标元素绑定mousedown。判断是否设置了冲量，以及冲量是否大于0，若有冲量计算出角速度omega，角度参数使用1000/60，之后设置减速度。若没有冲量或者冲量耗尽，则去除动画，计算出当前的startmatrix，将angle和omega归0；]
         * @param {[object]} confObj [stage, obj, impulse]
         */
        trackball(trackballParam){

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

            if(originTransform == "none"){
                this.startMatrix[0]  = 1;
                this.startMatrix[5]  = 1;
                this.startMatrix[10] = 1;
                this.startMatrix[15] = 1;
            }else{
                //将字符串处理成数组
                this.startMatrix     = originTransform.split(",");

                this.startMatrix[0]  = this.startMatrix[0].replace(/(matrix3d\()/g, "");
                this.startMatrix[15] = this.startMatrix[15].replace(/\)/g, "");

                this.startMatrix     = new Float32Array(this.startMatrix);
            }
            //目标元素绑定mousedown事件
            bindEvent(this.stage, "mousedown", rotateStart);


            //跟随鼠标3d转动部分需要用到的函数--------------------------------------------------------开始
            //旋转开始阶段，计算出鼠标点击时刻的坐标，并由此计算出点击时的空间三维向量，初始化时间和角度，在目标元素上移除事件，在document上绑定事件
            function rotateStart(e){
                if (resetMotion && omega !== 0) {stopMotion()}    //如果之前的惯性没有耗尽，停止运动
                //非常重要，如果没有这一句，会出现鼠标点击抬起无效
                //e.preventDefault();
                mouseDownVector = calcZ(touchPos(e), pos, radius);
                //获得当前已旋转的角度
                oldAngle = angle;

                oldTime  = new Date().getTime();
                //绑定三个事件
                unbindEvent(upper.stage, "mousedown", rotateStart);
                bindEvent(document, "mousemove", rotate);
                bindEvent(document, "mouseup", rotateFinish);

            }

            // 旋转函数，计算鼠标经过位置的向量，计算旋转轴，旋转的角度，请求动画，更新每一帧的时间
            function rotate(e){
                //非常重要，如果没有这一句，会出现鼠标点击抬起无效
                e.preventDefault();
                //计算鼠标经过轨迹的空间坐标
                mouseMoveVector = calcZ(touchPos(e), pos, radius);

                //当mouseMoveVector == mouseDownVector时（点击事件，有时候不是点击事件也会出现这种情况，有待进一步调查），向量单位化会出现分母为0的状况，这样便可以避免出现axis里面有NaN的情况，解决了卡死问题。
                if(mouseMoveVector[0] == mouseDownVector[0] && mouseMoveVector[1] == mouseDownVector[1] && mouseMoveVector[2] == mouseDownVector[2]){
                    return false;
                }

                //以下这段会使在计算惯性运动时，只计算最后一个转动帧里的角度变化，而不是从鼠标点下起的角度变化，比较符合实际的运动模型。
                oldAngle = angle;
                //旋转轴为空间向量的叉积
                axis     = normalize( crossVector(mouseDownVector, mouseMoveVector) );
                //旋转的角度
                angle    = calcAngle(mouseDownVector, mouseMoveVector);
                //将 slide animation 标示置为 false，表示动画运行
                rsf = false;
                slide();
            }

            /**
             * rotateFinish 旋转结束，移除document上的两个绑定事件mousemove & mouseup，重新给目标元素绑定事件mousedown，计算初始矩阵，取消动画
             * @param  e object
             */
            function rotateFinish(e){
                e.preventDefault();
                //解除 document 上的 mousemove 和 mouseup 事件
                unbindEvent(document, 'mousemove', rotate);
                unbindEvent(document, 'mouseup', rotateFinish);
                bindEvent(upper.stage, 'mousedown', rotateStart);
                //当第一下为点击时，axis还是空数组，会出现计算出的startMatrix包含NaN的情况，所以在这里解除绑定的事件并且结束流程。其实可以不需要判断里面的数字是否为NaN，在前面rotate哪里已经把这种情况预防了，在这里只是以防万一
                if(axis == [] || isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2])){return false;}

                time = new Date().getTime();
                //计算单位角速度，这里不能在 下面的 if 条件里面，否则会没有惯性
                angularDeceleration();

                if (impulse && omega > 0) {

                    rsf = true;
                    requestAnim(deceleration);     //有单位角速度做惯性运动
                }else{
                    stopMotion();
                }

                //what's the condition mean? to be found out..
                // else if(!(isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2]))){
                //     stopMotion();
                // }
            }

            //使用动画
            function slide(){

                upper.rotateObj.style[prefixJs+"Transform"] = "rotate3d("+ axis+", "+angle+"rad) matrix3d("+upper.getStartMatrix+")";

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
            function angularDeceleration(){
                var da = angle - oldAngle,      //鼠标点下到放开转动的角度
                    dt = time - oldTime;        //鼠标点下到放开经过的时间

                omega = Math.abs(da*(1000/60)/dt);  //算出单位单位角速度，参数1000/60

                //若设置了最大单位角速度，则单位角速度不得超过
                if(isNaN(omega)){
                    omega = 0;
                }else if(omegaCap > 0 && omega > omegaCap){
                    omega = omegaCap;
                }
            }

            /**
             * deceleration 计算鼠标抬起后的角减速运动
             */
            function deceleration(){
                angle += omega;
                omega = omega > 0 ? omega - lambda * Math.sqrt(omega) : 0;

                upper.rotateObj.style[prefixJs+"Transform"] = "rotate3d("+ axis+","+angle+"rad) matrix3d("+upper.getStartMatrix+")";
                //如果角速度为 0 了，则取消动画，并做结束处理
                if(omega === 0){
                    cancelAnim(rd);
                    stopMotion();
                }else{
                    rd = requestAnim(deceleration);
                }
            }

            /**
             * stopMotion 运动停止后的一系列动作,获得开始矩阵，并且将角度和omega设为0
             */
            function stopMotion(){
                //将 slide 标示置为 true，表示取消 slide animation
                rsf = true;

                //获得运动停止时的矩阵，并且赋值给startMatrix
                var stopMatrix  = rotateMatrix(axis, angle);                //结束时的axis & angle
                upper.setStartMatrix = multiplyMatrix3d(upper.getStartMatrix, stopMatrix);

                //次初始化步骤一定是在获得startMatrix之后，
                //否则运动停止之后元素会回到ratate3d(x,y,x,0)的位置
                //将开始、结束角度和角速度置为 0
                oldAngle = angle = omega = 0;
            }

            //跟随鼠标3d转动部分需要用到的函数--------------------------------------------------------结束


        }
        //Trackball.setup ends

    }

    window.BuildSpace = BuildSpace;
});