define(function() {
    /**
     * closestPoint 从位置数组中寻找离空间中指定点最近的点
     * @param parentPos
     * @param posArray
     */
    return function (parentPos, posArray) {
        var dis = null,
            d = k = x = y = z = 0;

        for (var i = 0; i < posArray.length; i++) {

            x = posArray['tx'] - parentPos['x'];
            y = posArray['ty'] - parentPos['y'];
            z = posArray['tz'] - parentPos['z'];

            d = Math.sqrt(x*x + y*y + z*z);
            //如果还没有最小距离，则把当前点计算出的最小距离和数组中的键名记录下来
            if (dis === null) {
                dis = d;
                k   = i;
                break;
            }
            //如果当前计算出的空间亮点距离小于之前的最小距离
            //则记录当前的最小距离和数组中的键名
            if (d < dis) {
                dis = d;
                k   = i;
            }

        }

        return k;
    }

} );