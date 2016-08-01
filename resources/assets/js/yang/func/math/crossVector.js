define(function() {
	/**
     * crossVector [两个空间三维向量的叉积，既是计算出旋转轴
    // 如果两个向量长度不一致，则不可以进行运算]
     * @AuthorName Hanlongzhen
     * @DateTime   2016-04-06T13:47:13+0800
     * @param      {[array]} vec0 [三维向量]
     * @param      {[array]} vec1 [三维向量]
     * @return     {[array]} [三维向量，旋转轴]
     */
    return function (vec0, vec1){
        let res = [];
        
        res[0] = vec0[1]*vec1[2] - vec0[2]*vec1[1];
        res[1] = vec0[2]*vec1[0] - vec0[0]*vec1[2];
        res[2] = vec0[0]*vec1[1] - vec0[1]*vec1[0];

        return res;
    }

} );