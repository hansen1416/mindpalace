define(function() {

	return function (vec0, vec1){ // 两个空间三维向量的叉积，既是计算出旋转轴
        var res = [];
        //如果两个向量长度不一致，则不可以进行运算
        if(vec0.length != vec1.length){
            return false;
        }

        res[0] = vec0[1]*vec1[2] - vec0[2]*vec1[1];
        res[1] = vec0[2]*vec1[0] - vec0[0]*vec1[2];
        res[2] = vec0[0]*vec1[1] - vec0[1]*vec1[0];

        return res;
    }

} );