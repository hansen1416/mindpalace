define([
		"./var/bindEvent",
		"./var/cancelAnim",
		"./var/document",
		"./var/documentElement",
		"./var/pos",
		"./var/requestAnim",
		"./var/unbindEvents",
		"./var/xmlns",
        "./build/build_tier",
        "./build/trackball",
	], function (bindEvent, cancelAnim, document, documentElement, pos, requestAnim, unbindEvents, xmlns, build_tier, trackball) {

    var stage           = document.getElementById('stage'),         //舞台，等于窗口大小的元素
        galaxy          = document.getElementById('galaxy'),        //银河，包含所有的分类，大小待定
        star_clas       = '.star',
        stars           = galaxy.querySelectorAll(star_clas),        //页面所有的分类
        fst_star        = galaxy.querySelector(star_clas),
        fst_tier        = fst_star.dataset.tier,
        fst_tier_star   = galaxy.querySelectorAll(star_clas + "[data-tier='" + fst_tier + "']");
        

        build_tier(fst_tier_star);

        var R = new Trackball({
            stage:          "stage",        //旋转对象的容器，在这里将mousedown事件绑定在了容器上
            obj:            ["galaxy"],     //旋转的对象
            impulse:        true,           //true有惯性，false没有惯性
            resetMotion:    true,           //当鼠标点击目标元素时，是否停止当前运动，true为停止
            omegaGap:       0.8,            //单位角速度的cap,必须是大于0的数，默认为0.5
            lambda:         0.008,          //阻力系数，越大阻力越大，默认0.01
        });


});
