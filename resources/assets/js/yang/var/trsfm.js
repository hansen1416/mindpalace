define([
        "./prefixJs",
    ], function(prefixJs) { //判断浏览器支持那种transform的写法;
	return (prefixJs+"Transform" in document.documentElement.style) ? prefixJs+"Transform" : "transform";
} );