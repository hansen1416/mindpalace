define([
           "./var/document",
           './class/yang_home',

       ], function (document, yang_home) {

    var yangHome = new YangHome();

    yangHome.setRings([
            {'selector': '.panel', 'radius': 150},
        ])

    yangHome.click();


});
