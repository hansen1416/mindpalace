define(function() {

	/**
     * [calcZ calculate the z-component for a space vector.
     * x y 实际计算的是从旋转中心到点击的位置的 x、y 坐标]
     * @param  {[array]} touchPos [点击位置]
     * @param  {[array]} pos [原始位置]
     * @param  {[number]} radius [空间球体半径]
     * @return {[array]}    [空间三维向量]
     */
	return function (touchPos, pos, radius){
        var x = (touchPos[0] - pos[0])/radius - 1,
            y = (touchPos[1] - pos[1])/radius - 1,
            z = 1 - x*x -y*y;

        return [x, y, z];
    }

} );