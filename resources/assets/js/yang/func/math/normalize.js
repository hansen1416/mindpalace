define(function() {

	return function (vec){ // 向量单位化，可以是任意维向量
        let len = vec.length, vecLength = 0, norm = [];

        for(let i = 0; i < len; i++){
            vecLength += Math.pow(vec[i], 2);
        }

        vecLength = Math.sqrt(vecLength);

        if(vecLength == 0){
            return false;       //当向量坐标全都为0时，避免出现NaN
        }

        for(let i = 0; i < len; i++){
            norm[i] = vec[i]/vecLength;
        }

        return norm;
    }

} );