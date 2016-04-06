define(function() {
    /**
     * touchPos [get the mouse/touch position]
     * @AuthorName Hanlongzhen
     * @DateTime   2016-04-06T13:46:34+0800
     * @param      {[object]} eventObj [事件对象]
     * @return     {[array]} [平面上的点]
     */
	return function (eventObj){
        var x, y;
        if(eventObj.type.indexOf("mouse")>-1){
            x = eventObj.pageX;
            y = eventObj.pageY;
        }else if(eventObj.type.indexOf("touch")>-1){
            if(eventObj.touches.length === 1 ){
                var touch = eventObj.touches[0];
                x = touch.pageX;
                y = touch.pageY;
            }
        }
        return [x,y];
    }

} );