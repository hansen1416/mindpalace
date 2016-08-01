define([
           "../math/matrixToArr",
           "../math/arrToMatrix",
           "../math/inverseMatrix3d",
       ], function  (matrixToArr, arrToMatrix, inverseMatrix3d) {

    /**
     * 计算一个旋转矩阵的逆矩阵
     * 排除了 translate 部分
     */
    return function (matrix3d) {

        let arr = matrixToArr(matrix3d);

        arr[12] = 0;
        arr[13] = 0;
        arr[14] = 0;

        return arrToMatrix( inverseMatrix3d(arr) );
    }

});