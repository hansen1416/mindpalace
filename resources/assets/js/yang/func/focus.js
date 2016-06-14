define([
           "../build/func/matrixToArr",
           "./inverseMatrix3d",
       ], function  (matrixToArr, inverseMatrix3d) {

    return function (matrix3d) {
        matrixToArr(matrix3d);
    }

});