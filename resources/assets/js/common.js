(function(){

	var userAgent = navigator.userAgent.toLowerCase(),
		prefix = cssPref = '';

	if(/webkit/gi.test(userAgent)){
        prefix = "-webkit-";
        cssPref = "Webkit";
    }

    var trsfm = (cssPref+"Transform" in document.documentElement.style) ? cssPref+"Transform" : "transform",

})();