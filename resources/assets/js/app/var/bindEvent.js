/**
 * params: {event: 'event', callback: eventCallback}
 */
define(function(){
	return function bindEvent(obj, params, propa){
		if ( typeof obj._eventListeners == 'undefined' ) {
			obj._eventListeners = [];
		}

		var propagation = arguments[2] || false;

		obj.addEventListener(params.event, params.callback, propagation);
		
		var eventListeners = obj._eventListeners;
		eventListeners.push(params);
		obj._eventListeners = eventListeners;

	}
})