define(function(){
    /**
     * maxPoint 计算出每个球面上应该有多少个均匀分布的点
     * 先算出该层的上一层的分类数，记为 f，再计算哪个父分类中的子分类最多，记为 s，
     * 然后取 f*s，arr.length，n 中的最大者，作为该层球面包含的点的数量
     * @param arr
     * @param n
     * @return int
     */
    return function (arr, n) {
        /**
         * keys 储存父级分类的 id
         * values 储存每一个父级分类包含的子分类的个数
         * j 表示 values 的键名
         */
        var keys   = [],
            values = [],
            j      = -1,
            i      = 0;

        do {

            if (!(arr[i] instanceof Object)) {
                continue;
            }
            var pid = arr[i].dataset.pid;

            if (keys[pid] === undefined) {
                j++;
                keys[pid] = true;
                values[j] = 1;
            } else {
                values[j]++;
            }

            i++;

        } while (i < arr.length);

        var f = values.length,
            s = Math.max(...values);

        return Math.max(f * s, arr.length, n);
    }
});