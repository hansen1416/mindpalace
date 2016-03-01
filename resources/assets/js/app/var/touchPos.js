define(function() {

	return function (eventObj){ // get the mouse/touch position
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