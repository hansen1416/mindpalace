define(function(){
	return function unbindEvents(obj) {
		if ( typeof obj._eventListeners == 'undefined' || obj._eventListeners.length == 0 ) {
			return;	
		}
		
		for(var i = 0, len = obj._eventListeners.length; i < len; i++) {
			var e = obj._eventListeners[i];
			obj.removeEventListener(e.event, e.callback);
		}

		obj._eventListeners = [];
	}
})