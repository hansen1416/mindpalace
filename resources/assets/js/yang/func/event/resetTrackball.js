define([
           "../style/trsfm"
       ], function(trsfm){

    return function (obj) {
        obj.style[trsfm] = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
    }
});