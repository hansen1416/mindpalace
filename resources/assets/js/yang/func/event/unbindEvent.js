define(function(){

    return function (obj, type, callback, option ) {

        let useCapture  = arguments[3] || false;
        obj.removeEventListener(type, callback, useCapture);
    }
});