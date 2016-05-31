define(function() {

	/**
     * [arrToMatrix 将数组转化为matrix3d的字符串]
     * @param  {[array]} arr [description]
     * @return {[string]}    [description]
     */
	return function (arr){
        return 'matrix3d(' + arr.join(',') + ')';
    }

} );