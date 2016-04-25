define(function() {

	/**
     * [matrixToArr 将matrix3d的字符串转化为数组]
     * @param  {[type]} matrix [description]
     * @return {[type]}        [description]
     */
	return function (matrix){

        var arr = matrix.split(",");
        arr[0]  = arr[0].replace(/(matrix3d\()/g, "");
        arr[15] = arr[15].replace(/\)/g, "");

        return arr;
    }

});