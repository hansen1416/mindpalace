window.onload = function(){
	var userAgent = navigator.userAgent.toLowerCase(),
		prefix = cssPref = '';

	if(/webkit/gi.test(userAgent)){
        prefix = "-webkit-";
        cssPref = "Webkit";
    }

	var trsfm = (cssPref+"Transform" in document.documentElement.style) ? cssPref+"Transform" : "transform",
		stage = document.getElementById("stage"),
		stars = stage.querySelectorAll('.star');

	for (var i = 0; i < stars.length; i++) {
		var tier = stars[i].dataset.tier;
		
		stars[i].style[trsfm] = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,"+ parseInt(tier)*100*-1 +",1)";
		
	};


	// var stars = document.getElementsByClassName('star');

	// console.log(stars);
}