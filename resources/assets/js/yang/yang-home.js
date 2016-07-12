define([
           './class/layout/yang_home_layout',
           './class/event/yang_home_event'

       ], function (yang_home_layout, yang_home_event) {

    /**
     * 引入 class YangHome
     * 引入 class YangHomeEvent
     * @type {null}
     */
    yang_home_layout = null;
    yang_home_event = null;

    window.YangHomeLayout.setRings([
                                 {'selector': '.panel', 'radius': 150}
                             ]);


    var yhe = new YangHomeEvent();

    yhe.click();


});
