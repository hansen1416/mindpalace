define([

    "./class/layout/yang_space_layout",
    "./class/event/yang_space_event"

], function (yang_space_layout, yang_space_event) {

    /**
     * 引入 class YangSpaceLayout
     * 引入 class YangSpaceEvent
     * @type {null}
     */
    yang_space_layout = null;
    yang_space_event = null;

    /**
     * 赋予 operation 部分样式
     * 所有按钮环形排布
     */
    window.YangSpaceLayout.setOperation([
                                      {'selector': '.ctg_btn', 'radius': 100},
                                      {'selector': '.item_btn', 'radius': 100}
                                  ]);

    var ysl = new YangSpaceLayout({
        stage    : document.getElementById('stage'),
        rotateObj: document.getElementById('galaxy'),
        radius   : 140,
        gap      : 120
    });

    //生成同心球面
    ysl.spheres();



    //ys.trackball({
    //                 //true有惯性，false没有惯性
    //                 impulse    : true,
    //                 //当鼠标点击目标元素时，是否停止当前运动，true为停止
    //                 resetMotion: true,
    //                 //单位角速度的cap,必须是大于0的数，默认为0.5
    //                 omegaGap   : 0.8,
    //                 //阻力系数，越大阻力越大，默认0.01
    //                 lambda     : 0.001
    //             });



});
