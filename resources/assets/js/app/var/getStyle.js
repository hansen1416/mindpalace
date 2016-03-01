define(function() {

	return function (target, prop){ //get element style
        var style = document.defaultView.getComputedStyle(target, "");
        return style.getPropertyValue(prop);
    }

} );