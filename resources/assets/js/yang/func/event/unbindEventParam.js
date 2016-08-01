define(function(){
	return function unbindEvents(obj) {
		if ( typeof obj._eventListeners == 'undefined' || obj._eventListeners.length == 0 ) {
			return;	
		}
		
		for(let i = 0, len = obj._eventListeners.length; i < len; i++) {
            let e = obj._eventListeners[i];
			obj.removeEventListener(e.event, e.callback);
		}

		obj._eventListeners = [];
	}
})