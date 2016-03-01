define([
        "../var/prefixJs",
        "../var/prefixCss",
        "../var/trsfm",
        "../var/getStyle",
        "../var/touchPos",
        "../var/findPos",
        "./func/multiplyMatrix3d",
        "./func/calcAngle",
        "./func/normalize",
        "./func/crossVector",
        "./func/rotateMatrix",
        "./func/matrixToArr",
        
    ], function (prefixJs, prefixCss, trsfm, getStyle, touchPos, findPos, multiplyMatrix3d, calcAngle, normalize, crossVector, rotateMatrix, matrixToArr) {

        return function trackball() {
            console.log(matrixToArr);
        }
        
});