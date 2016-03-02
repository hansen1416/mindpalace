define([
        "../var/prefixJs",
        "../var/prefixCss",
        "../var/trsfm",
        "../var/getStyle",
        "../var/touchPos",
        "../var/findPos",
        "../var/bindEvent",
        "./func/multiplyMatrix3d",
        "./func/calcAngle",
        "./func/normalize",
        "./func/crossVector",
        "./func/rotateMatrix",
        "./func/matrixToArr",
        
    ], function (prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, bindEvent, multiplyMatrix3d, calcAngle, normalize, crossVector, rotateMatrix, matrixToArr) {

        var Rubik = function(confObj){
            this.config = {};
            this.setup(confObj);
        };

        Rubik.prototype.setup = function(confObj){

            var THIS            = this,
                impulse         = true,     //if true there will be inertia else if false there will be none
                stagew          = 0,         //half of stagewidth
                stageh          = 0,         //half of stageheight
                radius          = 0,         //visual trackball radius
                pos             = 0,            //top & left of the stage
                mouseDownVector = [],    //the vector of the cursor position when the mouse down
                mouseMoveVector = [],    //the vector of the cursor position during the mouse is moving
                axis            = [1,1,1],           //rotating axis, calculated by mouseDownVector & mouseMoveVector
                oldAngle        = 0,       //旋转实施之前的角度
                angle           = 0,          //rotate3d angle旋转的角度
                oldTime         = 0,        //鼠标点击时刻的时间
                time            = 0,           //鼠标放开时刻的时间
                startMatrix     = [],   //starting matrix of every action
                omega           = 0,          //单位角速度
                resetMotion     = true,       //当鼠标点击目标元素时，是否停止当前运动
                omegaCap,          //单位角速度的cap,必须是大于0的数，默认为0.5
                lambda;             //阻力系数，越大阻力越大，默认0.01
                
            //闭包函数，做初始化魔方之用--------------------------------------------------------开始
            (function init(){
                //将设置参数传给对象
                for(var property in confObj){
                    THIS.config[property] = confObj[property];
                }

                THIS.stage = document.getElementById(THIS.config.stage) || document.getElementsByTagName('body')[0];

                if(THIS.config.obj != undefined){
                    THIS.obj = document.getElementById(THIS.config.obj[0]);
                    if(THIS.obj === null){
                        // 没有找到相应ID的元素
                        return false;
                    }
                }else{
                    // 未定义3D变换的元素
                    return false;
                }

                if(THIS.config.impulse !== undefined){
                    impulse = THIS.config.impulse;
                }

                if(THIS.config.resetMotion !== undefined){
                    resetMotion = THIS.config.resetMotion;
                }

                //undefined is NaN
                omegaCap = isNaN(parseFloat(THIS.config.omegaCap)) ? 0.5 : parseFloat(THIS.config.omegaCap);
                lambda = isNaN(parseFloat(THIS.config.lambda)) ? 0.01 : parseFloat(THIS.config.lambda);

                // 旋转空间的top、left
                pos = findPos(THIS.stage);

                stagew = THIS.stage.offsetWidth/2;
                stageh = THIS.stage.offsetHeight/2;
                // 取空间的宽高中小的一个作为trackball半径
                radius = stagew>stageh ? stageh : stagew;
                // 元素最初设置的transform值
                originTransform = getStyle(THIS.obj, prefixCss + "transform");
                
                if(originTransform == "none"){
                    startMatrix = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
                }else{
                    // 将字符串处理成数组
                    startMatrix = originTransform.split(",");

                    startMatrix[0] = startMatrix[0].replace(/(matrix3d\()/g, "");
                    startMatrix[15] = startMatrix[15].replace(/\)/g, "");

                    for(var i = 0, l = startMatrix.length; i<l; i++){
                        startMatrix[i] = parseFloat(startMatrix[i]);
                    }
                }
                // 目标元素绑定mousedown事件
                bindEvent(THIS.obj, "mousedown", rotateStart);

            })();
            //闭包函数，做初始化魔方之用--------------------------------------------------------结束

            //跟随鼠标3d转动部分需要用到的函数--------------------------------------------------------开始
            // 旋转开始阶段，计算出鼠标点击时刻的坐标，并由此计算出点击时的空间三维向量，初始化时间和角度，在目标元素上移除事件，在document上绑定事件
            function rotateStart(e){
                if (resetMotion && omega !== 0) {stopMotion()};    //如果之前的惯性没有耗尽，停止运动
                //非常重要，如果没有这一句，会出现鼠标点击抬起无效
                e.preventDefault();
                mouseDownVector = calcZ(touchPos(e));
                // 获得当前已旋转的角度
                oldAngle = angle;

                oldTime = new Date().getTime();
                // 绑定三个事件
                bindEvent(THIS.obj, "mousedown", rotateStart, "remove");
                bindEvent(document, "mousemove", rotate);
                bindEvent(document, "mouseup", rotateFinish);

            }

            // 旋转函数，计算鼠标经过位置的向量，计算旋转轴，旋转的角度，请求动画，更新每一帧的时间
            function rotate(e){
                //非常重要，如果没有这一句，会出现鼠标点击抬起无效
                e.preventDefault();
                // 计算鼠标经过轨迹的空间坐标
                mouseMoveVector = calcZ(touchPos(e));

                //当mouseMoveVector == mouseDownVector时（点击事件，有时候不是点击事件也会出现这种情况，有待进一步调查），向量单位化会出现分母为0的状况，这样便可以避免出现axis里面有NaN的情况，解决了卡死问题。
                if(mouseMoveVector[0] == mouseDownVector[0] && mouseMoveVector[1] == mouseDownVector[1] && mouseMoveVector[2] == mouseDownVector[2]){
                    return false;
                }

                // 一下这段会使在计算惯性运动时，只计算最后一个转动帧里的角度变化，而不是从鼠标点下起的角度变化，比较符合实际的运动模型。
                oldAngle = angle;
                // 旋转轴为空间向量的叉积
                axis = crossVector(mouseDownVector, mouseMoveVector);
                axis = normalize(axis);
                // 旋转的角度
                angle = calcAngle(mouseDownVector, mouseMoveVector);
        
                requestAnimFrame(slide);
            }

            /**
             * [rotateFinish 旋转结束，移除document上的两个绑定事件mousemove & mouseup，重新给目标元素绑定事件mousedown，计算初始矩阵，取消动画]
             * @param  {[type]} e [event]
             * @return {[type]}   [description]
             */
            function rotateFinish(e){
                
                // 当第一下为点击时，axis还是空数组，会出现计算出的startMatrix包含NaN的情况，所以在这里解除绑定的事件并且结束流程。其实可以不需要判断里面的数字是否为NaN，在前面rotate哪里已经把这种情况预防了，在这里只是以防万一
                if(axis.length == [] || isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2])){
                    bindEvent(document, 'mousemove', rotate, "remove");
                    bindEvent(document, 'mouseup', rotateFinish, "remove");
                    bindEvent(THIS.obj, 'mousedown', rotateStart);
                    return false;
                }

                bindEvent(document, 'mousemove', rotate, "remove");
                bindEvent(document, 'mouseup', rotateFinish, "remove");
                bindEvent(THIS.obj, 'mousedown', rotateStart);

                time = new Date().getTime();

                angularDeceleration(); //计算单位角速度

                if (impulse && omega > 0) {
                    cancelAnimFrame(slide);
                    requestAnimFrame(deceleration);     //有单位角速度做惯性运动
                }else{
                    stopMotion();
                }

                //what's the condition mean? to be found out..
                // else if(!(isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2]))){
                //     stopMotion();
                // }
            }

            // 使用动画
            function slide(){
                THIS.obj.style[cssPref+"Transform"] = "rotate3d("+ axis+","+angle+"rad) matrix3d("+startMatrix+")";
                requestAnimFrame(slide);
            }

            /**
             * [angularDeceleration 计算鼠标抬起后的单位角速度]
             * @return {[number]} [omega]
             */
            function angularDeceleration(){
                var da = angle - oldAngle,      //鼠标点下到放开转动的角度
                    dt = time - oldTime;        //鼠标点下到放开经过的事件
                    
                omega = Math.abs(da*(1000/60)/dt);  //算出单位单位角速度，参数1000/60
           
                // 若设置了最大单位角速度，则单位角速度不得超过
                if(isNaN(omega)){
                    omega = 0;
                }else if(omegaCap > 0 && omega > omegaCap){
                    omega = omegaCap;
                }
            }

            /**
             * [deceleration 计算鼠标抬起后的角减速运动]
             * @return {[type]} [description]
             */
            function deceleration(){
                angle += omega;
                decel = lambda*Math.sqrt(omega);
                omega = omega > 0 ? omega - decel : 0;

                THIS.obj.style[cssPref+"Transform"] = "rotate3d("+ axis+","+angle+"rad) matrix3d("+startMatrix+")";
                
                if(omega === 0){
                    stopMotion();
                }else{
                    requestAnimFrame(deceleration);
                }
            }

            /**
             * [stopMotion 运动停止后的一系列动作,获得开始矩阵，并且将角度和omega设为0]
             * @return {[type]} [description]
             */
            function stopMotion(){
                cancelAnimFrame(slide);
                cancelAnimFrame(deceleration);

                var stopMatrix = [];
                // 获得运动停止时的矩阵，并且赋值给startMatrix
                stopMatrix  = rotateMatrix(axis, angle);                //结束时的axis & angle
                startMatrix = multiplyMatrix(startMatrix,stopMatrix);
        
                //次初始化步骤一定是在获得startMatrix之后，否则运动停止之后元素会回到ratate3d(x,y,x,0)的位置
                oldAngle = angle = 0;
                omega = 0;
            }

            // calculate the z-component for a space vector
            function calcZ(touchPos){

                var x = (touchPos[0] - pos[0])/radius - 1,
                    y = (touchPos[1] - pos[1])/radius - 1,
                    z = 1 - x*x -y*y;

                return [x, y, z];
            }
            //跟随鼠标3d转动部分需要用到的函数--------------------------------------------------------结束
            
            //Rubik.setup end
        }

        window.Rubik = Rubik;

        return Rubik;
                
});