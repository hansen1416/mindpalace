define([
           "./var/document",
           './class/yang_home',

       ], function (document, yang_home) {

    var yh = new YangHome();

    yh.setRings([
                    {'selector': '.panel', 'radius': 150},
                ]);

    yh.click();


});
