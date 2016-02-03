define(function(){
	return  window["requestAnimationFrame"] || 
	        function(callback){
	            window.setTimeout(callback, 1000/60);    // 16.7ms display frequency displayed on most monitors
	        };
})