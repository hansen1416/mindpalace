define(function() {
	/**
	 * calcAngle [计算两空间三维向量之间夹角]
	 * @AuthorName Hanlongzhen 
	 * @DateTime   2016-04-06T13:42:37+0800
	 * @param      {[array]} vec0 [description]
	 * @param      {[array]} vec1 [description]
	 * @return     {[number]} [radian angle]
	 */
	return function (vec0, vec1) {
        let numerator 	= vec0[0]*vec1[0] + vec0[1]*vec1[1] + vec0[2]*vec1[2],
            denominator = Math.sqrt(vec0[0]*vec0[0] + vec0[1]*vec0[1] + vec0[2]*vec0[2])*Math.sqrt(vec1[0]*vec1[0] + vec1[1]*vec1[1] + vec1[2]*vec1[2]);

        return Math.acos(numerator/denominator);
    }

});