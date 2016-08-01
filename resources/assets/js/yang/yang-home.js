define([

           './class/event/YangHomeEvent'

       ], function (YangHomeEvent) {
    "use strict";

    YangHomeEvent.setRings([
                               {'selector': '.panel', 'radius': 150}
                           ]);


    let Y = new YangHomeEvent();

    Y.click();

});
