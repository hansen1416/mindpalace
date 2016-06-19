define([
    "./var/document",
    "./classes/yang_space",

], function (document, yang_space) {

    var yangSpace = new YangSpace({
        stage    : document.getElementById('stage'),
        rotateObj: document.getElementById('galaxy'),
        radius   : 140,
        gap      : 120,
    });

    //生成同心球面
    yangSpace.spheres();
    //鼠标滚轮事件
    yangSpace.zoom();
    //鼠标点击事件
    yangSpace.click();

    /**
     * 赋予 operation 部分样式
     * 所有按钮环形排布
     */
    yangSpace.setOperation([
        {'selector': '.ctg_btn', 'radius': 100},
        {'selector': '.item_btn', 'radius': 100},
    ]);


});
//define([
//    "./var/document",
//    "./build/build_space",
//    "./build/trackball",
//
//], function (document, build_space, trackball) {
//
//    var stage     = document.getElementById("stage"),
//        rotateObj = document.getElementById("galaxy");
//
//    //给每一个 star 在空间中定位
//    var B = new BuildSpace({
//        stage:      stage,
//        rotateObj:  rotateObj,
//        radius:     140,
//        gap:        120,
//        unit:       'px',
//    });
//    //给 galaxy 绑定3d旋转鼠标事件
//    var T = new Trackball({
//        stage:          stage,                              //旋转对象的容器，在这里将mousedown事件绑定在了容器上
//        obj:            rotateObj,                          //旋转的对象
//        impulse:        true,                               //true有惯性，false没有惯性
//        resetMotion:    true,                               //当鼠标点击目标元素时，是否停止当前运动，true为停止
//        omegaGap:       0.8,                                //单位角速度的cap,必须是大于0的数，默认为0.5
//        lambda:         0.001,                              //阻力系数，越大阻力越大，默认0.01
//    });
//
//    /**
//     * 赋予 operation 部分样式
//     * 所有按钮环形排布
//     */
//    B.setOperation([
//        {'selector': '.ctg_btn', 'radius': 100},
//        {'selector': '.item_btn', 'radius': 100},
//    ]);
//    //滚轮缩放事件
//    B.zoom();
//    //页面点击事件
//    B.click();
//
//});
