define(function() {
    //get element style
	return function (target, prop){
        return document.defaultView.getComputedStyle(target, "").getPropertyValue(prop);
    }

} );