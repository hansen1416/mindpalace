define(function(){
	return  window.requestAnimationFrame       || 
	        window.webkitRequestAnimationFrame || 
	        window.mozRequestAnimationFrame    || 
	        window.oRequestAnimationFrame      || 
	        window.msRequestAnimationFrame     || 
	        function(/* function */ callback, /* DOMElement */ element){
	            return window.setTimeout(callback, 1000 / 60);
	        };
})