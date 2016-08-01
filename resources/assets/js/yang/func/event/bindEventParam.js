define(function(){
	/**
	 * params: {event: 'event', callback: eventCallback}
	 */
	return function bindEvent(obj, params, propa){
		if ( typeof obj._eventListeners == 'undefined' ) {
			obj._eventListeners = [];
		}

        let propagation = arguments[2] || false;

		obj.addEventListener(params.event, params.callback, propagation);

        let eventListeners = obj._eventListeners;
		eventListeners.push(params);
		obj._eventListeners = eventListeners;

	}
})