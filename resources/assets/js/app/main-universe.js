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
console.log(123123123123);
        trackball();
        


});
