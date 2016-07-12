define([

           './class/event/yang_home_event'

       ], function (yang_home_event) {

    /**
     * 引入 class YangHomeEvent
     * @type {null}
     */
    yang_home_event = null;

    window.YangHomeEvent.setRings([
                                      {'selector': '.panel', 'radius': 150}
                                  ]);


    var Y = new YangHomeEvent();

    Y.click();


});
