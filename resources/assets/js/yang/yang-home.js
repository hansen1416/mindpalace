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

//define([
//        "./var/document",
//        './build/build_home',
//
//   ], function (document, build_home) {
//
//
//    var B = new BuildHome({
//        'annu': [
//            {'selector': '.panel', 'radius': 150},
//        ],
//    });
//
//    B.click();
//
//
//});
