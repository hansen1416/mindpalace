define(function(){

    if(/webkit/gi.test(userAgent)){
        prefixJs = "Webkit";
    }else if(/msie | trident/gi.test(userAgent)){
        prefixJs = "ms";
    }else if(/mozilla/gi.test(userAgent)){
        prefixJs = "Moz";
    }else if(/opera/gi.test(userAgent)){
        prefixJs = "O";
    }else{
        prefixJs = "";
    }

    return prefixJs;
});