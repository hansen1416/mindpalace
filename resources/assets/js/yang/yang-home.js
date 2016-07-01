define([
           './class/yang_home'

       ], function (yang_home) {

    /**
     * 引入 class YangHome
     * @type {null}
     */
    yang_home = null;

    window.YangHome.setRings([
                                 {'selector': '.panel', 'radius': 150}
                             ]);

    var yh = new YangHome();

    yh.click();


});
