define(function(){

    var userAgent   = navigator.userAgent.toLowerCase(),
        prefixCss    = "";

    if(/webkit/gi.test(userAgent)){
        prefixCss = "-webkit-";
    }else if(/msie | trident/gi.test(userAgent)){
        prefixCss = "-ms-";
    }else if(/mozilla/gi.test(userAgent)){
        prefixCss = "-moz-";
    }else if(/opera/gi.test(userAgent)){
        prefixCss = "-o-";
    }else{
        prefixCss = "";
    }

    return prefixCss;
});