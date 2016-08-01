define(function() {

	/**
     * 将matrix3d的字符串转化为数组
     * @param  {[type]} matrix [description]
     * @return {[type]}        [description]
     */
	return function (matrix){

        let arr = matrix.split(",");

        if (arr.length < 16) {
            return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
        }

        arr[0]  = arr[0].replace(/(matrix3d\()/g, "");
        arr[15] = arr[15].replace(/\)/g, "");

        return Float32Array.from(arr);
    }

});