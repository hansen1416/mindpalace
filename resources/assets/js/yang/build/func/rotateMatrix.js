define(function() {
    // inerpolate rotate3d vector into a 3d matrix, information from w3 org
	return function (axis, angle){
        var x  = axis[0],
            y  = axis[1],
            z  = axis[2],
            a  = angle,
            sc = Math.sin(a) / 2,
            sq = Math.sin(a/2)*Math.sin(a/2),
            m  = new Float32Array(16);

        m[0]  = 1-2*(y*y + z*z)*sq;
        m[1]  = 2*(x*y*sq + z*sc);
        m[2]  = 2*(x*z*sq - y*sc);
        m[4]  = 2*(x*y*sq - z*sc);
        m[5]  = 1-2*(x*x+z*z)*sq;
        m[6]  = 2*(y*z*sq + x*sc);
        m[8]  = 2*(x*z*sq + y*sc);
        m[9]  = 2*(y*z*sq - x*sc);
        m[10] = 1-2*(x*x + y*y)*sq;
        m[15] = 1;

        return m;
    }

} );