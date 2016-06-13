define(function(){

    return function (obj, type, callback, option ) {

        var useCapture  = arguments[3] || false;
        obj.removeEventListener(type, callback, useCapture);
    }
});