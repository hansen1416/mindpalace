define([
           "../build/func/matrixToArr",
           "../build/func/arrToMatrix",
           "./inverseMatrix3d",
       ], function  (matrixToArr, arrToMatrix, inverseMatrix3d) {

    return function (matrix3d) {

        var arr = matrixToArr(matrix3d);

        arr[12] = 0;
        arr[13] = 0;
        arr[14] = 0;

        return arrToMatrix( inverseMatrix3d(arr) );
    }

});