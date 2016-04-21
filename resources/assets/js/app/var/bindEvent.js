define(function(){

    return function (obj, type, callback, propa) {

        var propagation = arguments[3] || false;
        obj.addEventListener(type, callback, propagation);
    }
});