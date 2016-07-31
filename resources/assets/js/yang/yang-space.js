define([
           "./class/event/yang_trackball",
           "./class/event/yang_space_event"

       ], function (yang_trackball, yang_space_event) {

    /**
     * 引入 class YangTrackball
     * 引入 class YangSpaceLayout
     * @type {null}
     */
    yang_trackball = null;
    yang_space_event = null;

    let T1 = new YangTrackball({
        stage      : document.getElementById('top_left'),
        rotateObj  : document.getElementById('top_left_cube'),
        //true有惯性，false没有惯性
        impulse    : true,
        //当鼠标点击目标元素时，是否停止当前运动，true为停止
        resetMotion: true,
        //单位角速度的cap,必须是大于0的数，默认为0.5
        omegaGap   : 0.8,
        //阻力系数，越大阻力越大，默认0.01
        lambda     : 0.001
    });

    T1.trackball();

    /**
     * 赋予 operation 部分样式
     * 所有按钮环形排布
     */
    window.YangSpaceEvent.setOperation([
                                           {'selector': '.ctg_btn', 'radius': 100},
                                           {'selector': '.item_btn', 'radius': 100}
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
                    omegaGap   : 0.8,
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

});
