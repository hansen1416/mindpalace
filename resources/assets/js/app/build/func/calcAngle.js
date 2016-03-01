define(function() {

	return function (vec0, vec1){ // 计算两空间三维向量之间夹角
        var numerator 	= vec0[0]*vec1[0] + vec0[1]*vec1[1] + vec0[2]*vec1[2],
            denominator = Math.sqrt(vec0[0]*vec0[0] + vec0[1]*vec0[1] + vec0[2]*vec0[2])*Math.sqrt(vec1[0]*vec1[0] + vec1[1]*vec1[1] + vec1[2]*vec1[2]),
            angle 		= Math.acos(numerator/denominator);
        return angle;
    }

} );