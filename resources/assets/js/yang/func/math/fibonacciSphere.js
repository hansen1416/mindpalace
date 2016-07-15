define(function () {
    /**
     * http://web.archive.org/web/20120421191837/http://www.cgafaq.info/wiki/Evenly_distributed_points_on_sphere
     * positioning the points by spiral Fibonacci method
     * 在球面做一条螺旋线，依照螺旋线按照黄金分割取点，获取近似的球面均匀分布的点位
     * @param num 点的总数
     * @param radius 球面半径
     * @return array
     */
    return function (num, radius) {

        var dlong = Math.PI * (3 - Math.sqrt(5)),  // ~2.39996323
            dz    = 2.0 / num,
            long  = 0,
            z     = 1 - dz / 2,
            r     = 0,
            arr   = [],
            tx    = 0,          //X方向的位移
            ty    = 0,          //Y方向的位移
            tz    = 0,          //Z方向的位移
            rx    = 0,          //X轴的旋转
            ry    = 0,          //Y轴的旋转
            sz    = 0,          //Z位移的正负号
            i     = 0;

        do {

            r    = Math.sqrt(1 - z * z);
            tx   = Math.cos(long) * r * radius;
            ty   = Math.sin(long) * r * radius;
            tz   = z * radius;
            z    = z - dz;
            long = long + dlong;

            //判断元素是在z轴正方向还是负方向
            sz = tz / Math.abs(tz);
            sz = isNaN(sz) ? 1 : sz;
            //如果是在Z轴正方向，
            //则把元素沿y轴多旋转180度，使得正面朝向圆心
            if (sz > 0) {
                ry = Math.atan(tx / tz) + Math.PI;
            } else {
                ry = Math.atan(tx / tz);
            }

            rx = Math.asin(ty / radius);

            arr[i] = {tx: tx, ty: ty, tz: tz, ry: ry, rx: rx};

            i++;

        } while (i < num);

        return arr;

    }
});