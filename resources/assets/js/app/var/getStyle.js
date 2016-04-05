define(function() {

	return function (target, prop){ //get element style
        return document.defaultView.getComputedStyle(target, "").getPropertyValue(prop);
    }

} );