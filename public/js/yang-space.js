/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

	           __webpack_require__(1),
	           __webpack_require__(19)

	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (YangTrackball, YangSpaceEvent) {
	    "use strict";

	    let T = new YangTrackball({
	        stage    : document.getElementById('top_right'),
	        rotateObj: document.getElementById('top_right_cube')
	    });

	    T.trackball();

	    T = null;

	    /**
	     * 赋予 operation 部分样式
	     * 所有按钮环形排布
	     */
	    YangSpaceEvent.setOperation([
	                                    {'selector': '.ctg_btn', 'radius': 100},
	                                ]);

	    let Y = new YangSpaceEvent({
	        stage    : document.getElementById('stage'),
	        rotateObj: document.getElementById('galaxy'),
	        radius   : 140,
	        gap      : 120
	    });


	    /**
	     * 生成同心球面
	     */
	    Y.spheres();

	    /**
	     * 3d 球体转动
	     */
	    Y.trackball({
	                    //true有惯性，false没有惯性
	                    impulse    : true,
	                    //当鼠标点击目标元素时，是否停止当前运动，true为停止
	                    resetMotion: true,
	                    //单位角速度的cap,必须是大于0的数，默认为0.5
	                    omegaCap   : 0.8,
	                    //阻力系数，越大阻力越大，默认0.01
	                    lambda     : 0.001
	                });

	    /**
	     * 鼠标滚轮事件
	     */
	    Y.zoom();

	    /**
	     * 鼠标点击事件
	     */
	    Y.click();

	    Y = null;

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

	           __webpack_require__(3),
	           __webpack_require__(11),
	           __webpack_require__(4),
	           __webpack_require__(5),
	           __webpack_require__(6),
	           __webpack_require__(7),
	           __webpack_require__(8),
	           __webpack_require__(9),
	           __webpack_require__(10),
	           __webpack_require__(2),
	           __webpack_require__(12),
	           __webpack_require__(13),
	           __webpack_require__(14),
	           __webpack_require__(15),
	           __webpack_require__(16),
	           __webpack_require__(17),
	           __webpack_require__(18)

	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, multiplyMatrix3d, calcAngle, calcZ, normalize, crossVector, rotateMatrix, matrixToArr,
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		return function (vec){ // 向量单位化，可以是任意维向量
	        let len = vec.length, vecLength = 0, norm = [];

	        for(let i = 0; i < len; i++){
	            vecLength += Math.pow(vec[i], 2);
	        }

	        vecLength = Math.sqrt(vecLength);

	        if(vecLength == 0){
	            return false;       //当向量坐标全都为0时，避免出现NaN
	        }

	        for(let i = 0; i < len; i++){
	            norm[i] = vec[i]/vecLength;
	        }

	        return norm;
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){

	    let userAgent   = navigator.userAgent.toLowerCase(),
	        prefixJs    = "";

	    if(/webkit/gi.test(userAgent)){
	        prefixJs = "Webkit";
	    }else if(/msie | trident/gi.test(userAgent)){
	        prefixJs = "ms";
	    }else if(/mozilla/gi.test(userAgent)){
	        prefixJs = "Moz";
	    }else if(/opera/gi.test(userAgent)){
	        prefixJs = "O";
	    }

	    return prefixJs;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(3),
	    ], __WEBPACK_AMD_DEFINE_RESULT__ = function(prefixJs) { //判断浏览器支持那种transform的写法;
		return (prefixJs+"Transform" in document.documentElement.style) ? prefixJs+"Transform" : "transform";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    //get element style
		return function (target, prop){
	        return document.defaultView.getComputedStyle(target, "").getPropertyValue(prop);
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    /**
	     * touchPos [get the mouse/touch position]
	     * @AuthorName Hanlongzhen
	     * @DateTime   2016-04-06T13:46:34+0800
	     * @param      object eventObj 事件对象
	     * @return     array 平面上的点
	     */
		return function (eventObj){
	        let x, y;
	        if(eventObj.type.indexOf("mouse")>-1 || eventObj.type.indexOf("click")>-1){
	            x = eventObj.pageX;
	            y = eventObj.pageY;
	        }else if(eventObj.type.indexOf("touch")>-1){
	            if(eventObj.touches.length === 1 ){
	                var touch = eventObj.touches[0];
	                x = touch.pageX;
	                y = touch.pageY;
	            }
	        }
	        return [x,y];
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    //findPos-script by www.quirksmode.org
		return function (obj){
	        let curleft = 0,
	            curtop  = 0;
	    
	        if (obj.offsetParent) {
	            do {
	                curleft += obj.offsetLeft;
	                curtop += obj.offsetTop;
	            } while (obj = obj.offsetParent);
	            
	            return [curleft,curtop];
	        }
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    // 计算两个m3d的乘积，其实是长度16的数组相乘，转化成两个4x4的矩阵相成
		return function (m1, m2){
	        let m = new Float32Array(16);
	        
	        m[0]   = m1[0]*m2[0]+m1[1]*m2[4]+m1[2]*m2[8]+m1[3]*m2[12];
	        m[1]   = m1[0]*m2[1]+m1[1]*m2[5]+m1[2]*m2[9]+m1[3]*m2[13];
	        m[2]   = m1[0]*m2[2]+m1[1]*m2[6]+m1[2]*m2[10]+m1[3]*m2[14];
	        m[3]   = m1[0]*m2[3]+m1[1]*m2[7]+m1[2]*m2[11]+m1[3]*m2[15];
	        m[4]   = m1[4]*m2[0]+m1[5]*m2[4]+m1[6]*m2[8]+m1[7]*m2[12];
	        m[5]   = m1[4]*m2[1]+m1[5]*m2[5]+m1[6]*m2[9]+m1[7]*m2[13];
	        m[6]   = m1[4]*m2[2]+m1[5]*m2[6]+m1[6]*m2[10]+m1[7]*m2[14];
	        m[7]   = m1[4]*m2[3]+m1[5]*m2[7]+m1[6]*m2[11]+m1[7]*m2[15];
	        m[8]   = m1[8]*m2[0]+m1[9]*m2[4]+m1[10]*m2[8]+m1[11]*m2[12];
	        m[9]   = m1[8]*m2[1]+m1[9]*m2[5]+m1[10]*m2[9]+m1[11]*m2[13];
	        m[10]  = m1[8]*m2[2]+m1[9]*m2[6]+m1[10]*m2[10]+m1[11]*m2[14];
	        m[11]  = m1[8]*m2[3]+m1[9]*m2[7]+m1[10]*m2[11]+m1[11]*m2[15];
	        m[12]  = m1[12]*m2[0]+m1[13]*m2[4]+m1[14]*m2[8]+m1[15]*m2[12];
	        m[13]  = m1[12]*m2[1]+m1[13]*m2[5]+m1[14]*m2[9]+m1[15]*m2[13];
	        m[14]  = m1[12]*m2[2]+m1[13]*m2[6]+m1[14]*m2[10]+m1[15]*m2[14];
	        m[15]  = m1[12]*m2[3]+m1[13]*m2[7]+m1[14]*m2[11]+m1[15]*m2[15];
	    
	        return m;
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		/**
		 * calcAngle [计算两空间三维向量之间夹角]
		 * @AuthorName Hanlongzhen 
		 * @DateTime   2016-04-06T13:42:37+0800
		 * @param      {[array]} vec0 [description]
		 * @param      {[array]} vec1 [description]
		 * @return     {[number]} [radian angle]
		 */
		return function (vec0, vec1) {
	        let numerator 	= vec0[0]*vec1[0] + vec0[1]*vec1[1] + vec0[2]*vec1[2],
	            denominator = Math.sqrt(vec0[0]*vec0[0] + vec0[1]*vec0[1] + vec0[2]*vec0[2])*Math.sqrt(vec1[0]*vec1[0] + vec1[1]*vec1[1] + vec1[2]*vec1[2]);

	        return Math.acos(numerator/denominator);
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

	    /**
	     * [calcZ calculate the z-component for a space vector.
	     * x y 实际计算的是从旋转中心到点击的位置的 x、y 坐标]
	     * @param  {[array]} touchPos [点击位置]
	     * @param  {[array]} pos [原始位置]
	     * @param  {[number]} radius [空间球体半径]
	     * @param  {[bool]} opposite [空间球体半径]
	     * @return {[array]}    [空间三维向量]
	     */
	    return function (touchPos, pos, radius, opposite) {
	        let x = -1 + (touchPos[0] - pos[0]) / radius,
	            y = -1 + (touchPos[1] - pos[1]) / radius,
	            z = 1 - x * x - y * y;

	        if (opposite) {
	            x *= -1;
	            y *= -1;
	        }

	        return [x, y, z];
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){

	    let userAgent   = navigator.userAgent.toLowerCase(),
	        prefixCss    = "";

	    if(/webkit/gi.test(userAgent)){
	        prefixCss = "-webkit-";
	    }else if(/msie | trident/gi.test(userAgent)){
	        prefixCss = "-ms-";
	    }else if(/mozilla/gi.test(userAgent)){
	        // prefixCss = "-moz-";
	    }else if(/opera/gi.test(userAgent)){
	        prefixCss = "-o-";
	    }

	    return prefixCss;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		/**
	     * crossVector [两个空间三维向量的叉积，既是计算出旋转轴
	    // 如果两个向量长度不一致，则不可以进行运算]
	     * @AuthorName Hanlongzhen
	     * @DateTime   2016-04-06T13:47:13+0800
	     * @param      {[array]} vec0 [三维向量]
	     * @param      {[array]} vec1 [三维向量]
	     * @return     {[array]} [三维向量，旋转轴]
	     */
	    return function (vec0, vec1){
	        let res = [];
	        
	        res[0] = vec0[1]*vec1[2] - vec0[2]*vec1[1];
	        res[1] = vec0[2]*vec1[0] - vec0[0]*vec1[2];
	        res[2] = vec0[0]*vec1[1] - vec0[1]*vec1[0];

	        return res;
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    // inerpolate rotate3d vector into a 3d matrix, information from w3 org
		return function (axis, angle){
	        let x  = axis[0],
	            y  = axis[1],
	            z  = axis[2],
	            a  = angle,
	            sc = Math.sin(a) / 2,
	            sq = Math.sin(a/2)*Math.sin(a/2),
	            m  = new Float32Array(16);

	        m[0]  = 1-2*(y*y + z*z)*sq;
	        m[1]  = 2*(x*y*sq + z*sc);
	        m[2]  = 2*(x*z*sq - y*sc);
	        m[4]  = 2*(x*y*sq - z*sc);
	        m[5]  = 1-2*(x*x+z*z)*sq;
	        m[6]  = 2*(y*z*sq + x*sc);
	        m[8]  = 2*(x*z*sq + y*sc);
	        m[9]  = 2*(y*z*sq - x*sc);
	        m[10] = 1-2*(x*x + y*y)*sq;
	        m[15] = 1;

	        return m;
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		/**
	     * 将matrix3d的字符串转化为数组
	     * @param  {[type]} matrix [description]
	     * @return {[type]}        [description]
	     */
		return function (matrix){

	        let arr = matrix.split(",");

	        if (arr.length < 16) {
	            return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
	        }

	        arr[0]  = arr[0].replace(/(matrix3d\()/g, "");
	        arr[15] = arr[15].replace(/\)/g, "");

	        return Float32Array.from(arr);
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){

	    return function (obj, type, callback, propa) {

	        let propagation = arguments[3] || false;
	        obj.addEventListener(type, callback, propagation);
	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){

	    return function (obj, type, callback, option ) {

	        let useCapture  = arguments[3] || false;
	        obj.removeEventListener(type, callback, useCapture);
	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
		return  window.requestAnimationFrame       || 
		        window.webkitRequestAnimationFrame || 
		        window.mozRequestAnimationFrame    || 
		        window.oRequestAnimationFrame      || 
		        window.msRequestAnimationFrame     || 
		        function(/* function */ callback, /* DOMElement */ element){
		            return window.setTimeout(callback, 1000 / 60);
		        };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    return  window.cancelAnimationFrame            		||
		        window.webkitCancelRequestAnimationFrame    ||
		        window.mozCancelRequestAnimationFrame       ||
		        window.oCancelRequestAnimationFrame        	||
		        window.msCancelRequestAnimationFrame        ||
		        clearTimeout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

	           __webpack_require__(3),
	           __webpack_require__(11),
	           __webpack_require__(4),
	           __webpack_require__(5),
	           __webpack_require__(6),
	           __webpack_require__(7),
	           __webpack_require__(8),
	           __webpack_require__(9),
	           __webpack_require__(10),
	           __webpack_require__(2),
	           __webpack_require__(12),
	           __webpack_require__(13),
	           __webpack_require__(14),
	           __webpack_require__(15),
	           __webpack_require__(16),
	           __webpack_require__(20),
	           __webpack_require__(17),
	           __webpack_require__(18),
	           __webpack_require__(26),
	           __webpack_require__(25),
	           __webpack_require__(23),
	           __webpack_require__(29),
	           __webpack_require__(30)

	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, multiplyMatrix3d, calcAngle, calcZ, normalize, crossVector, rotateMatrix, matrixToArr,
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

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(21),
	           __webpack_require__(22),
	           __webpack_require__(24),
	           __webpack_require__(25)
	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (document, normalResult, errorResult, reveal) {
	    /**
	     * url 地址
	     * success 成功回调函数
	     * dataObj FormData 对象
	     * method 请求方式
	     * async 是否异步
	     * beforeSend 发送前的
	     */
	    return function (url, success, dataObj, method, async, beforeSend) {

	        let progress = document.getElementById('progress');

	        method     = method || 'POST';
	        async      = async || true;
	        beforeSend = beforeSend || function () {

	                if (progress) {
	                    reveal(progress);
	                }

	            };

	        beforeSend();

	        let R = new XMLHttpRequest();

	        R.onreadystatechange = function () {
	            if (R.readyState === XMLHttpRequest.DONE) {
	                if (R.status === 200) {

	                    function callback(r) {

	                        if (r.status) {

	                            success(r);

	                            normalResult();

	                        } else {


	                            errorResult(r.message);
	                        }

	                    }

	                    callback(JSON.parse(R.responseText))

	                } else {
	                    throw 'error occured during request';
	                }
	            }
	        };

	        R.open(method, url, async);
	        // cross-site request forgery protection
	        R.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf_token"]').getAttribute('content'));
	        R.send(dataObj);

	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return window.document;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(23)
	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (conceal) {

	    return function () {

	        let progress = document.getElementById('progress');

	        if (!progress) {
	            return false;
	        }

	        progress.classList.remove('taiji');
	        progress.classList.add('correct');

	        setTimeout(function () {
	            conceal(progress);

	            progress.classList.remove('correct');
	            progress.classList.add('taiji');
	        }, 2000);

	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    /**
	     * 隐藏元素
	     */
	    return function (element){
	        element.style['display'] = 'none';
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(23),
	           __webpack_require__(25)
	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (conceal, reveal) {

	    return function (message) {

	        let bar      = document.getElementById('errorBar'),
	            progress = document.getElementById('progress');

	        if (progress) {
	            conceal(progress);
	        }

	        if (!bar) {
	            return false;
	        }

	        bar.innerHTML = message;
	        reveal(bar);

	        setTimeout(function () {
	            conceal(bar);
	        }, 5000);

	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    /**
	     * 显示元素
	     */
	    return function (element){
	        element.style['display'] = 'block';
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(14),
	           __webpack_require__(27),
	           __webpack_require__(28),
	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function  (matrixToArr, arrToMatrix, inverseMatrix3d) {

	    /**
	     * 计算一个旋转矩阵的逆矩阵
	     * 排除了 translate 部分
	     */
	    return function (matrix3d) {

	        let arr = matrixToArr(matrix3d);

	        arr[12] = 0;
	        arr[13] = 0;
	        arr[14] = 0;

	        return arrToMatrix( inverseMatrix3d(arr) );
	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		/**
	     * [arrToMatrix 将数组转化为matrix3d的字符串]
	     * @param  {[array]} arr [description]
	     * @return {[string]}    [description]
	     */
		return function (arr){
	        return 'matrix3d(' + arr.join(',') + ')';
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    /**
	     * 求一个 transform: matrix3d 矩阵的逆矩阵
	     * m 最好是一个 Float32Array
	     */
		return function (m, r){

			r = r || new Float32Array(16);

			r[0]  = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
			r[1]  = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
			r[2]  = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
			r[3]  = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];
			
			r[4]  = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
			r[5]  = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
			r[6]  = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
			r[7]  = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];
			
			r[8]  = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
			r[9]  = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
			r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
			r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];
			
			r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
			r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
			r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
			r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];

	        let det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
			for (let i = 0; i < 16; i++) r[i] /= det;
			return r;
	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(4)
	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function(trsfm){

	    return function (obj) {
	        obj.style[trsfm] = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
	        return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

	           __webpack_require__(31),
	           __webpack_require__(4),
	           __webpack_require__(5),
	           __webpack_require__(32),
	           __webpack_require__(33),
	           __webpack_require__(34)

	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function (annulus, trsfm, getStyle, closestPoint, maxPoint, fibonacciSphere) {
	    "use strict";

	    class YangSpaceLayout {

	        constructor(param) {

	            this.stage    = param.stage;
	            this.radius   = param.radius;            //每层球面实际半径
	            this.gap      = param.gap;               //每一层球面的间隔
	            this.tiers    = 0;                       //一共有多少层
	            this.N        = 0;                       //每一层球面上均匀分布的点的数量，不小于该层的元素数量
	            this.prevTier = 0;
	            this.allPos   = [];                      //记录每一个 id 对应的空间位置的数据
	            this.tierPos  = [];                      //记录当前球面的所有点位位置和旋转，用于赋值，已经复制的点位即删除
	            this.savedPos = [];                      //记录当前球面的所有点位位置和旋转，如果下一层点的数量和上层相等，则不用计算直接从这里取值

	        }//constructor ends


	        /**
	         * 操作界面部分布局
	         */
	        static setOperation(annu) {
	            annulus(annu);
	        }


	        spheres() {

	            //在空间中定位元素
	            this.diffuse();

	            this.tiers = this.prevTier - 1;

	            delete this.N;
	            delete this.prevTier;
	            delete this.allPos;
	            delete this.tierPos;
	            delete this.savedPos;

	        }//spheres ends


	        /**
	         * 将每一层的元素均匀分布到空间当中，
	         * 每一层都在同一个球面上，并且每一个面都朝向圆心
	         * 从第一层开始，递归的取到最后一层元素
	         * 通过 translate3d 定位偏离圆心的距离
	         * 通过 rotate3d 使得面和球面相切，并且转动到和纬线相平行的角度]
	         * @author Hanlongzhen 2016-04-19 10:39
	         */
	        diffuse() {
	            let stars = this.stage.querySelectorAll('.tier-' + this.prevTier);

	            //如果没有下一层了，则停止
	            if (!stars.length) {
	                return false;
	            }

	            /**
	             * 如果是最内层，则空间中的点的数量就是元素的数量
	             * 如果不是，则先算出该层的上一层的分类数，记为 elders，再计算哪个父分类中的子分类最多，记为 sons，
	             * 然后取 elders*sons，stars.length，N 中的最大者，作为该层球面包含的点的数量
	             */
	            this.N = this.prevTier ? maxPoint(stars, this.N*2) : stars.length;

	            //当前层的半径
	            this.radius += this.gap;

	            /**
	             * 如果计算出的球面的点的数量 N 等于当前储存的 savedPos
	             * 那么就直接将 savedPos 赋值给 tierPos
	             * 否则通过 fibonacciSphere 计算出球面点的位置和旋转角度
	             * 并将返回值赋值给 savedPos 和 tierPos
	             */
	            this.tierPos = fibonacciSphere(this.N, this.radius);

	            /**
	             * 如果是最内层，则直接给元素定位，不需要考虑上级分类元素的位置
	             * 如果不是最内层，则先把这一层所有元素的位置和旋转信息储存起来，
	             * 再根据父分类的位置，计算元素所在位置，需要多一次循环
	             */
	            let i      = 0,
	                pos    = null,
	                p      = null,
	                k      = null,
	                s_data = null,
	                pid    = 0,
	                ctg_id = 0;

	            do {
	                //如果不是 DOM 对象，则跳出当前 for 循环
	                //if (!(stars[i] instanceof Object)) {
	                //    continue;
	                //}

	                s_data = stars[i].dataset;
	                pid    = s_data['pid'];
	                ctg_id = s_data['ctg_id'];

	                /**
	                 * 外层球面通过父级分类的位置和当前球面的位置数组 tierPos，
	                 * 计算出应当取哪一个当前点，取到此点之后即将此点从 tierPos 中删除，
	                 * 如果是最内层，因为 N == stars.length，依序取 tierPos 中的点即可
	                 */
	                if (this.prevTier) {

	                    p = this.allPos[pid];
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
	                if (ctg_id) {
	                    this.allPos[ctg_id] = {x: pos.tx, y: pos.ty, z: pos.tz};
	                }

	                i++;

	            } while (i < stars.length);

	            //深入到下一层
	            this.prevTier++;

	            this.diffuse();

	        }//diffuse ends


	    }//YangSpaceLayout ends

	    return YangSpaceLayout;

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	           __webpack_require__(21),
	           __webpack_require__(4),
	       ], __WEBPACK_AMD_DEFINE_RESULT__ = function(document, trsfm) {

	    /**
	     * 将若干个元素根据指定半径排成环形
	     * 顺时针从12点方位开始
	     * @param annulusOpt 选项
	     * arr 传入元素选择器和半径 array 每一个键值如下 {'selector':'', 'radius':number}
	     */
	    return function (arr){

	        let ele  = [],                                      //元素数组
	            len  = 0,                                       //元素的个数
	            i    = 0,                                       //annu 的键名
	            j    = 0,                                       //ele 的键名
	            r    = 0,                                       //半径
	            x    = 0,                                       //元素的x方向位移
	            y    = 0,                                       //元素的y方向位移
	            a    = 0;                                       //元素的顺时针弧度角

	        while (i < arr.length) {

	            ele = document.body.querySelectorAll(arr[i].selector);
	            r   = arr[i].radius;
	            len = ele.length;
	            a   = Math.PI * 2 / len;

	            j = x = y = 0;

	            while (j < ele.length) {

	                x = r * Math.sin(a * j);
	                y = r * Math.cos(a * j) * -1;

	                ele[j].style[trsfm] = 'translate(' + x + 'px,' + y + 'px)';

	                j++;
	            }

	            i++;
	        }

	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    /**
	     * closestPoint 从位置数组中寻找离空间中指定点最近的点
	     * @param parentPos
	     * @param posArray
	     */
	    return function (parentPos, posArray) {
	        let dis = null,
	            d   = 0,
	            k   = 0,
	            x   = 0,
	            y   = 0,
	            z   = 0,
	            i   = 0;

	        do {

	            x = posArray[i]['tx'] - parentPos['x'];
	            y = posArray[i]['ty'] - parentPos['y'];
	            z = posArray[i]['tz'] - parentPos['z'];

	            d = Math.sqrt(x*x + y*y + z*z);
	            //如果还没有最小距离，则把当前点计算出的最小距离和数组中的键名记录下来
	            if (dis === null) {
	                dis = d;
	                k   = i;
	                continue;
	            }
	            //如果当前计算出的空间亮点距离小于之前的最小距离
	            //则记录当前的最小距离和数组中的键名
	            if (d < dis) {
	                dis = d;
	                k   = i;
	            }

	            i++;

	        } while (i < posArray.length);
	        
	        return k;
	    }

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    /**
	     * maxPoint 计算出每个球面上应该有多少个均匀分布的点
	     * 先算出该层的上一层的分类数，记为 f，再计算哪个父分类中的子分类最多，记为 s，
	     * 然后取 f*s，arr.length，n 中的最大者，作为该层球面包含的点的数量
	     * @param arr
	     * @param n
	     * @return int
	     */
	    return function (arr, n) {
	        /**
	         * keys 储存父级分类的 id
	         * values 储存每一个父级分类包含的子分类的个数
	         * j 表示 values 的键名
	         */
	        let keys   = [],
	            values = [],
	            j      = -1,
	            i      = 0;

	        do {

	            if (!(arr[i] instanceof Object)) {
	                continue;
	            }
	            let pid = arr[i].dataset.pid;

	            if (keys[pid] === undefined) {
	                j++;
	                keys[pid] = true;
	                values[j] = 1;
	            } else {
	                values[j]++;
	            }

	            i++;

	        } while (i < arr.length);

	        let f = values.length,
	            s = Math.max.apply(null, values);

	        return Math.max(f * s, arr.length, n);
	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    /**
	     * http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
	     * positioning the points by spiral Fibonacci method
	     * 在球面做一条螺旋线，依照螺旋线按照黄金分割取点，获取近似的球面均匀分布的点位
	     * @param num 点的总数
	     * @param radius 球面半径
	     * @return array
	     */
	    return function (num, radius) {

	        let dlong = Math.PI * (3 - Math.sqrt(5)),  // ~2.39996323
	            dz    = 2.0 / num,
	            long  = 0,
	            z     = 1 - dz / 2,
	            r     = 0,
	            arr   = [],
	            tx    = 0,          //X方向的位移
	            ty    = 0,          //Y方向的位移
	            tz    = 0,          //Z方向的位移
	            rx    = 0,          //X轴的旋转
	            ry    = 0,          //Y轴的旋转
	            sz    = 0,          //Z位移的正负号
	            i     = 0;

	        do {

	            r    = Math.sqrt(1 - z * z);
	            tx   = Math.cos(long) * r * radius;
	            ty   = Math.sin(long) * r * radius;
	            tz   = z * radius;
	            z    = z - dz;
	            long = long + dlong;

	            //判断元素是在z轴正方向还是负方向
	            sz = tz / Math.abs(tz);
	            sz = isNaN(sz) ? 1 : sz;
	            //如果是在Z轴正方向，
	            //则把元素沿y轴多旋转180度，使得正面朝向圆心
	            if (sz > 0) {
	                ry = Math.atan(tx / tz) + Math.PI;
	            } else {
	                ry = Math.atan(tx / tz);
	            }

	            rx = Math.asin(ty / radius);

	            arr[i] = {tx: tx, ty: ty, tz: tz, ry: ry, rx: rx};

	            i++;

	        } while (i < num);

	        return arr;

	    }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ]);