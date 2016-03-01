define(function() {

	return function (axis, angle){ // inerpolate rotate3d vector into a 3d matrix, information from w3 org
        var x 		= axis[0],
            y 		= axis[1],
            z 		= axis[2],
            a 		= angle,
            sc 		= Math.sin(a) / 2,
            sq 		= Math.sin(a/2)*Math.sin(a/2),
            matrix 	= [1-2*(y*y + z*z)*sq, 2*(x*y*sq + z*sc), 2*(x*z*sq - y*sc), 0, 2*(x*y*sq - z*sc), 1-2*(x*x+z*z)*sq, 2*(y*z*sq + x*sc), 0, 2*(x*z*sq + y*sc), 2*(y*z*sq - x*sc), 1-2*(x*x + y*y)*sq, 0, 0, 0, 0, 1];
        return matrix;
    }

} );