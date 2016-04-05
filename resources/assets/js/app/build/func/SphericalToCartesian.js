define(function() {
	/**
     * [SphericalToCartesian 将球面坐标系转化为笛卡尔坐标系]
     * @AuthorName Hanlongzhen
     * @DateTime   2016-04-01T11:51:30+0800
     * @param      {[number]} theta [longtitude]
     * @param      {[number]} phi [colatitude]
     * @param      {[number]} r [radius]
     * @param      {[string]} unit [单位]
     */
	return function (theta, phi, r, unit){ // inerpolate rotate3d vector into a 3d matrix, information from w3 org
        var a = [];
        unit = unit || '';

        a[0] = r * Math.sin(phi) * Math.cos(theta) + unit;
        a[1] = r * Math.sin(phi) * Math.sin(theta) + unit;
        a[2] = r * Math.cos(phi) + unit;

        return a;
    }

} );