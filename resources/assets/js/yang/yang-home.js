define([
        "./var/document",
        './build/build_home',

   ], function (document, build_home) {


    var B = new BuildHome({

    });
    //将控制按钮排成环形
    B.annulus({
                  'annu': [
                      {'selector': '.panel', 'radius': 150},
                  ],
              });

});
