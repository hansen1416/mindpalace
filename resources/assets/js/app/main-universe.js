define([
		"./var/bindEvent",
		"./var/cancelAnim",
		"./var/document",
		"./var/documentElement",
		"./var/pos",
		"./var/requestAnim",
		"./var/unbindEvents",
		"./var/xmlns",
        "./build/build",
        "./build/trackball",

	], function (bindEvent, cancelAnim, document, documentElement, pos, requestAnim, unbindEvents, xmlns, build, trackball) {

    //给每一个 star 在空间中定位 translate3d
    var B = new Build();
    //给 galaxy 绑定3d旋转鼠标事件 
    var T = new Trackball({
        stage:          "stage",        //旋转对象的容器，在这里将mousedown事件绑定在了容器上
        obj:            ["galaxy"],     //旋转的对象
        impulse:        true,           //true有惯性，false没有惯性
        resetMotion:    true,           //当鼠标点击目标元素时，是否停止当前运动，true为停止
        omegaGap:       0.8,            //单位角速度的cap,必须是大于0的数，默认为0.5
        lambda:         0.008,          //阻力系数，越大阻力越大，默认0.01
    });


});
