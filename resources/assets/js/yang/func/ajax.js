define([
            "../var/document"
       ], function(document) {

    return function (url, callback, method, async){

        method = method || 'POST';
        async  = async === undefined ? true : async;

        R = new XMLHttpRequest();

        R.onreadystatechange = function(){
            if (R.readyState === XMLHttpRequest.DONE) {
                if (R.status === 200) {
                    callback(R.responseText);
                } else {
                    throw 'error occured during request';
                }
            }
        };

        R.open(method, url, async);
        R.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // cross-site request forgery protection
        R.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf_token"]').getAttribute('content'));
        R.send(null);

    }

} );