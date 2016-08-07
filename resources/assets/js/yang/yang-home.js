define([

           './class/event/YangHomeEvent'

       ], function (YangHomeEvent) {
    "use strict";

    YangHomeEvent.setRings([
                               {'selector': '.panel', 'radius': 150},
                               {'selector': '.circle1', 'radius': 250}
                           ]);


    let Y = new YangHomeEvent();

    Y.click();

});
