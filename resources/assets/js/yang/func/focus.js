define([
           "../build/func/matrixToArr",
           "../build/func/arrToMatrix",
           "./inverseMatrix3d",
       ], function  (matrixToArr, inverseMatrix3d, arrToMatrix) {

    return function (matrix3d) {

        var arr = matrixToArr(matrix3d);

        arr[12] = 0;
        arr[13] = 0;
        arr[14] = 0;

        var res = 123;

        return res;

    }

});