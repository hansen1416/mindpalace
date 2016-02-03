define([
		"./var/bindEvent",
		"./var/cancelAnim",
		"./var/document",
		"./var/documentElement",
		"./var/pos",
		"./var/requestAnim",
		"./var/unbindEvents",
		"./var/xmlns",
	], function (bindEvent, cancelAnim, document, documentElement, pos, requestAnim, unbindEvents, xmlns) {

    var stage   = document.getElementById('stage'),         //舞台，等于窗口大小的元素
        galaxy  = document.getElementById('galaxy'),        //银河，包含所有的分类，大小待定
        stars   = galaxy. querySelectorAll('.star');        //页面所有的分类

        for (var i = 0; i < stars.length; i++) {
            console.log(stars[i]);
        };


});
