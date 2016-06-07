define([

       ], function() {

    return function (url, callback, method, async){

        method = method || 'POST';
        async  = async === undefined ? true : async;

        R = new XMLHttpRequest();

        R.onreadystatechange = function(){
            if (R.readyState === XMLHttpRequest.DONE) {
                if (R.status === 200) {
                    callback();
                } else {
                    throw 'error occured during request';
                }
            }
        };

        R.open(method, url, async);
        R.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        R.send(null);

    }

} );