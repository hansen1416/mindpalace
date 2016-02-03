define(function(){
	return function(e, svg){
		var x = e.pageX-svg.offsetLeft,
			y = e.pageY-svg.offsetTop;
		return {x:x, y:y};
	}
})